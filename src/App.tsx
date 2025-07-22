import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AgentsPage from './pages/AgentsPage';
import ContactPage from './pages/ContactPage';
import FavoritesPage from './pages/FavoritesPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const handlePropertySelect = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    setCurrentPage('property-detail');
  };

  const handleBackToProperties = () => {
    setSelectedPropertyId(null);
    setCurrentPage('properties');
  };

  const handleOpenSignInModal = () => {
    setShowSignInModal(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} onPropertySelect={handlePropertySelect} />;
      case 'properties':
        return <PropertiesPage onPropertySelect={handlePropertySelect} />;
      case 'property-detail':
        return selectedPropertyId ? (
          <PropertyDetailPage 
            propertyId={selectedPropertyId} 
            onBack={handleBackToProperties}
          />
        ) : (
          <PropertiesPage onPropertySelect={handlePropertySelect} />
        );
      case 'agents':
        return <AgentsPage />;
      case 'contact':
        return <ContactPage />;
      case 'favorites':
        return <FavoritesPage onPropertySelect={handlePropertySelect} onPageChange={setCurrentPage} onOpenSignInModal={handleOpenSignInModal} />;
      default:
        return <HomePage onPageChange={setCurrentPage} onPropertySelect={handlePropertySelect} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Header 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          showSignInModal={showSignInModal}
          setShowSignInModal={setShowSignInModal}
        />
        <main>
          {renderPage()}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;