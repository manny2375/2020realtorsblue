import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../contexts/AuthContext';

interface FavoriteButtonProps {
  propertyId: number;
  className?: string;
  size?: number;
  showCount?: boolean;
}

export default function FavoriteButton({ 
  propertyId, 
  className = "", 
  size = 18, 
  showCount = false 
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites(user);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    try {
      await toggleFavorite(propertyId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Could show a toast notification here
    }
  };

  const favorited = isFavorited(propertyId);

  return (
    <button 
      onClick={handleToggle}
      className={`group relative transition-all duration-300 transform hover:scale-110 ${isAnimating ? 'scale-125' : 'scale-100'} ${
        favorited 
          ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25' 
          : 'bg-white/95 hover:bg-white text-slate-700 hover:text-red-500 shadow-lg backdrop-blur-sm'
      } p-3 rounded-full border border-white/20 ${className}`}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        size={size} 
        fill={favorited ? 'currentColor' : 'none'}
        className={`transition-all duration-300 ${isAnimating ? 'animate-bounce' : ''} ${
          favorited ? 'drop-shadow-sm' : 'group-hover:scale-110'
        }`}
      />
      {showCount && (
        <span className="ml-2 text-xs font-semibold">
          {favorited ? 'Saved' : 'Save'}
        </span>
      )}
      
      {/* Ripple effect */}
      {isAnimating && (
        <div className="absolute inset-0 rounded-full bg-red-400 opacity-30 animate-ping"></div>
      )}
    </button>
  );
}