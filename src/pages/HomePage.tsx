import React, { useState } from 'react';
import { Search, MapPin, Bed, Bath, Square, ChevronDown, Star, Award, Users, TrendingUp, Home, Heart, Eye, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { properties, searchProperties } from '../data/properties';
import FavoriteButton from '../components/FavoriteButton';

interface HomePageProps {
  onPageChange: (page: string) => void;
  onPropertySelect?: (propertyId: number) => void;
}

export default function HomePage({ onPageChange, onPropertySelect }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: '',
    minBeds: '',
    minBaths: '',
    priceRange: ''
  });

  // State for property image carousels - Initialize with 0 for each property
  const [propertyImageIndexes, setPropertyImageIndexes] = useState<{[key: number]: number}>({});

  // Get featured properties for the homepage
  const featuredProperties = properties.filter(p => p.featured).slice(0, 3);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Store search query in sessionStorage to pass to properties page
      sessionStorage.setItem('searchQuery', searchQuery);
    }
    // Scroll to top before navigating
    window.scrollTo({ top: 0, behavior: 'instant' });
    onPageChange('properties');
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
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

  const handleViewAllProperties = () => {
    // Scroll to top before navigating to properties page
    window.scrollTo({ top: 0, behavior: 'instant' });
    onPageChange('properties');
  };

  const handleMeetOurTeam = () => {
    // Scroll to top before navigating to agents page
    window.scrollTo({ top: 0, behavior: 'instant' });
    onPageChange('agents');
  };

  // Enhanced carousel navigation functions
  const nextPropertyImage = (e: React.MouseEvent, propertyId: number) => {
    e.stopPropagation();
    e.preventDefault();
    
    const property = featuredProperties.find(p => p.id === propertyId);
    if (!property || !property.images || property.images.length <= 1) return;
    
    setPropertyImageIndexes(prev => {
      const currentIndex = prev[propertyId] || 0;
      const nextIndex = (currentIndex + 1) % property.images!.length;
      console.log(`Property ${propertyId}: ${currentIndex} -> ${nextIndex} (total: ${property.images!.length})`);
      return {
        ...prev,
        [propertyId]: nextIndex
      };
    });
  };

  const prevPropertyImage = (e: React.MouseEvent, propertyId: number) => {
    e.stopPropagation();
    e.preventDefault();
    
    const property = featuredProperties.find(p => p.id === propertyId);
    if (!property || !property.images || property.images.length <= 1) return;
    
    setPropertyImageIndexes(prev => {
      const currentIndex = prev[propertyId] || 0;
      const prevIndex = currentIndex === 0 ? property.images!.length - 1 : currentIndex - 1;
      console.log(`Property ${propertyId}: ${currentIndex} -> ${prevIndex} (total: ${property.images!.length})`);
      return {
        ...prev,
        [propertyId]: prevIndex
      };
    });
  };

  const goToPropertyImage = (e: React.MouseEvent, propertyId: number, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    
    setPropertyImageIndexes(prev => ({
      ...prev,
      [propertyId]: index
    }));
  };

  const stats = [
    { icon: Home, value: '500+', label: 'Homes Sold', color: 'from-yellow-500 to-yellow-600' },
    { icon: Users, value: '1000+', label: 'Happy Families', color: 'from-yellow-500 to-yellow-600' },
    { icon: Award, value: '15+', label: 'Years Experience', color: 'from-yellow-500 to-yellow-600' },
    { icon: TrendingUp, value: '98%', label: 'Client Satisfaction', color: 'from-yellow-500 to-yellow-600' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Mobile-First Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Modern Home"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50"></div>
          {/* Animated overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent animate-pulse"></div>
        </div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center text-white w-full">
            <div className="mb-6 sm:mb-8 animate-fade-in">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6 border border-white/20">
                <Sparkles className="text-yellow-400 mr-2" size={16} />
                <span className="text-xs sm:text-sm font-medium">Your Vision, Our Mission</span>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight animate-slide-up px-2">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                Dream Home
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-12 opacity-90 animate-slide-up animation-delay-200 px-4">
              Discover exceptional properties with Orange County's most trusted real estate team
            </p>
            
            {/* Mobile-Optimized Search Bar */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl max-w-3xl mx-auto border border-white/20 animate-slide-up animation-delay-400">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by location or keyword..."
                    className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 text-slate-900 text-base sm:text-lg border-0 focus:ring-0 focus:outline-none bg-transparent rounded-xl sm:rounded-2xl focus:bg-white/50 transition-all duration-300"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center group touch-manipulation"
                >
                  Search
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </button>
              </div>
              
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-blue-600 hover:text-blue-700 mt-4 sm:mt-6 font-medium transition-colors group touch-manipulation"
              >
                Advanced Search
                <ChevronDown className={`ml-2 transition-transform duration-300 group-hover:scale-110 ${showAdvanced ? 'rotate-180' : ''}`} size={16} />
              </button>
              
              {showAdvanced && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 animate-slide-down">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Property Type</label>
                      <select 
                        value={filters.propertyType}
                        onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                        className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 transition-all duration-300 hover:border-slate-400 text-base"
                      >
                        <option value="">All Property Types</option>
                        <option value="single family">Single Family Home</option>
                        <option value="condo">Condominium</option>
                        <option value="townhouse">Townhouse</option>
                      </select>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Bedrooms</label>
                      <select 
                        value={filters.minBeds}
                        onChange={(e) => handleFilterChange('minBeds', e.target.value)}
                        className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 transition-all duration-300 hover:border-slate-400 text-base"
                      >
                        <option value="">Any Bedrooms</option>
                        <option value="1">1+ Bedrooms</option>
                        <option value="2">2+ Bedrooms</option>
                        <option value="3">3+ Bedrooms</option>
                        <option value="4">4+ Bedrooms</option>
                      </select>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Bathrooms</label>
                      <select 
                        value={filters.minBaths}
                        onChange={(e) => handleFilterChange('minBaths', e.target.value)}
                        className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 transition-all duration-300 hover:border-slate-400 text-base"
                      >
                        <option value="">Any Bathrooms</option>
                        <option value="1">1+ Bathrooms</option>
                        <option value="2">2+ Bathrooms</option>
                        <option value="3">3+ Bathrooms</option>
                      </select>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Price Range</label>
                      <select 
                        value={filters.priceRange}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 transition-all duration-300 hover:border-slate-400 text-base"
                      >
                        <option value="">Any Price Range</option>
                        <option value="under-500k">Under $500K</option>
                        <option value="500k-1m">$500K - $1M</option>
                        <option value="1m-2m">$1M - $2M</option>
                        <option value="over-2m">$2M+</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 sm:mt-10 animate-slide-up animation-delay-600">
              <button 
                onClick={handleViewAllProperties}
                className="text-white hover:text-yellow-400 transition-all duration-300 font-medium group flex items-center justify-center mx-auto touch-manipulation"
              >
                Explore All Properties
                <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white group">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${stat.color} rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:shadow-2xl`}>
                  <stat.icon size={24} className="sm:hidden drop-shadow-sm" />
                  <stat.icon size={32} className="hidden sm:block drop-shadow-sm" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-slate-300 font-medium text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Properties with Functional Image Carousels */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-4 sm:px-6 py-2 mb-4 sm:mb-6">
              <Star className="mr-2" size={14} fill="currentColor" />
              <span className="text-xs sm:text-sm font-semibold">Featured Properties</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 px-4">Exceptional Properties</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto px-4">Discover handpicked properties in Southern California's most desirable locations</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {featuredProperties.map((property, index) => {
              const currentImageIndex = propertyImageIndexes[property.id] || 0;
              const propertyImages = property.images || [property.image];
              const hasMultipleImages = propertyImages.length > 1;
              
              return (
                <div key={property.id} className={`bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group border border-slate-100 animate-slide-up`} style={{animationDelay: `${index * 200}ms`}}>
                  <div className="relative overflow-hidden">
                    {/* Enhanced Image Carousel */}
                    <div className="relative h-56 sm:h-64 lg:h-72">
                      <img 
                        src={propertyImages[currentImageIndex]}
                        alt={`Property ${property.id} - Image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        key={`${property.id}-${currentImageIndex}`} // Force re-render when image changes
                      />
                      
                      {/* Carousel Navigation - Only show if multiple images */}
                      {hasMultipleImages && (
                        <>
                          <button 
                            onClick={(e) => prevPropertyImage(e, property.id)}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 backdrop-blur-sm z-20"
                            title="Previous image"
                            type="button"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <button 
                            onClick={(e) => nextPropertyImage(e, property.id)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 backdrop-blur-sm z-20"
                            title="Next image"
                            type="button"
                          >
                            <ChevronRight size={18} />
                          </button>
                          
                          {/* Image Dots Indicator */}
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                            {propertyImages.map((_, imgIndex) => (
                              <button
                                key={imgIndex}
                                onClick={(e) => goToPropertyImage(e, property.id, imgIndex)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                  imgIndex === currentImageIndex 
                                    ? 'bg-white scale-125 shadow-lg' 
                                    : 'bg-white/60 hover:bg-white/80'
                                }`}
                                title={`View image ${imgIndex + 1}`}
                                type="button"
                              />
                            ))}
                          </div>
                          
                          {/* Image Counter */}
                          <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm z-10">
                            {currentImageIndex + 1} / {propertyImages.length}
                          </div>
                        </>
                      )}
                      
                      {/* Property Status and Featured Badges */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex gap-2 sm:gap-3 z-10">
                        {property.featured && (
                          <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                            ✨ Featured
                          </span>
                        )}
                        <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                          {property.status}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex gap-2 sm:gap-3 z-10">
                        <FavoriteButton propertyId={property.id} size={16} className="p-2 sm:p-3" />
                        <button 
                          onClick={(e) => handleEyeIconClick(e, property.id)}
                          className="bg-white/95 hover:bg-white text-slate-700 p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/20 hover:scale-110 touch-manipulation"
                          title="View property details"
                        >
                          <Eye size={16} className="sm:hidden" />
                          <Eye size={18} className="hidden sm:block" />
                        </button>
                      </div>
                      
                      {/* Days on Market Badge */}
                      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-1 sm:py-2 shadow-lg border border-white/20 z-10">
                        <div className="flex items-center text-xs sm:text-sm font-semibold text-slate-700">
                          <span>{property.daysOnMarket} days on market</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Property Information */}
                    <div className="p-6 sm:p-8">
                      <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{property.price}</div>
                      <div className="flex items-center text-slate-600 mb-4 sm:mb-6">
                        <MapPin size={14} className="mr-2 text-blue-600 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{property.address}, {property.city}, {property.state}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-slate-700 mb-4 sm:mb-6 bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                        <div className="flex items-center flex-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3">
                            <Bed size={14} className="text-blue-600 sm:hidden" />
                            <Bed size={16} className="text-blue-600 hidden sm:block" />
                          </div>
                          <div>
                            <div className="text-base sm:text-lg font-bold">{property.beds}</div>
                            <div className="text-xs text-slate-500">beds</div>
                          </div>
                        </div>
                        <div className="flex items-center flex-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3">
                            <Bath size={14} className="text-green-600 sm:hidden" />
                            <Bath size={16} className="text-green-600 hidden sm:block" />
                          </div>
                          <div>
                            <div className="text-base sm:text-lg font-bold">{property.baths}</div>
                            <div className="text-xs text-slate-500">baths</div>
                          </div>
                        </div>
                        <div className="flex items-center flex-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3">
                            <Square size={14} className="text-purple-600 sm:hidden" />
                            <Square size={16} className="text-purple-600 hidden sm:block" />
                          </div>
                          <div>
                            <div className="text-sm sm:text-lg font-bold">{property.sqft.toLocaleString()}</div>
                            <div className="text-xs text-slate-500">sqft</div>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handlePropertyClick(property.id)}
                        className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center group touch-manipulation"
                      >
                        View Details
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-12 sm:mt-16">
            <button 
              onClick={handleViewAllProperties}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center mx-auto group touch-manipulation"
            >
              View All Properties
              <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Why Choose Us */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 px-4">Why Choose 20/20 Realtors</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto px-4">Your trusted partner in Orange County real estate with unmatched expertise and dedication</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <div className="text-center p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-neutral-50 to-white rounded-2xl sm:rounded-3xl hover:shadow-2xl transition-all duration-500 group border border-slate-100 hover:border-slate-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg group-hover:scale-110 transition-all duration-300">
                <Award size={24} className="text-white drop-shadow-sm sm:hidden" />
                <Award size={32} className="text-white drop-shadow-sm hidden sm:block" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Award Winning Service</h3>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg">Recognized for excellence in helping families find their perfect home with personalized attention and expert guidance throughout every step.</p>
            </div>
            
            <div className="text-center p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-neutral-50 to-white rounded-2xl sm:rounded-3xl hover:shadow-2xl transition-all duration-500 group border border-slate-100 hover:border-slate-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg group-hover:scale-110 transition-all duration-300">
                <Users size={24} className="text-white drop-shadow-sm sm:hidden" />
                <Users size={32} className="text-white drop-shadow-sm hidden sm:block" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">15+ Years Experience</h3>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg">Deep knowledge of Orange County market and neighborhoods, helping over 1000 families find their dream homes with unparalleled expertise.</p>
            </div>
            
            <div className="text-center p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-neutral-50 to-white rounded-2xl sm:rounded-3xl hover:shadow-2xl transition-all duration-500 group border border-slate-100 hover:border-slate-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg group-hover:scale-110 transition-all duration-300">
                <Star size={24} className="text-white drop-shadow-sm sm:hidden" />
                <Star size={32} className="text-white drop-shadow-sm hidden sm:block" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">98% Client Satisfaction</h3>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg">We respond within 24 hours guaranteed and provide exceptional service that exceeds expectations every time with proven results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6 border border-white/20">
              <Home className="text-yellow-400 mr-2" size={16} />
              <span className="text-xs sm:text-sm font-medium">Start Your Journey Today</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent px-4">Ready to Find Your Dream Home?</h2>
          <p className="text-lg sm:text-xl mb-8 sm:mb-12 opacity-90 max-w-2xl mx-auto px-4">Let our experienced team guide you through every step of your home buying journey with personalized service and expert market knowledge</p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <button 
              onClick={() => onPageChange('contact')}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center justify-center group touch-manipulation"
            >
              Get Started Today
              <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={18} />
            </button>
            <button 
              onClick={handleMeetOurTeam}
              className="bg-white/10 hover:bg-white/20 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30 flex items-center justify-center group touch-manipulation"
            >
              Meet Our Team
              <Users className="ml-3 group-hover:scale-110 transition-transform" size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}