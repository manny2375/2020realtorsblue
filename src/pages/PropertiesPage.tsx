import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, SlidersHorizontal, MapPin, Bed, Bath, Square, Heart, Eye, Star, ArrowRight, Filter, X } from 'lucide-react';
import { properties, searchProperties, Property } from '../data/properties';
import FavoriteButton from '../components/FavoriteButton';

interface PropertiesPageProps {
  onPropertySelect?: (propertyId: number) => void;
}

export default function PropertiesPage({ onPropertySelect }: PropertiesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [filters, setFilters] = useState({
    propertyType: '',
    minBeds: '',
    minBaths: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'featured'
  });

  // Check for search query from homepage
  useEffect(() => {
    const savedQuery = sessionStorage.getItem('searchQuery');
    if (savedQuery) {
      setSearchQuery(savedQuery);
      sessionStorage.removeItem('searchQuery');
    }
  }, []);

  // Search and filter properties
  useEffect(() => {
    const searchFilters = {
      propertyType: filters.propertyType || undefined,
      minBeds: filters.minBeds ? parseInt(filters.minBeds) : undefined,
      minBaths: filters.minBaths ? parseInt(filters.minBaths) : undefined,
      minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
      sortBy: filters.sortBy
    };

    const results = searchProperties(searchQuery, searchFilters);
    setFilteredProperties(results);
  }, [searchQuery, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    // Search is already handled by useEffect, but we can add analytics or other actions here
    console.log('Searching for:', searchQuery);
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

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      propertyType: '',
      minBeds: '',
      minBaths: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'featured'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      {/* Mobile-Optimized Hero Section with Search */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-slate-900/85 to-slate-800/85 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Properties Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/70"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <div className="animate-slide-up">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6 border border-white/20">
              <Search className="text-blue-400 mr-2" size={16} />
              <span className="text-xs sm:text-sm font-medium">Property Search</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent px-4">Find Your Dream Property</h1>
            <p className="text-lg sm:text-xl mb-8 sm:mb-12 opacity-90 max-w-2xl mx-auto px-4">Browse our extensive collection of exceptional properties in Orange County's most desirable neighborhoods</p>
          </div>
          
          {/* Mobile-Optimized Search Bar */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/20 animate-slide-up animation-delay-200">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by location, MLS, or keyword..."
                  className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 text-slate-900 text-base sm:text-lg border-0 focus:ring-0 focus:outline-none bg-transparent rounded-xl sm:rounded-2xl focus:bg-white/50 transition-all duration-300"
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
                      className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white transition-all duration-300 hover:border-slate-400 text-base"
                    >
                      <option value="">All Property Types</option>
                      <option value="single family">Single Family Home</option>
                      <option value="condo">Condominium</option>
                      <option value="townhouse">Townhouse</option>
                    </select>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Minimum Bedrooms</label>
                    <select 
                      value={filters.minBeds}
                      onChange={(e) => handleFilterChange('minBeds', e.target.value)}
                      className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white transition-all duration-300 hover:border-slate-400 text-base"
                    >
                      <option value="">Any Bedrooms</option>
                      <option value="1">1+ Bedrooms</option>
                      <option value="2">2+ Bedrooms</option>
                      <option value="3">3+ Bedrooms</option>
                      <option value="4">4+ Bedrooms</option>
                      <option value="5">5+ Bedrooms</option>
                    </select>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Minimum Bathrooms</label>
                    <select 
                      value={filters.minBaths}
                      onChange={(e) => handleFilterChange('minBaths', e.target.value)}
                      className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white transition-all duration-300 hover:border-slate-400 text-base"
                    >
                      <option value="">Any Bathrooms</option>
                      <option value="1">1+ Bathrooms</option>
                      <option value="2">2+ Bathrooms</option>
                      <option value="3">3+ Bathrooms</option>
                      <option value="4">4+ Bathrooms</option>
                    </select>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">Price Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select 
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="px-2 sm:px-3 py-3 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white text-sm transition-all duration-300 hover:border-slate-400"
                      >
                        <option value="">Min Price</option>
                        <option value="500000">$500K</option>
                        <option value="750000">$750K</option>
                        <option value="1000000">$1M</option>
                        <option value="1500000">$1.5M</option>
                        <option value="2000000">$2M</option>
                      </select>
                      <select 
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="px-2 sm:px-3 py-3 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white text-sm transition-all duration-300 hover:border-slate-400"
                      >
                        <option value="">Max Price</option>
                        <option value="1000000">$1M</option>
                        <option value="1500000">$1.5M</option>
                        <option value="2000000">$2M</option>
                        <option value="3000000">$3M</option>
                        <option value="5000000">$5M+</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <button 
                    onClick={clearFilters}
                    className="text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors touch-manipulation"
                  >
                    Clear all filters
                  </button>
                  <div className="text-sm text-slate-600 font-medium bg-slate-100 px-4 py-2 rounded-full">
                    {filteredProperties.length} properties found
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 sm:mt-10 animate-slide-up animation-delay-400">
            <button className="text-white hover:text-yellow-400 transition-all duration-300 font-medium group flex items-center justify-center mx-auto touch-manipulation">
              Explore
              <ChevronDown className="ml-2 group-hover:translate-y-1 transition-transform" size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Properties Listing */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Mobile-Optimized Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
            <div className="animate-slide-up">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                {filteredProperties.length} Properties Available
              </h2>
              {searchQuery && (
                <p className="text-slate-600 mt-2 text-base sm:text-lg">
                  Results for "<span className="font-semibold text-blue-600">{searchQuery}</span>"
                </p>
              )}
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 border-2 border-slate-300 rounded-xl sm:rounded-2xl hover:border-slate-400 transition-all duration-300 bg-white shadow-lg hover:shadow-xl group touch-manipulation"
            >
              <Filter size={16} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm sm:text-base">Filters</span>
            </button>
          </div>

          {/* Mobile-Optimized Filters Panel */}
          {showFilters && (
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 shadow-xl border border-slate-200 animate-slide-down">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">Filter Properties</h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="text-slate-400 hover:text-slate-600 p-2 touch-manipulation"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide group-focus-within:text-blue-600 transition-colors">Sort By</label>
                  <select 
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg sm:rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-slate-400"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="sqft">Largest First</option>
                    <option value="days-market">Newest Listings</option>
                  </select>
                </div>
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide group-focus-within:text-blue-600 transition-colors">Property Type</label>
                  <select 
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg sm:rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-slate-400"
                  >
                    <option value="">All Types</option>
                    <option value="single family">Single Family</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
                </div>
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide group-focus-within:text-blue-600 transition-colors">Min Bedrooms</label>
                  <select 
                    value={filters.minBeds}
                    onChange={(e) => handleFilterChange('minBeds', e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg sm:rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-slate-400"
                  >
                    <option value="">Any Beds</option>
                    <option value="1">1+ Beds</option>
                    <option value="2">2+ Beds</option>
                    <option value="3">3+ Beds</option>
                    <option value="4">4+ Beds</option>
                    <option value="5">5+ Beds</option>
                  </select>
                </div>
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide group-focus-within:text-blue-600 transition-colors">Min Bathrooms</label>
                  <select 
                    value={filters.minBaths}
                    onChange={(e) => handleFilterChange('minBaths', e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg sm:rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-slate-400"
                  >
                    <option value="">Any Baths</option>
                    <option value="1">1+ Baths</option>
                    <option value="2">2+ Baths</option>
                    <option value="3">3+ Baths</option>
                    <option value="4">4+ Baths</option>
                  </select>
                </div>
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide group-focus-within:text-blue-600 transition-colors">Min Price</label>
                  <select 
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg sm:rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-slate-400"
                  >
                    <option value="">No Min</option>
                    <option value="500000">$500K</option>
                    <option value="750000">$750K</option>
                    <option value="1000000">$1M</option>
                    <option value="1500000">$1.5M</option>
                    <option value="2000000">$2M</option>
                  </select>
                </div>
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide group-focus-within:text-blue-600 transition-colors">Max Price</label>
                  <select 
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 border border-slate-300 rounded-lg sm:rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-slate-400"
                  >
                    <option value="">No Max</option>
                    <option value="1000000">$1M</option>
                    <option value="1500000">$1.5M</option>
                    <option value="2000000">$2M</option>
                    <option value="3000000">$3M</option>
                    <option value="5000000">$5M+</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                <button 
                  onClick={clearFilters}
                  className="text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors touch-manipulation"
                >
                  Clear all filters
                </button>
                <div className="text-sm text-slate-600 font-medium bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                  {filteredProperties.length} properties found
                </div>
              </div>
            </div>
          )}

          {/* Enhanced No Results Message */}
          {filteredProperties.length === 0 && (
            <div className="text-center py-16 sm:py-20 animate-fade-in">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-slate-400 sm:hidden" />
                <Search size={40} className="text-slate-400 hidden sm:block" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">No properties found</h3>
              <p className="text-slate-600 mb-6 sm:mb-8 text-base sm:text-lg max-w-md mx-auto px-4">
                Try adjusting your search criteria or filters to find more properties.
              </p>
              <button 
                onClick={clearFilters}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Mobile-Optimized Properties Grid */}
          {filteredProperties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {filteredProperties.map((property, index) => (
                <div 
                  key={property.id} 
                  className={`bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer border border-slate-100 animate-slide-up touch-manipulation`}
                  style={{animationDelay: `${index * 100}ms`}}
                  onClick={() => handlePropertyClick(property.id)}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={property.image}
                      alt="Property"
                      className="w-full h-56 sm:h-64 lg:h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex gap-2 sm:gap-3">
                      {property.featured && (
                        <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                          ✨ Featured
                        </span>
                      )}
                      <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                        {property.status}
                      </span>
                    </div>
                    <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex gap-2 sm:gap-3">
                      <FavoriteButton propertyId={property.id} size={16} className="p-2 sm:p-3" />
                      <button 
                        onClick={(e) => handleEyeIconClick(e, property.id)}
                        className="bg-white/95 hover:bg-white text-slate-700 p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg hover:scale-110 touch-manipulation"
                        title="View property details"
                      >
                        <Eye size={16} className="sm:hidden" />
                        <Eye size={18} className="hidden sm:block" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-1 sm:py-2 shadow-lg border border-white/20">
                      <div className="flex items-center text-xs sm:text-sm font-semibold">
                        <span>{property.daysOnMarket} days on market</span>
                      </div>
                    </div>
                  </div>
                  
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

                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="text-slate-600 bg-slate-100 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl">
                        ${Math.round(property.priceNumeric / property.sqft)}/sqft
                      </div>
                      <div className="text-slate-600 bg-slate-100 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl truncate max-w-[120px]">
                        {property.neighborhood}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Load More */}
          {filteredProperties.length > 0 && filteredProperties.length >= 6 && (
            <div className="text-center mt-12 sm:mt-16">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 sm:px-10 py-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center mx-auto group touch-manipulation">
                Load More Properties
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={18} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}