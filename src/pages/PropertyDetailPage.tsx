import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Square, Car, X, Phone, Mail, Calendar, Eye, Heart, Share2, Star, Award, Shield, Clock, Home, CheckCircle, User, ArrowLeft, Camera } from 'lucide-react';
import { getPropertyById } from '../data/properties';
import PropertyMap from '../components/PropertyMap';

interface PropertyDetailPageProps {
  propertyId: number;
  onBack: () => void;
}

export default function PropertyDetailPage({ propertyId, onBack }: PropertyDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAllPhotosModal, setShowAllPhotosModal] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: ''
  });

  // Ref for scrolling to specific photo in modal
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);

  const property = getPropertyById(propertyId);

  // Ensure client-side rendering consistency
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [propertyId]);

  // Scroll to selected photo when modal opens
  useEffect(() => {
    if (showAllPhotosModal && photoRefs.current[selectedPhotoIndex] && isClient) {
      setTimeout(() => {
        photoRefs.current[selectedPhotoIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [showAllPhotosModal, selectedPhotoIndex, isClient]);

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Property Not Found</h2>
          <p className="text-slate-600 mb-6">The property you're looking for doesn't exist.</p>
          <button 
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  // Use property images from the data, fallback to default if not available
  const allPropertyImages = property.images || [property.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allPropertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allPropertyImages.length) % allPropertyImages.length);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowContactModal(false);
    setFormData({ fullName: '', phone: '', email: '', message: '' });
  };

  const handleAllPhotosClick = () => {
    setSelectedPhotoIndex(currentImageIndex);
    setShowAllPhotosModal(true);
  };

  // Handle thumbnail click - opens modal and positions to that image
  const handleThumbnailClick = (index: number) => {
    setSelectedPhotoIndex(index);
    setShowAllPhotosModal(true);
  };

  // Don't render until client-side to prevent hydration mismatches
  if (!isClient) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-48 mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-slate-200 rounded-2xl mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="aspect-[4/3] bg-slate-200 rounded-2xl"></div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-64 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <button 
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Properties
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            {/* Main Image Carousel - All images */}
            <div className="relative mb-8">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={allPropertyImages[currentImageIndex]}
                  alt="Property"
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 p-3 rounded-full transition-all shadow-lg hover:scale-110"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 p-3 rounded-full transition-all shadow-lg hover:scale-110"
                >
                  <ChevronRight size={20} />
                </button>
                
                {/* All Photos Button */}
                <button 
                  onClick={handleAllPhotosClick}
                  className="absolute bottom-6 left-6 bg-slate-900/90 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center backdrop-blur-sm border border-white/20 shadow-lg hover:scale-105"
                >
                  <Camera size={18} className="mr-3" />
                  All photos ({allPropertyImages.length})
                </button>
                
                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/20">
                  <span className="text-sm font-semibold text-slate-900">{currentImageIndex + 1} / {allPropertyImages.length}</span>
                </div>
              </div>
            </div>

            {/* Thumbnail Strip - Shows all images as clickable thumbnails */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">All Photos</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
                {allPropertyImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg' 
                        : 'hover:shadow-lg hover:scale-105'
                    }`}
                  >
                    <img 
                      src={image}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-blue-500/20' 
                        : 'bg-black/0 group-hover:bg-black/20'
                    }`}></div>
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                    {index === currentImageIndex && (
                      <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center">
                        <Eye size={10} className="mr-1" />
                        Current
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Map Section */}
            <div className="mb-12">
              <PropertyMap
                address={property.address}
                city={property.city}
                state={property.state}
                zipCode={property.zipCode}
                propertyTitle={`${property.address}, ${property.city}`}
              />
            </div>

            {/* About This Home */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About this home</h2>
              <p className="text-slate-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Facts & Features */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Facts & features</h2>
              
              {/* Interior Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Home className="text-blue-600 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-slate-900">Interior</h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Bedrooms & bathrooms</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Bedrooms:</span>
                        <span className="font-medium">{property.beds}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Bathrooms:</span>
                        <span className="font-medium">{property.baths}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Full bathrooms:</span>
                        <span className="font-medium">{Math.floor(property.baths)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Half bathrooms:</span>
                        <span className="font-medium">{property.baths % 1 > 0 ? 1 : 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Features</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Property Type:</span>
                        <span className="font-medium">{property.propertyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Neighborhood:</span>
                        <span className="font-medium text-blue-600">{property.neighborhood}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">School District:</span>
                        <span className="font-medium">{property.schoolDistrict}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Interior area</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Living area:</span>
                        <span className="font-medium">{property.sqft.toLocaleString()} sq ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Price per sq ft:</span>
                        <span className="font-medium">${Math.round(property.priceNumeric / property.sqft)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Shield className="text-blue-600 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-slate-900">Property</h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Location</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Address:</span>
                        <span className="font-medium">{property.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">City:</span>
                        <span className="font-medium">{property.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">ZIP Code:</span>
                        <span className="font-medium">{property.zipCode}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Lot</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Size:</span>
                        <span className="font-medium">{property.lotSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Days on Market:</span>
                        <span className="font-medium">{property.daysOnMarket}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Construction</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Year built:</span>
                        <span className="font-medium">{property.yearBuilt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Property age:</span>
                        <span className="font-medium">{2024 - property.yearBuilt} years</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's Special */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">What's special</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Property Details */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Price and Status */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">{property.status}</span>
                  {property.featured && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Featured</span>
                  )}
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{property.price}</div>
                <div className="flex items-center text-slate-600 mb-4">
                  <MapPin size={16} className="mr-1" />
                  <span>{property.address}, {property.city}, {property.state}</span>
                </div>
                
                {/* Property Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{property.beds}</div>
                    <div className="text-sm text-slate-600">beds</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{property.baths}</div>
                    <div className="text-sm text-slate-600">baths</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{property.sqft.toLocaleString()}</div>
                    <div className="text-sm text-slate-600">sqft</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowContactModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Request a tour
                  </button>
                  <button 
                    onClick={() => setShowContactModal(true)}
                    className="w-full border border-slate-300 hover:border-slate-400 text-slate-700 py-3 rounded-lg font-medium transition-colors"
                  >
                    Contact agent
                  </button>
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6 shadow-sm">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Property Type</span>
                    <span className="font-medium">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Year Built</span>
                    <span className="font-medium">{property.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Lot Size</span>
                    <span className="font-medium">{property.lotSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Price/sqft</span>
                    <span className="font-medium">${Math.round(property.priceNumeric / property.sqft)}/sqft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">MLS #</span>
                    <span className="font-medium">{property.mls}</span>
                  </div>
                </div>
              </div>

              {/* Agent Info */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mr-3">
                    <User className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">20/20 Realtors Team</div>
                    <div className="text-sm text-slate-600">Listing Agent</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center">
                    <Phone size={14} className="mr-2" />
                    <a href="tel:(714)262-4263" className="hover:text-blue-600">(714) 262-4263</a>
                  </div>
                  <div className="flex items-center">
                    <Mail size={14} className="mr-2" />
                    <a href="mailto:info@2020realtors.com" className="hover:text-blue-600">info@2020realtors.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Photos Modal - Shows all images */}
      {showAllPhotosModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50">
          <div className="relative w-full h-full max-w-[95vw] max-h-[95vh] overflow-hidden">
            <button 
              onClick={() => setShowAllPhotosModal(false)}
              className="absolute top-6 right-6 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-3 backdrop-blur-sm transition-all hover:scale-110"
            >
              <X size={28} />
            </button>
            
            <div className="h-full overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {allPropertyImages.map((image, index) => (
                  <div 
                    key={index} 
                    ref={(el) => photoRefs.current[index] = el}
                    className={`relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 ${
                      index === selectedPhotoIndex ? 'ring-4 ring-blue-500 ring-opacity-75' : ''
                    }`}
                  >
                    <img 
                      src={image}
                      alt={`Property photo ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-6 left-6 bg-black/80 text-white px-4 py-2 rounded-xl text-sm font-medium opacity-0 hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                      Photo {index + 1} of {allPropertyImages.length}
                    </div>
                    {index === selectedPhotoIndex && (
                      <div className="absolute top-6 left-6 bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm shadow-lg">
                        <Eye size={14} className="inline mr-2" />
                        Currently viewing
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-8 py-4 rounded-2xl backdrop-blur-sm border border-white/20">
              <span className="text-lg font-semibold">{allPropertyImages.length} photos total</span>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Schedule Your Tour</h3>
            <p className="text-slate-600 mb-6">We'll contact you within 24 hours to confirm your appointment</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Your Full Name"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="When would you like to schedule your tour?"
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
              >
                SCHEDULE MY TOUR
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}