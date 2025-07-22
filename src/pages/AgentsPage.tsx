import React, { useState } from 'react';
import { Phone, Mail, Star, Award, Home, Users, Calendar, MessageCircle, MapPin, Clock, CheckCircle } from 'lucide-react';

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);

  const agents = [
    {
      id: 1,
      name: "Rogelio Martinez",
      title: "Real Estate Agent",
      initials: "RM",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      phone: "(714) 470-4444",
      email: "rogelio@2020realtors.com",
      license: "01758480",
      experience: "15 Years",
      listings: 32,
      specialties: ["Luxury Homes", "First-Time Buyers", "Investment Properties"],
      languages: ["English", "Spanish"],
      bio: "Rogelio brings 15 years of dedicated real estate experience to Orange County. His expertise in luxury properties and commitment to client satisfaction has made him a trusted advisor for families seeking their perfect home.",
      stats: {
        homesSold: 180,
        avgDaysOnMarket: 16,
        clientSatisfaction: 98
      },
      certifications: ["Certified Residential Specialist (CRS)", "Accredited Buyer's Representative (ABR)"]
    },
    {
      id: 2,
      name: "Porfirio Enrique Zapata",
      title: "Real Estate Agent",
      initials: "PZ",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
      phone: "(714) 470-4444",
      email: "porfirio@2020realtors.com",
      license: "01427100",
      experience: "25 Years",
      listings: 30,
      specialties: ["Commercial Properties", "Investment Analysis", "Property Development"],
      languages: ["English", "Spanish"],
      bio: "With 25 years of experience, Porfirio is one of our most seasoned agents. His extensive knowledge of the Orange County market and commercial real estate makes him invaluable for complex transactions.",
      stats: {
        homesSold: 320,
        avgDaysOnMarket: 14,
        clientSatisfaction: 99
      },
      certifications: ["Certified Commercial Investment Member (CCIM)", "Graduate, REALTOR® Institute (GRI)"]
    },
    {
      id: 3,
      name: "Umberto Frank Autore Jr",
      title: "Real Estate Agent",
      initials: "UJ",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      phone: "(714) 470-4444",
      email: "umberto@2020realtors.com",
      license: "01436528",
      experience: "12 Years",
      listings: 28,
      specialties: ["New Construction", "Condominiums", "Relocation Services"],
      languages: ["English", "Italian", "Spanish"],
      bio: "Umberto specializes in new construction and condominium sales. His attention to detail and multilingual capabilities make him perfect for international clients and those seeking modern properties.",
      stats: {
        homesSold: 145,
        avgDaysOnMarket: 18,
        clientSatisfaction: 97
      },
      certifications: ["New Home Sales Professional", "Certified International Property Specialist (CIPS)"]
    },
    {
      id: 4,
      name: "Javier Antonio Sosa",
      title: "Real Estate Agent",
      initials: "JS",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400",
      phone: "(714) 470-4444",
      email: "javier@2020realtors.com",
      license: "01711103",
      experience: "20 Years",
      listings: 25,
      specialties: ["Family Homes", "School Districts", "Neighborhood Expert"],
      languages: ["English", "Spanish"],
      bio: "Javier's 20 years of experience and deep knowledge of Orange County school districts make him the go-to agent for families. He understands the importance of finding the right neighborhood for growing families.",
      stats: {
        homesSold: 250,
        avgDaysOnMarket: 17,
        clientSatisfaction: 98
      },
      certifications: ["Accredited Buyer's Representative (ABR)", "Military Relocation Professional (MRP)"]
    },
    {
      id: 5,
      name: "Lina Levinthal",
      title: "Real Estate Agent",
      initials: "LL",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
      phone: "(714) 470-4444",
      email: "lina@2020realtors.com",
      license: "01327698",
      experience: "18 Years",
      listings: 24,
      specialties: ["Luxury Properties", "Waterfront Homes", "High-End Condos"],
      languages: ["English", "Russian", "Spanish"],
      bio: "Lina specializes in luxury and waterfront properties throughout Orange County. Her 18 years of experience and multilingual skills have made her a favorite among high-end clientele.",
      stats: {
        homesSold: 195,
        avgDaysOnMarket: 15,
        clientSatisfaction: 99
      },
      certifications: ["Luxury Home Marketing Specialist", "Certified Residential Specialist (CRS)"]
    },
    {
      id: 6,
      name: "Henry Humberto Ferrufino",
      title: "Real Estate Agent",
      initials: "HF",
      image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
      phone: "(714) 470-4444",
      email: "henry@2020realtors.com",
      license: "02086748",
      experience: "8 Years",
      listings: 22,
      specialties: ["First-Time Buyers", "FHA/VA Loans", "Affordable Housing"],
      languages: ["English", "Spanish"],
      bio: "Henry focuses on helping first-time buyers navigate the real estate market. His expertise with FHA and VA loans has helped many families achieve their dream of homeownership.",
      stats: {
        homesSold: 95,
        avgDaysOnMarket: 20,
        clientSatisfaction: 96
      },
      certifications: ["Accredited Buyer's Representative (ABR)", "Military Relocation Professional (MRP)"]
    },
    {
      id: 7,
      name: "America Sanchez",
      title: "Real Estate Agent",
      initials: "AS",
      image: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400",
      phone: "(714) 470-4444",
      email: "america@2020realtors.com",
      license: "01741699",
      experience: "9 Years",
      listings: 20,
      specialties: ["Residential Sales", "Property Management", "Rental Properties"],
      languages: ["English", "Spanish"],
      bio: "America brings a unique perspective with her background in property management. She understands both the buying and rental markets, making her invaluable for investment property clients.",
      stats: {
        homesSold: 110,
        avgDaysOnMarket: 19,
        clientSatisfaction: 97
      },
      certifications: ["Graduate, REALTOR® Institute (GRI)", "Certified Property Manager (CPM)"]
    },
    {
      id: 8,
      name: "German Guzman",
      title: "Real Estate Agent",
      initials: "GG",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
      phone: "(714) 470-4444",
      email: "german@2020realtors.com",
      license: "01449730",
      experience: "15 Years",
      listings: 19,
      specialties: ["Investment Properties", "Multi-Family Homes", "Commercial Real Estate"],
      languages: ["English", "Spanish"],
      bio: "German specializes in investment properties and multi-family homes. His 15 years of experience and analytical approach help investors make informed decisions in the Orange County market.",
      stats: {
        homesSold: 165,
        avgDaysOnMarket: 16,
        clientSatisfaction: 98
      },
      certifications: ["Certified Commercial Investment Member (CCIM)", "Real Estate Investment Specialist"]
    },
    {
      id: 9,
      name: "Rocio Medel",
      title: "Real Estate Agent",
      initials: "RM",
      image: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400",
      phone: "(714) 470-4444",
      email: "rocio@2020realtors.com",
      license: "00924553",
      experience: "12 Years",
      listings: 18,
      specialties: ["Family Homes", "Downsizing", "Senior Housing"],
      languages: ["English", "Spanish"],
      bio: "Rocio has a special talent for helping families through major life transitions. Whether upsizing for a growing family or downsizing for retirement, she provides compassionate, expert guidance.",
      stats: {
        homesSold: 135,
        avgDaysOnMarket: 18,
        clientSatisfaction: 98
      },
      certifications: ["Seniors Real Estate Specialist (SRES)", "Accredited Buyer's Representative (ABR)"]
    },
    {
      id: 10,
      name: "Lisa Marie Schilling",
      title: "Real Estate Agent",
      initials: "LS",
      image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400",
      phone: "(714) 470-4444",
      email: "lisa@2020realtors.com",
      license: "01977038",
      experience: "11 Years",
      listings: 17,
      specialties: ["Coastal Properties", "Luxury Condos", "Vacation Homes"],
      languages: ["English"],
      bio: "Lisa specializes in coastal properties and luxury condominiums. Her knowledge of beachfront communities and vacation rental markets makes her perfect for clients seeking coastal lifestyle properties.",
      stats: {
        homesSold: 125,
        avgDaysOnMarket: 17,
        clientSatisfaction: 97
      },
      certifications: ["Resort & Second Home Property Specialist", "Luxury Home Marketing Specialist"]
    },
    {
      id: 11,
      name: "Ernie Anthony Hermosillo",
      title: "Real Estate Agent",
      initials: "EH",
      image: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
      phone: "(714) 470-4444",
      email: "ernie@2020realtors.com",
      license: "02159616",
      experience: "10 Years",
      listings: 16,
      specialties: ["New Construction", "Modern Homes", "Technology Integration"],
      languages: ["English", "Spanish"],
      bio: "Ernie focuses on new construction and modern homes with the latest technology. His understanding of smart home features and modern amenities appeals to tech-savvy buyers.",
      stats: {
        homesSold: 105,
        avgDaysOnMarket: 19,
        clientSatisfaction: 96
      },
      certifications: ["New Home Sales Professional", "Smart Home Technology Specialist"]
    },
    {
      id: 12,
      name: "Maribel Ruiz Marin",
      title: "Real Estate Agent",
      initials: "MM",
      image: "https://images.pexels.com/photos/1181562/pexels-photo-1181562.jpeg?auto=compress&cs=tinysrgb&w=400",
      phone: "(714) 470-4444",
      email: "maribel@2020realtors.com",
      license: "02143212",
      experience: "6 Years",
      listings: 14,
      specialties: ["First-Time Buyers", "Condominiums", "Affordable Housing"],
      languages: ["English", "Spanish"],
      bio: "Maribel is passionate about helping first-time buyers achieve homeownership. Her patient approach and expertise in affordable housing programs have helped many young families get started.",
      stats: {
        homesSold: 75,
        avgDaysOnMarket: 21,
        clientSatisfaction: 95
      },
      certifications: ["Accredited Buyer's Representative (ABR)", "First-Time Home Buyer Specialist"]
    }
  ];

  const teamStats = [
    { icon: Home, value: "1800+", label: "Homes Sold" },
    { icon: Users, value: "3000+", label: "Happy Clients" },
    { icon: Award, value: "180+", label: "Years Combined Experience" },
    { icon: Star, value: "4.9/5", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Meet Our Expert Team</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Our experienced real estate professionals are dedicated to helping you achieve your property goals 
            with personalized service and expert market knowledge.
          </p>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {teamStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={28} className="text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Real Estate Professionals</h2>
            <p className="text-xl text-slate-600">Get to know the experts who will guide you through your real estate journey</p>
          </div>

          <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-200">
                <div className="relative">
                  <img 
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <div className="flex items-center text-sm">
                      <Star className="text-yellow-500 mr-1" size={14} fill="currentColor" />
                      <span className="font-semibold">{agent.stats.clientSatisfaction}%</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-slate-900/80 text-white rounded-lg px-2 py-1">
                    <span className="text-sm font-bold">{agent.initials}</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{agent.name}</h3>
                  <p className="text-slate-600 text-sm mb-3">{agent.title}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>License #</span>
                      <span className="font-medium">{agent.license}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Experience</span>
                      <span className="font-medium">{agent.experience}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Active Listings</span>
                      <span className="font-medium">{agent.listings}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Homes Sold</span>
                      <span className="font-medium">{agent.stats.homesSold}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-slate-900 mb-2 text-sm">Specialties</h4>
                    <div className="flex flex-wrap gap-1">
                      {agent.specialties.slice(0, 2).map((specialty, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {specialty}
                        </span>
                      ))}
                      {agent.specialties.length > 2 && (
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                          +{agent.specialties.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 mb-3">
                    <a 
                      href={`tel:${agent.phone}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-medium transition-colors text-center flex items-center justify-center text-sm"
                    >
                      <Phone size={14} className="mr-1" />
                      Call
                    </a>
                    <a 
                      href={`mailto:${agent.email}`}
                      className="flex-1 border border-slate-300 hover:border-slate-400 text-slate-700 py-2 px-3 rounded-lg font-medium transition-colors text-center flex items-center justify-center text-sm"
                    >
                      <Mail size={14} className="mr-1" />
                      Email
                    </a>
                  </div>

                  <button
                    onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                    className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                  >
                    {selectedAgent === agent.id ? 'Hide Details' : 'View Full Profile'}
                  </button>

                  {/* Expanded Details */}
                  {selectedAgent === agent.id && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2 text-sm">About {agent.name.split(' ')[0]}</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">{agent.bio}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2 text-sm">Languages</h4>
                        <div className="flex flex-wrap gap-1">
                          {agent.languages.map((language, index) => (
                            <span key={index} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2 text-sm">All Specialties</h4>
                        <div className="flex flex-wrap gap-1">
                          {agent.specialties.map((specialty, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2 text-sm">Certifications</h4>
                        <div className="space-y-1">
                          {agent.certifications.map((cert, index) => (
                            <div key={index} className="flex items-center text-xs text-slate-600">
                              <CheckCircle size={12} className="mr-2 text-green-600" />
                              <span>{cert}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-3">
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                          <div className="text-sm font-bold text-slate-900">{agent.stats.avgDaysOnMarket}</div>
                          <div className="text-xs text-slate-600">Avg Days on Market</div>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                          <div className="text-sm font-bold text-slate-900">{agent.listings}</div>
                          <div className="text-xs text-slate-600">Active Listings</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Team */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose Our Team</h2>
            <p className="text-xl text-slate-600">Experience the difference of working with Orange County's top real estate professionals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Proven Track Record</h3>
              <p className="text-slate-600 leading-relaxed">Our agents have successfully closed over 1,800 transactions with an average of 18 days on market, well below the county average.</p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Personalized Service</h3>
              <p className="text-slate-600 leading-relaxed">We believe every client is unique. Our agents take time to understand your specific needs and provide tailored solutions for your situation.</p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Local Market Expertise</h3>
              <p className="text-slate-600 leading-relaxed">Born and raised in Orange County, our team has intimate knowledge of neighborhoods, schools, and market trends that matter to you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Work with Our Team?</h2>
          <p className="text-xl mb-8 opacity-90">Contact us today to get matched with the perfect agent for your real estate needs</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:(714)470-4444"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg flex items-center justify-center"
            >
              <Phone size={20} className="mr-2" />
              Call (714) 470-4444
            </a>
            <a 
              href="mailto:info@2020realtors.com"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center justify-center"
            >
              <Mail size={20} className="mr-2" />
              Send Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}