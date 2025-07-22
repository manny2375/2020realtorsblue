import React, { useState } from 'react';
import { Menu, X, User, LogIn, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  showSignInModal: boolean;
  setShowSignInModal: (show: boolean) => void;
}

export default function Header({ currentPage, onPageChange, showSignInModal, setShowSignInModal }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, login, register, logout } = useAuth();

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'Properties', id: 'properties' },
    { name: 'Agents', id: 'agents' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (authMode === 'signin') {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          setShowSignInModal(false);
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
          });
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
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
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
          });
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const openSignInModal = () => {
    setAuthMode('signin');
    setShowSignInModal(true);
    setError('');
  };

  const openRegisterModal = () => {
    setAuthMode('register');
    setShowSignInModal(true);
    setError('');
  };

  return (
    <>
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <img 
                src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/6859c1dd906b87cb5a04b328.png" 
                alt="20/20 Realtors Logo" 
                className="h-12 w-auto"
              />
              <div className="hidden sm:block">
                <div className="text-xl font-bold">20/20 REALTORS</div>
                <div className="text-yellow-400 text-sm">Your Vision, Our Mission</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                    currentPage === item.id
                      ? 'text-yellow-400 bg-white/10'
                      : 'text-white hover:text-yellow-400 hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => onPageChange('favorites')}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                  currentPage === 'favorites'
                    ? 'text-yellow-400 bg-white/10'
                    : 'text-white hover:text-yellow-400 hover:bg-white/5'
                }`}
              >
                <Heart size={16} />
                <span>Favorites</span>
              </button>
            </nav>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <User size={16} className="text-slate-900" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-slate-300">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-slate-300 hover:text-white text-sm transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={openSignInModal}
                    className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg border border-white/20 hover:border-yellow-400/50"
                  >
                    <LogIn size={16} />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={openRegisterModal}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Register
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-yellow-400 p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-slate-800 border-t border-slate-700">
            <div className="px-6 py-4 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-base font-medium transition-all duration-300 rounded-lg ${
                    currentPage === item.id
                      ? 'text-yellow-400 bg-white/10'
                      : 'text-white hover:text-yellow-400 hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => {
                  onPageChange('favorites');
                  setIsMenuOpen(false);
                }}
                className={`flex items-center space-x-2 w-full text-left px-4 py-3 text-base font-medium transition-all duration-300 rounded-lg ${
                  currentPage === 'favorites'
                    ? 'text-yellow-400 bg-white/10'
                    : 'text-white hover:text-yellow-400 hover:bg-white/5'
                }`}
              >
                <Heart size={16} />
                <span>Favorites</span>
              </button>
              
              {user ? (
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <User size={20} className="text-slate-900" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.firstName} {user.lastName}</div>
                      <div className="text-slate-300 text-sm">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-slate-300 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-700 space-y-2">
                  <button
                    onClick={() => {
                      openSignInModal();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-white hover:text-yellow-400 transition-colors border border-white/20 rounded-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      openRegisterModal();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-4 py-3 rounded-lg font-semibold"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <button
                onClick={() => setShowSignInModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={24} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              {authMode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {authMode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  authMode === 'signin' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setAuthMode(authMode === 'signin' ? 'register' : 'signin');
                  setError('');
                  setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: ''
                  });
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                {authMode === 'signin' 
                  ? "Don't have an account? Create one" 
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}