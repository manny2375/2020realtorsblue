import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  showSignInModal: boolean;
  setShowSignInModal: (show: boolean) => void;
}

export default function Header({ currentPage, onPageChange, showSignInModal, setShowSignInModal }: HeaderProps) {
  const { user, login, register, logout } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLoginMode) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          setShowSignInModal(false);
          setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        // Registration validation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
          setError('All fields are required');
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
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'properties', label: 'Properties' },
    { id: 'agents', label: 'Agents' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="bg-slate-900 text-white py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center font-bold text-slate-900">
              20/20
            </div>
            <div>
              <div className="text-xl font-bold">20/20 REALTORS</div>
              <div className="text-yellow-400 text-sm">Your Vision, Our Mission</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`text-sm font-medium transition-colors hover:text-yellow-400 ${
                  currentPage === item.id ? 'text-yellow-400' : 'text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            {user && (
              <button
                onClick={() => onPageChange('favorites')}
                className={`text-sm font-medium transition-colors hover:text-yellow-400 ${
                  currentPage === 'favorites' ? 'text-yellow-400' : 'text-white'
                }`}
              >
                Favorites
              </button>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm">Welcome, {user.firstName}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm border border-gray-600 rounded-lg hover:border-yellow-400 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsLoginMode(true);
                    setShowSignInModal(true);
                  }}
                  className="px-4 py-2 text-sm border border-gray-600 rounded-lg hover:border-yellow-400 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsLoginMode(false);
                    setShowSignInModal(true);
                  }}
                  className="px-4 py-2 text-sm bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowSignInModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isLoginMode ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600">
                {isLoginMode ? 'Sign in to your account' : 'Join thousands of happy homeowners'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginMode && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={!isLoginMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={!isLoginMode}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={!isLoginMode}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={!isLoginMode}
                  />
                </div>
              )}

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Please wait...' : (isLoginMode ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="text-center mt-4">
              <button
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setError('');
                  setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
                }}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {isLoginMode ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}