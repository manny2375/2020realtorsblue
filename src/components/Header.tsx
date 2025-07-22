import React, { useState } from 'react';
import { Heart, User, X, LogIn, UserPlus, Menu, Phone, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  showSignInModal: boolean;
  setShowSignInModal: (show: boolean) => void;
}

export default function Header({ currentPage, onPageChange, showSignInModal, setShowSignInModal }: HeaderProps) {
  const { user, login, register, logout, isLoading } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      if (isLoginMode) {
        // Login
        const result = await login(formData.email, formData.password);
        if (result.success) {
          setShowSignInModal(false);
          setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
        } else {
          setFormError(result.error || 'Login failed');
        }
      } else {
        // Registration
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
          setFormError('Please fill in all required fields');
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          setFormError('Passwords do not match');
          return;
        }

        const result = await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });

        if (result.success) {
          setShowSignInModal(false);
          setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
        } else {
          setFormError(result.error || 'Registration failed');
        }
      }
    } catch (error) {
      setFormError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const openSignInModal = () => {
    setIsLoginMode(true);
    setShowSignInModal(true);
    setFormError('');
  };

  const openRegisterModal = () => {
    setIsLoginMode(false);
    setShowSignInModal(true);
    setFormError('');
  };

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'properties', label: 'Properties' },
    { id: 'agents', label: 'Agents' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <>
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img 
                src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/6859c1dd906b87cb5a04b328.png" 
                alt="20/20 Realtors Logo" 
                className="h-8 sm:h-12 w-auto"
              />
              <div className="hidden sm:block">
                <div className="text-lg sm:text-xl font-bold">20/20 REALTORS</div>
                <div className="text-yellow-400 text-xs sm:text-sm">Your Vision, Our Mission</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`text-base font-medium transition-colors duration-300 hover:text-yellow-400 ${
                    currentPage === item.id ? 'text-yellow-400' : 'text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {user && (
                <button
                  onClick={() => onPageChange('favorites')}
                  className={`flex items-center text-base font-medium transition-colors duration-300 hover:text-yellow-400 ${
                    currentPage === 'favorites' ? 'text-yellow-400' : 'text-white'
                  }`}
                >
                  <Heart size={18} className="mr-2" />
                  Favorites
                </button>
              )}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {user ? (
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <span className="hidden sm:block text-sm text-slate-300">
                    Welcome, {user.firstName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-yellow-400 transition-colors text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button
                    onClick={openSignInModal}
                    className="border border-white/30 hover:border-yellow-400 text-white hover:text-yellow-400 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={openRegisterModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden text-white hover:text-yellow-400 transition-colors p-2"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="lg:hidden border-t border-slate-800 py-4">
              <div className="flex flex-col space-y-3">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setShowMobileMenu(false);
                    }}
                    className={`text-left text-base font-medium transition-colors duration-300 hover:text-yellow-400 py-2 ${
                      currentPage === item.id ? 'text-yellow-400' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                
                {user && (
                  <button
                    onClick={() => {
                      onPageChange('favorites');
                      setShowMobileMenu(false);
                    }}
                    className={`flex items-center text-base font-medium transition-colors duration-300 hover:text-yellow-400 py-2 ${
                      currentPage === 'favorites' ? 'text-yellow-400' : 'text-white'
                    }`}
                  >
                    <Heart size={18} className="mr-2" />
                    Favorites
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Sign In / Register Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
            <button 
              onClick={() => setShowSignInModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                {isLoginMode ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-slate-600">
                {isLoginMode 
                  ? 'Sign in to access your saved properties' 
                  : 'Join thousands of happy homeowners'
                }
              </p>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {formError}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginMode && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="First Name"
                        required={!isLoginMode}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Last Name"
                        required={!isLoginMode}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <LogIn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <LogIn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="••••••••"
                      required={!isLoginMode}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {isLoginMode ? <LogIn size={18} className="mr-2" /> : <UserPlus size={18} className="mr-2" />}
                    {isLoginMode ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setFormError('');
                  setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
                }}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {isLoginMode 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}