import React, { useState } from 'react';
import { Search, ArrowRight, MapPin, Bed, Bath, Square, Star, Award, Users, Home, Phone, Mail, ChevronDown, Eye } from 'lucide-react';
import { properties } from '../data/properties';
import FavoriteButton from '../components/FavoriteButton';

interface HomePageProps {
  onPageChange?: (page: string) => void;
  onPropertySelect?: (propertyId: number) => void;
}

export default function HomePage({ onPageChange, onPropertySelect }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Store search query for properties page
      sessionStorage.setItem('searchQuery', searchQuery);
    }
    if (onPageChange) {
      onPageChange('properties');
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

  // Get featured properties for display
  const featuredProperties = properties.filter(property => property.featured).slice(0, 3);

  const stats = [
    { icon: Home, value: "1800+", label: "Homes Sold" },
    { icon: Users, value: "3000+", label: "Happy Clients" },
    { icon: Award, value: "180+", label: "Years Combined Experience" },
    { icon: Star, value: "4.9/5", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Beautiful home exterior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/70"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/30 to-slate-900/70"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <div className="animate-slide-up">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <span className="mr-2">✨</span>
              <span className="text-sm font-medium">Your Vision, Our Mission</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Find Your Perfect<br />
              <span className="text-yellow-400">Dream Home</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Discover exceptional properties with Orange County's most trusted real estate team
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 animate-slide-up animation-delay-200 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by location, MLS, or keyword..."
                  className="w-full pl-14 pr-6 py-5 text-slate-900 text-lg border-0 focus:ring-0 focus:outline-none bg-transparent rounded-2xl focus:bg-white/50 transition-all duration-300"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-5 rounded-2xl font-semibold transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center group"
              >
                Search
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={20} />
              </button>
            </div>
          </div>
          
          <div className="mt-12 animate-slide-up animation-delay-400">
            <button className="text-white hover:text-yellow-400 transition-all duration-300 font-medium group flex items-center justify-center mx-auto">
              Explore
              <ChevronDown className="ml-2 group-hover:translate-y-1 transition-transform" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{animationDelay: `${index * 100}ms`}}>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <stat.icon size={32} className="text-white" />
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Featured Properties</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover our handpicked selection of exceptional homes in Orange County's most desirable neighborhoods
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProperties.map((property, index) => (
              <div 
                key={property.id} 
                className={`bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer border border-slate-100 animate-slide-up`}
                style={{animationDelay: `${index * 200}ms`}}
                onClick={() => handlePropertyClick(property.id)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={property.image}
                    alt="Property"
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  <div className="absolute top-6 left-6 flex gap-3">
                    <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      ✨ Featured
                    </span>
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {property.status}
                    </span>
                  </div>
                  <div className="absolute top-6 right-6 flex gap-3">
                    <FavoriteButton propertyId={property.id} size={18} className="p-3" />
                    <button 
                      onClick={(e) => handleEyeIconClick(e, property.id)}
                      className="bg-white/95 hover:bg-white text-slate-700 p-3 rounded-full transition-all duration-300 shadow-lg hover:scale-110"
                      title="View property details"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                  <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/20">
                    <div className="flex items-center text-sm font-semibold">
                      <span>{property.daysOnMarket} days on market</span>
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

                  <div className="flex items-center justify-between text-sm">
                    <div className="text-slate-600 bg-slate-100 px-3 py-2 rounded-xl">
                      ${Math.round(property.priceNumeric / property.sqft)}/sqft
                    </div>
                    <div className="text-slate-600 bg-slate-100 px-3 py-2 rounded-xl">
                      {property.neighborhood}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 animate-slide-up">
            <button 
              onClick={() => onPageChange && onPageChange('properties')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center mx-auto group"
            >
              View All Properties
              <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Why Choose 20/20 Realtors</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the difference of working with Orange County's most trusted real estate professionals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Award size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Expert Knowledge</h3>
              <p className="text-slate-600 leading-relaxed">Our team brings decades of combined experience and deep knowledge of Orange County's real estate market to every transaction.</p>
            </div>

            <div className="text-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up animation-delay-200">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Users size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Personalized Service</h3>
              <p className="text-slate-600 leading-relaxed">We believe every client is unique. Our agents take time to understand your specific needs and provide tailored solutions.</p>
            </div>

            <div className="text-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up animation-delay-400">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Star size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Proven Results</h3>
              <p className="text-slate-600 leading-relaxed">With over 1,800 successful transactions and a 4.9/5 client satisfaction rating, our results speak for themselves.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <div className="animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Dream Home?</h2>
            <p className="text-xl mb-10 opacity-90">Contact us today for a free consultation and let us help you navigate Orange County's real estate market</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href="tel:(714)262-4263"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 px-10 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center group"
              >
                <Phone size={20} className="mr-3" />
                Call (714) 262-4263
              </a>
              <button 
                onClick={() => onPageChange && onPageChange('contact')}
                className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 flex items-center justify-center group"
              >
                <Mail size={20} className="mr-3" />
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}