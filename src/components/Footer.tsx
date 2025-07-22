import React from 'react';
import { MapPin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <img 
              src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/6859c1dd906b87cb5a04b328.png" 
              alt="20/20 Realtors Logo" 
              className="h-10 sm:h-14 w-auto mb-4"
            />
            <p className="text-slate-300 mb-6 leading-relaxed">
              Helping families find their perfect home in Orange County. Your vision is our mission.
              We provide exceptional real estate services with personalized attention to every client.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/2020realtors_ca/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-yellow-400 transition-colors p-2 bg-slate-800 rounded-lg group"
                title="Follow us on Instagram"
              >
                <Instagram size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://www.facebook.com/2020realtorsca" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-yellow-400 transition-colors p-2 bg-slate-800 rounded-lg group"
                title="Follow us on Facebook"
              >
                <Facebook size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Buy a Home</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Sell Your Home</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Market Reports</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Neighborhoods</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">About Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 text-yellow-400" />
                <div>
                  <p className="font-medium text-white">20/20 Realtors, Inc.</p>
                  <p>2677 N MAIN ST STE 465</p>
                  <p>SANTA ANA, CA 92705</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-slate-400 mr-2">Phone:</span>
                <span className="text-white">(714) 262-4263</span>
              </div>
              <div className="flex items-center">
                <span className="text-slate-400 mr-2">Email:</span>
                <span className="text-white">info@2020realtors.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-slate-400">
          <p>&copy; 2025 20/20 Realtors, Inc. All rights reserved. | Licensed Real Estate Broker</p>
        </div>
      </div>
    </footer>
  );
}