import { useState, useEffect, useCallback } from 'react';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface UseFavoritesReturn {
  favorites: number[];
  isFavorited: (propertyId: number) => boolean;
  toggleFavorite: (propertyId: number) => Promise<void>;
  syncFavorites: () => Promise<void>;
  isLoading: boolean;
}

export function useFavorites(user?: User | null): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    
    try {
      if (user) {
        // Authenticated user: load from API
        const response = await fetch('/api/favorites', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const favoriteIds = data.favorites.map((fav: any) => fav.property_id || fav.id);
          setFavorites(favoriteIds);
        } else {
          // Fallback to localStorage if API fails
          loadFromLocalStorage();
        }
      } else {
        // Anonymous user: load from localStorage
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const loadFromLocalStorage = () => {
    const savedFavorites = localStorage.getItem('favoriteProperties');
    if (savedFavorites) {
      try {
        const favoriteIds = JSON.parse(savedFavorites);
        setFavorites(favoriteIds);
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        setFavorites([]);
      }
    }
  };

  const saveToLocalStorage = (favoriteIds: number[]) => {
    localStorage.setItem('favoriteProperties', JSON.stringify(favoriteIds));
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('favoritesChanged', { 
      detail: { favorites: favoriteIds } 
    }));
  };

  const isFavorited = useCallback((propertyId: number) => {
    return favorites.includes(propertyId);
  }, [favorites]);

  const toggleFavorite = useCallback(async (propertyId: number) => {
    const isCurrentlyFavorited = isFavorited(propertyId);
    const newFavorites = isCurrentlyFavorited
      ? favorites.filter(id => id !== propertyId)
      : [...favorites, propertyId];

    // Optimistic update
    setFavorites(newFavorites);
    saveToLocalStorage(newFavorites);

    try {
      if (user) {
        // Authenticated user: sync with API
        const method = isCurrentlyFavorited ? 'DELETE' : 'POST';
        const url = isCurrentlyFavorited 
          ? `/api/favorites/${propertyId}`
          : '/api/favorites';
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`,
          },
          body: method === 'POST' ? JSON.stringify({ propertyId }) : undefined,
        });

        if (!response.ok) {
          // Revert on API failure
          setFavorites(favorites);
          saveToLocalStorage(favorites);
          throw new Error('Failed to sync with server');
        }
      }
    } catch (error) {
      console.error('Error syncing favorite:', error);
      // The optimistic update remains, so user doesn't see the failure
      // but we could show a toast notification here
    }
  }, [favorites, isFavorited, user]);

  const syncFavorites = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Get localStorage favorites
      const localFavorites = localStorage.getItem('favoriteProperties');
      const localFavoriteIds = localFavorites ? JSON.parse(localFavorites) : [];

      if (localFavoriteIds.length > 0) {
        // Sync localStorage favorites to database
        const response = await fetch('/api/favorites/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`,
          },
          body: JSON.stringify({ favoriteIds: localFavoriteIds }),
        });

        if (response.ok) {
          // Clear localStorage after successful sync
          localStorage.removeItem('favoriteProperties');
        }
      }

      // Reload favorites from database
      await loadFavorites();
    } catch (error) {
      console.error('Error syncing favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, loadFavorites]);

  return {
    favorites,
    isFavorited,
    toggleFavorite,
    syncFavorites,
    isLoading,
  };
}