import React from 'react';
import { Menu, X, User, Lock, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../hooks/useFavorites';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  showSignInModal?: boolean;
  setShowSignInModal?: (show: boolean) => void;
}

export default function Header({ currentPage, onPageChange, showSignInModal, setShowSignInModal }: HeaderProps) {
  const { user, login, register, logout } = useAuth();
  const { favorites, syncFavorites } = useFavorites(user);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);
  const [internalShowSignInModal, setInternalShowSignInModal] = React.useState(false);
  const [registerFormData, setRegisterFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [signInFormData, setSignInFormData] = React.useState({
    email: '',
    password: ''
  });

  // Use external state if provided, otherwise use internal state
  const isSignInModalOpen = showSignInModal !== undefined ? showSignInModal : internalShowSignInModal;
  const setSignInModalOpen = setShowSignInModal || setInternalShowSignInModal;

  // Sync favorites when user logs in
  React.useEffect(() => {
    const handleUserLoggedIn = () => {
      syncFavorites();
    };

    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    return () => window.removeEventListener('userLoggedIn', handleUserLoggedIn);
  }, [syncFavorites]);

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'Properties', id: 'properties' },
    { name: 'Agents', id: 'agents' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterFormData({
      ...registerFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignInInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInFormData({
      ...signInFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(registerFormData);
      setShowRegisterModal(false);
      setRegisterFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Registration failed:', error);
      // Could show error message here
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(signInFormData.email, signInFormData.password);
      setSignInModalOpen(false);
      setSignInFormData({
        email: '',
        password: ''
      });
    } catch (error) {
      console.error('Sign in failed:', error);
      // Could show error message here
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setSignInModalOpen(false);
    setMobileMenuOpen(false);
  };

  const openSignInModal = () => {
    setSignInModalOpen(true);
    setShowRegisterModal(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-slate-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img 
                src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/6859c1dd906b87cb5a04b328.png" 
                alt="20/20 Realtors Logo" 
                className="h-10 sm:h-14 w-auto cursor-pointer"
                onClick={() => onPageChange('home')}
              />
              <div className="hidden sm:block">
                <div className="text-white text-sm sm:text-lg font-bold">20/20 REALTORS</div>
                <div className="text-yellow-400 text-xs sm:text-sm">Your Vision, Our Mission</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'text-yellow-400'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Favorites Button */}
              <button
                onClick={() => onPageChange('favorites')}
                className={`flex items-center text-sm font-medium transition-colors relative ${
                  currentPage === 'favorites'
                    ? 'text-yellow-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Heart size={18} className="mr-1" fill={currentPage === 'favorites' ? 'currentColor' : 'none'} />
                Favorites
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Auth Section */}
              <div className="hidden md:flex items-center space-x-3">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="text-slate-300 text-sm">
                      Welcome, {user.firstName}
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={openSignInModal}
                      className="text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={openRegisterModal}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-slate-300 hover:text-white p-2 touch-manipulation"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-800 py-4 animate-slide-down">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 text-base font-medium transition-colors touch-manipulation ${
                      currentPage === item.id
                        ? 'text-yellow-400 bg-slate-800/50'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
                
                {/* Mobile Favorites Button */}
                <button
                  onClick={() => {
                    onPageChange('favorites');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full text-left px-4 py-3 text-base font-medium transition-colors touch-manipulation ${
                    currentPage === 'favorites'
                      ? 'text-yellow-400 bg-slate-800/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
                  }`}
                >
                  <Heart size={20} className="mr-3" fill={currentPage === 'favorites' ? 'currentColor' : 'none'} />
                  Favorites
                  {favorites.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </button>
                
                {/* Mobile Auth Buttons */}
                <div className="px-4 pt-4 border-t border-slate-800 mt-4">
                  {user ? (
                    <div className="space-y-3">
                      <div className="text-slate-300 text-sm py-2">
                        Welcome, {user.firstName}
                      </div>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 px-4 py-3 rounded-lg text-base font-medium transition-colors text-center touch-manipulation"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={openSignInModal}
                        className="text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 px-4 py-3 rounded-lg text-base font-medium transition-colors text-center touch-manipulation"
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={openRegisterModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-base font-medium transition-colors text-center touch-manipulation"
                      >
                        Register
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60] backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl animate-scale-in">
            <button 
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-slate-600 transition-colors p-2 touch-manipulation"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
              <p className="text-slate-600">Join thousands of happy homeowners</p>
            </div>
            
            <form onSubmit={handleRegisterSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={registerFormData.firstName}
                      onChange={handleRegisterInputChange}
                      placeholder="John"
                      className="w-full pl-10 pr-4 py-3 sm:py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 placeholder-slate-400 text-base"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={registerFormData.lastName}
                      onChange={handleRegisterInputChange}
                      placeholder="Doe"
                      className="w-full pl-10 pr-4 py-3 sm:py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 placeholder-slate-400 text-base"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={registerFormData.email}
                    onChange={handleRegisterInputChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 sm:py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 placeholder-slate-400 text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={registerFormData.phone}
                    onChange={handleRegisterInputChange}
                    placeholder="(714) 262-4263"
                    className="w-full px-4 py-3 sm:py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 placeholder-slate-400 text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    value={registerFormData.password}
                    onChange={handleRegisterInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 sm:py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 placeholder-slate-400 text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={registerFormData.confirmPassword}
                    onChange={handleRegisterInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 sm:py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 placeholder-slate-400 text-base"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors shadow-lg touch-manipulation"
              >
                Create Account
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-slate-600">
                Already have an account?{' '}
                <button 
                  onClick={openSignInModal}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors touch-manipulation"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {isSignInModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60] backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl animate-scale-in">
            <button 
              onClick={() => setSignInModalOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-slate-600 transition-colors p-2 touch-manipulation"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-600">Sign in to your account</p>
            </div>
            
            <form onSubmit={handleSignInSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={signInFormData.email}
                    onChange={handleSignInInputChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 sm:py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 placeholder-slate-400 text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    value={signInFormData.password}
                    onChange={handleSignInInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 sm:py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 placeholder-slate-400 text-base"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors shadow-lg touch-manipulation"
              >
                Sign In
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-slate-600">
                Don't have an account?{' '}
                <button 
                  onClick={openRegisterModal}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors touch-manipulation"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}