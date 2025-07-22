import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Bed, Bath, Square, Trash2, Eye, Share2, User, LogIn, Star, ArrowRight, Sparkles } from 'lucide-react';
import { properties, Property } from '../data/properties';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../contexts/AuthContext';

interface FavoritesPageProps {
  onPropertySelect?: (propertyId: number) => void;
  onPageChange?: (page: string) => void;
  onOpenSignInModal?: () => void;
}

export default function FavoritesPage({ onPropertySelect, onPageChange, onOpenSignInModal }: FavoritesPageProps) {
  const { user } = useAuth();
  const { favorites, toggleFavorite, isLoading } = useFavorites(user);
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);

  useEffect(() => {
    // Filter properties based on favorites
    const filteredProperties = properties.filter(property => favorites.includes(property.id));
    setFavoriteProperties(filteredProperties);
  }, [favorites]);

  const handleRemoveFromFavorites = async (propertyId: number) => {
    try {
      await toggleFavorite(propertyId);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const handlePropertyClick = (propertyId: number) => {
    // Scroll to top before navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (onPropertySelect) {
      onPropertySelect(propertyId);
    }
  };

  const handleEyeIconClick = (e: React.MouseEvent, propertyId: number) => {
    e.stopPropagation(); // Prevent triggering parent click events
    // Scroll to top immediately for eye icon clicks
    window.scrollTo({ top: 0, behavior: 'instant' });
    handlePropertyClick(propertyId);
  };

  const handleBrowseProperties = () => {
    if (onPageChange) {
      onPageChange('properties');
    }
  };

  const handleSignInClick = () => {
    if (onOpenSignInModal) {
      onOpenSignInModal();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="animate-pulse">
            <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl w-80 mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl h-96 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      {/* Enhanced Header */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="animate-slide-up">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20">
                <Heart className="text-red-400 mr-2" size={20} fill="currentColor" />
                <span className="text-sm font-medium">
                  {user ? 'Your Saved Properties' : 'Favorite Properties'}
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                {user ? `${user.firstName}'s Favorites` : 'My Favorites'}
              </h1>
              <p className="text-xl opacity-90 mb-4">
                {favoriteProperties.length} saved {favoriteProperties.length === 1 ? 'property' : 'properties'}
              </p>
              {!user && favoriteProperties.length > 0 && (
                <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-4 max-w-md">
                  <p className="text-blue-200 text-sm flex items-center">
                    <LogIn size={16} className="mr-2" />
                    Sign in to sync your favorites across devices
                  </p>
                </div>
              )}
            </div>
            <div className="hidden md:flex items-center space-x-6 animate-slide-up animation-delay-200">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <Heart size={40} className="text-red-400" fill="currentColor" />
              </div>
              {user && (
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <User size={40} className="text-blue-400" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Favorites Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {favoriteProperties.length === 0 ? (
            // Enhanced Empty State
            <div className="text-center py-24 animate-fade-in">
              <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Heart size={48} className="text-slate-400" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">No favorites yet</h2>
              <p className="text-xl text-slate-600 mb-12 max-w-md mx-auto">
                Start browsing properties and click the heart icon to save your favorites here.
              </p>
              
              {!user && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-3xl p-8 max-w-md mx-auto mb-8 shadow-lg">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-3">
                      <LogIn size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-900">Sign in for more features</h3>
                  </div>
                  <p className="text-blue-700 mb-6 leading-relaxed">
                    Create an account to sync favorites across devices and get personalized recommendations.
                  </p>
                  <button 
                    onClick={handleSignInClick}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation"
                  >
                    Sign In / Register
                  </button>
                </div>
              )}
              
              <button 
                onClick={handleBrowseProperties}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center mx-auto group touch-manipulation"
              >
                Browse Properties
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={20} />
              </button>
            </div>
          ) : (
            // Enhanced Favorites Grid
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-bold text-slate-900">Saved Properties</h2>
                <div className="flex items-center space-x-6">
                  {!user && (
                    <button 
                      onClick={handleSignInClick}
                      className="text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full border border-blue-200 flex items-center transition-all duration-300 hover:scale-105 touch-manipulation"
                    >
                      <Sparkles size={14} className="mr-2" />
                      Sign in to sync across devices
                    </button>
                  )}
                  <div className="text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-full">
                    Total estimated value: {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(favoriteProperties.reduce((sum, property) => sum + property.priceNumeric, 0))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {favoriteProperties.map((property, index) => (
                  <div 
                    key={property.id} 
                    className={`bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group border border-slate-100 animate-slide-up`}
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={property.image}
                        alt="Property"
                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                        onClick={() => handlePropertyClick(property.id)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      <div className="absolute top-6 left-6 flex gap-3">
                        {property.featured && (
                          <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            ✨ Featured
                          </span>
                        )}
                        <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          {property.status}
                        </span>
                      </div>
                      <div className="absolute top-6 right-6 flex gap-3">
                        <button 
                          onClick={() => handleRemoveFromFavorites(property.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:scale-110"
                          title="Remove from favorites"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="bg-white/95 hover:bg-white text-slate-700 p-3 rounded-full transition-all duration-300 shadow-lg hover:scale-110">
                          <Share2 size={18} />
                        </button>
                      </div>
                      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/20">
                        <div className="flex items-center text-sm font-semibold">
                          <Heart size={14} className="mr-2 text-red-500" fill="currentColor" />
                          <span className={user ? 'text-green-600' : 'text-blue-600'}>
                            {user ? 'Synced' : 'Local'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <div className="text-3xl font-bold text-slate-900 mb-3 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{property.price}</div>
                      <div className="flex items-center text-slate-600 mb-6">
                        <MapPin size={16} className="mr-2 text-blue-600" />
                        <span className="text-sm font-medium">{property.address}, {property.city}, {property.state}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-slate-700 mb-6 bg-slate-50 rounded-2xl p-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                            <Bed size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <div className="text-lg font-bold">{property.beds}</div>
                            <div className="text-xs text-slate-500">beds</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                            <Bath size={16} className="text-green-600" />
                          </div>
                          <div>
                            <div className="text-lg font-bold">{property.baths}</div>
                            <div className="text-xs text-slate-500">baths</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
                            <Square size={16} className="text-purple-600" />
                          </div>
                          <div>
                            <div className="text-lg font-bold">{property.sqft.toLocaleString()}</div>
                            <div className="text-xs text-slate-500">sqft</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-6 text-sm">
                        <div className="text-slate-600 bg-slate-100 px-3 py-2 rounded-xl">
                          ${Math.round(property.priceNumeric / property.sqft)}/sqft
                        </div>
                        <div className="text-slate-600 bg-slate-100 px-3 py-2 rounded-xl">
                          {property.neighborhood}
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button 
                          onClick={(e) => handleEyeIconClick(e, property.id)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl"
                        >
                          <Eye size={16} className="mr-2" />
                          View Details
                        </button>
                        <button 
                          onClick={() => handleRemoveFromFavorites(property.id)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Favorites Actions */}
              <div className="mt-16 bg-gradient-to-br from-slate-50 to-white rounded-3xl p-12 shadow-xl border border-slate-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Star size={28} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-6">Ready to take the next step?</h3>
                  <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                    Schedule tours for your favorite properties or get more information from our expert agents.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center group">
                      Schedule Tours
                      <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={20} />
                    </button>
                    <button className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:bg-slate-50 flex items-center justify-center group">
                      Contact Agent
                      <User className="ml-3 group-hover:scale-110 transition-transform" size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}