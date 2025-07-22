import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ExternalLink, Navigation, Clock, School, ShoppingBag, TreePine, Maximize2, Minimize2, Eye, X } from 'lucide-react';

interface PropertyMapProps {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyTitle?: string;
  onMapOpen?: () => void;
}

// Mapbox configuration
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFubnkyMzc1IiwiYSI6ImNtY251eDc1ZjBiOWgyanEzZWczNGxuc20ifQ.acHcQwu9Iygr1SWZOJEV0w';

export default function PropertyMap({ address, city, state, zipCode, propertyTitle, onMapOpen }: PropertyMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const modalMapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const modalMapInstanceRef = useRef<any>(null);
  
  // Create the full address for the map
  const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;
  const encodedAddress = encodeURIComponent(fullAddress);
  
  // External map URLs
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  const mapsUrl = `https://www.google.com/maps/search/${encodedAddress}`;

  // Geocoding function to get coordinates from address
  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lat, lng };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Create map instance
  const createMapInstance = async (container: HTMLDivElement, isModal = false) => {
    try {
      // Import Mapbox GL JS dynamically
      const mapboxgl = await import('mapbox-gl');
      
      // Set the access token
      mapboxgl.default.accessToken = MAPBOX_TOKEN;

      // Create the map with enhanced styling
      const map = new mapboxgl.default.Map({
        container,
        style: 'mapbox://styles/mapbox/streets-v12', // Professional street style
        center: [coordinates?.lng || -117.8311, coordinates?.lat || 33.7175],
        zoom: isModal ? 17 : 15.5, // Optimal zoom levels
        pitch: isModal ? 50 : 35, // Professional tilt
        bearing: 0,
        antialias: true,
        attributionControl: false // We'll add custom attribution
      });

      // Add custom attribution control (cleaner)
      map.addControl(new mapboxgl.default.AttributionControl({
        customAttribution: '© 20/20 Realtors'
      }), 'bottom-right');

      // Add navigation controls
      map.addControl(new mapboxgl.default.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true
      }), 'top-right');

      // Add fullscreen control for modal
      if (isModal) {
        map.addControl(new mapboxgl.default.FullscreenControl(), 'top-right');
      }

      // Add scale control
      map.addControl(new mapboxgl.default.ScaleControl({
        maxWidth: 100,
        unit: 'imperial'
      }), 'bottom-left');

      // Wait for map to load
      map.on('load', () => {
        if (!isModal) setMapLoaded(true);

        // Add enhanced 3D buildings layer
        if (!map.getLayer('3d-buildings')) {
          map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 14,
            'paint': {
              'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['get', 'height'],
                0, '#e2e8f0',
                50, '#cbd5e1',
                100, '#94a3b8'
              ],
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                14,
                0,
                14.05,
                ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                14,
                0,
                14.05,
                ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.8
            }
          });
        }

        // Create enhanced custom marker
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-property-marker';
        markerElement.innerHTML = `
          <div class="marker-container">
            <div class="marker-pulse"></div>
            <div class="marker-pin">
              <div class="marker-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" fill="#DC2626" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="10" r="4" fill="white"/>
                  <path d="M9 10L11 12L15 8" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        `;

        // Enhanced marker styles
        if (!document.querySelector('#enhanced-mapbox-marker-styles')) {
          const style = document.createElement('style');
          style.id = 'enhanced-mapbox-marker-styles';
          style.textContent = `
            .custom-property-marker {
              cursor: pointer;
              transform-origin: center bottom;
              transition: transform 0.3s ease;
            }
            .custom-property-marker:hover {
              transform: scale(1.1);
            }
            .marker-container {
              position: relative;
              width: 50px;
              height: 50px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .marker-pulse {
              position: absolute;
              width: 50px;
              height: 50px;
              border-radius: 50%;
              background: rgba(220, 38, 38, 0.25);
              animation: enhanced-pulse 3s infinite;
            }
            .marker-pin {
              position: relative;
              z-index: 2;
              filter: drop-shadow(0 4px 8px rgba(0,0,0,0.25));
            }
            .marker-icon {
              background: white;
              border-radius: 50%;
              padding: 2px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            }
            @keyframes enhanced-pulse {
              0% {
                transform: scale(0.8);
                opacity: 1;
              }
              50% {
                transform: scale(1.2);
                opacity: 0.7;
              }
              100% {
                transform: scale(2);
                opacity: 0;
              }
            }
            
            /* Custom popup styles */
            .mapboxgl-popup-content {
              border-radius: 12px !important;
              box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
              border: 1px solid #e2e8f0 !important;
              padding: 0 !important;
              max-width: 300px !important;
            }
            .mapboxgl-popup-tip {
              border-top-color: white !important;
            }
            .mapboxgl-popup-close-button {
              font-size: 18px !important;
              padding: 8px !important;
              color: #64748b !important;
            }
            .mapboxgl-popup-close-button:hover {
              background: #f1f5f9 !important;
              color: #334155 !important;
            }
          `;
          document.head.appendChild(style);
        }

        // Add the enhanced marker to the map
        const marker = new mapboxgl.default.Marker(markerElement)
          .setLngLat([coordinates?.lng || -117.8311, coordinates?.lat || 33.7175])
          .addTo(map);

        // Enhanced popup with better styling
        const popup = new mapboxgl.default.Popup({ 
          offset: 35,
          closeButton: true,
          closeOnClick: false,
          maxWidth: '300px'
        }).setHTML(`
          <div class="p-4">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h3 class="font-bold text-slate-900 text-lg mb-1">${propertyTitle || 'Property Location'}</h3>
                <p class="text-sm text-slate-600 leading-relaxed">${fullAddress}</p>
              </div>
            </div>
            
            <div class="border-t border-slate-100 pt-3 mt-3">
              <div class="grid grid-cols-2 gap-2">
                <a href="${directionsUrl}" target="_blank" 
                   class="flex items-center justify-center text-xs bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="mr-1">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                  Directions
                </a>
                <a href="${mapsUrl}" target="_blank" 
                   class="flex items-center justify-center text-xs border border-slate-300 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="mr-1">
                    <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                  Google Maps
                </a>
              </div>
            </div>
            
            <div class="mt-3 pt-3 border-t border-slate-100">
              <div class="flex items-center text-xs text-slate-500">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="mr-1">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Click marker to view details
              </div>
            </div>
          </div>
        `);

        marker.setPopup(popup);

        // Enhanced marker interactions
        markerElement.addEventListener('click', (e) => {
          e.stopPropagation();
          if (popup.isOpen()) {
            popup.remove();
          } else {
            popup.addTo(map);
          }
        });

        // Auto-show popup for modal with delay
        if (isModal) {
          setTimeout(() => {
            popup.addTo(map);
          }, 800);
        }

        // Add smooth animations
        map.on('click', () => {
          if (popup.isOpen()) {
            popup.remove();
          }
        });

        // Enhanced map interactions
        map.on('mouseenter', () => {
          map.getCanvas().style.cursor = 'grab';
        });

        map.on('mousedown', () => {
          map.getCanvas().style.cursor = 'grabbing';
        });

        map.on('mouseup', () => {
          map.getCanvas().style.cursor = 'grab';
        });
      });

      map.on('error', (e) => {
        console.error('Mapbox error:', e);
        if (!isModal) {
          setMapError(true);
          setMapLoaded(true);
        }
      });

      return map;

    } catch (error) {
      console.error('Map initialization error:', error);
      if (!isModal) {
        setMapError(true);
        setMapLoaded(true);
      }
      return null;
    }
  };

  // Initialize main map
  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      // First, try to geocode the address
      const coords = await geocodeAddress(fullAddress);
      
      if (coords) {
        setCoordinates(coords);
      } else {
        // Enhanced fallback coordinates based on city
        let fallbackCoords = { lat: 33.7175, lng: -117.8311 }; // Default Orange County
        
        if (city.toLowerCase().includes('orange')) {
          fallbackCoords = { lat: 33.7879, lng: -117.8531 };
        } else if (city.toLowerCase().includes('corona')) {
          fallbackCoords = { lat: 33.8753, lng: -117.5664 };
        } else if (city.toLowerCase().includes('santa ana')) {
          fallbackCoords = { lat: 33.7455, lng: -117.8677 };
        } else if (city.toLowerCase().includes('irvine')) {
          fallbackCoords = { lat: 33.6846, lng: -117.8265 };
        } else if (city.toLowerCase().includes('newport')) {
          fallbackCoords = { lat: 33.6189, lng: -117.9298 };
        }
        
        setCoordinates(fallbackCoords);
      }

      const map = await createMapInstance(mapRef.current!);
      mapInstanceRef.current = map;
    };

    initializeMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [fullAddress, propertyTitle]);

  // Initialize modal map when modal opens
  useEffect(() => {
    if (showMapModal && modalMapRef.current && coordinates) {
      const initializeModalMap = async () => {
        const map = await createMapInstance(modalMapRef.current!, true);
        modalMapInstanceRef.current = map;
      };

      initializeModalMap();
    }

    // Cleanup modal map when modal closes
    return () => {
      if (modalMapInstanceRef.current) {
        modalMapInstanceRef.current.remove();
        modalMapInstanceRef.current = null;
      }
    };
  }, [showMapModal, coordinates]);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Resize map after fullscreen toggle
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.resize();
      }
    }, 100);
  };

  // Handle opening interactive map modal
  const openMapModal = () => {
    setShowMapModal(true);
    if (onMapOpen) {
      onMapOpen();
    }
  };

  // Handle closing map modal
  const closeMapModal = () => {
    setShowMapModal(false);
  };

  return (
    <>
      <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 ${
        isFullscreen ? 'fixed inset-4 z-50' : ''
      }`}>
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center">
                <MapPin size={20} className="mr-2 text-blue-600" />
                Location & Neighborhood
              </h3>
              <div className="flex items-center text-slate-600">
                <span className="font-medium">{fullAddress}</span>
              </div>
              {coordinates && (
                <div className="text-xs text-slate-500 mt-1 font-mono">
                  Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
                </div>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={toggleFullscreen}
                className="flex items-center px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                title={isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={14} className="mr-1" /> : <Maximize2 size={14} className="mr-1" />}
                {isFullscreen ? 'Exit' : 'Fullscreen'}
              </button>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                title="Get directions via Google Maps"
              >
                <Navigation size={14} className="mr-1" />
                Directions
              </a>
              <button
                onClick={openMapModal}
                className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                title="Open interactive map view"
              >
                <Eye size={14} className="mr-1" />
                Interactive Map
              </button>
            </div>
          </div>
        </div>
        
        <div className="relative">
          {/* Enhanced Mapbox Map Container */}
          <div 
            ref={mapRef}
            className={`relative bg-gradient-to-br from-blue-50 via-slate-50 to-green-50 ${
              isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-96'
            }`}
          >
            {/* Enhanced Loading State */}
            {!mapLoaded && !mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                    <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-r-green-400 animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                  </div>
                  <p className="text-slate-700 font-medium">Loading interactive map...</p>
                  <p className="text-slate-500 text-sm mt-1">Powered by Mapbox</p>
                </div>
              </div>
            )}
            
            {/* Enhanced Error State */}
            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin size={32} className="text-red-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">Map Temporarily Unavailable</h4>
                  <p className="text-slate-600 mb-4">Unable to load the interactive map at this time</p>
                  <div className="flex gap-2 justify-center">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                    >
                      <ExternalLink size={14} className="mr-1" />
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Click overlay to open modal */}
            {mapLoaded && !mapError && (
              <button
                onClick={openMapModal}
                className="absolute inset-0 bg-transparent hover:bg-black/5 transition-all duration-300 flex items-center justify-center group"
                title="Click to open interactive map"
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105 border border-white/50">
                  <div className="flex items-center text-slate-700 font-medium">
                    <Eye size={18} className="mr-2 text-blue-600" />
                    Click to explore interactive map
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
        
        {/* Enhanced Neighborhood Info */}
        <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
            <TreePine size={18} className="mr-2 text-green-600" />
            Nearby Amenities
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <School size={20} className="text-blue-600" />
              </div>
              <div className="text-blue-600 font-semibold">Schools</div>
              <div className="text-slate-600 text-xs">Within 1 mile</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag size={20} className="text-green-600" />
              </div>
              <div className="text-green-600 font-semibold">Shopping</div>
              <div className="text-slate-600 text-xs">5 min drive</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TreePine size={20} className="text-purple-600" />
              </div>
              <div className="text-purple-600 font-semibold">Parks</div>
              <div className="text-slate-600 text-xs">Walking distance</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock size={20} className="text-orange-600" />
              </div>
              <div className="text-orange-600 font-semibold">Transit</div>
              <div className="text-slate-600 text-xs">Bus stops nearby</div>
            </div>
          </div>
          
          {/* Enhanced Location Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100">
            <h5 className="font-medium text-slate-900 mb-3 flex items-center">
              <MapPin size={16} className="mr-2 text-blue-600" />
              Location Highlights
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Easy freeway access
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Family-friendly neighborhood
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Excellent school ratings
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                Close to shopping centers
              </div>
            </div>
          </div>
          
          {/* Enhanced Quick Actions */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Navigation size={14} className="mr-2" />
              Get Directions
            </a>
            <button
              onClick={openMapModal}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Eye size={14} className="mr-2" />
              Interactive Map
            </button>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
            >
              <ExternalLink size={14} className="mr-2" />
              Google Maps
            </a>
          </div>
          
          {/* Professional Attribution */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Professional mapping by <span className="font-medium text-blue-600">20/20 Realtors</span> • 
              Powered by <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Mapbox</a>
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Interactive Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="relative w-full h-full max-w-7xl max-h-[95vh] bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            {/* Enhanced Modal Header */}
            <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 p-4 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center">
                    <MapPin size={20} className="mr-2 text-blue-600" />
                    {propertyTitle || 'Property Location'}
                  </h3>
                  <p className="text-sm text-slate-600">{fullAddress}</p>
                  {coordinates && (
                    <p className="text-xs text-slate-500 font-mono mt-1">
                      {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <Navigation size={14} className="mr-1" />
                    Directions
                  </a>
                  <button
                    onClick={closeMapModal}
                    className="flex items-center px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                  >
                    <X size={14} className="mr-1" />
                    Close
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Modal Map Container */}
            <div 
              ref={modalMapRef}
              className="w-full h-full pt-20 pb-16"
              style={{ minHeight: '500px' }}
            >
              {/* Enhanced loading state for modal map */}
              {!modalMapInstanceRef.current && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 pt-20 pb-16">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                      <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-green-400 animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '2s'}}></div>
                    </div>
                    <p className="text-slate-700 text-lg font-medium">Loading interactive map...</p>
                    <p className="text-slate-500 text-sm mt-2">Preparing detailed view with 3D buildings</p>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Modal Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="text-slate-600">
                  <span className="font-medium">Navigation:</span> Mouse to pan • Scroll to zoom • Ctrl+drag to rotate • Click marker for details
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Open in Google Maps
                  </a>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">Powered by Mapbox</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}