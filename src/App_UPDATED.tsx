import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { LoadingScreen } from './components/LoadingScreen';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { AIChat } from './components/AIChat';
import { MoodTracker } from './components/MoodTracker';
import { TherapistDashboard } from './components/TherapistDashboard';
import { Resources } from './components/Resources';
import { Journal } from './components/Journal';
import { Settings } from './components/Settings';
import { Appointments } from './components/Appointments';
import { FloatingAIChatBot } from './components/FloatingAIChatBot';
import { ViewType } from './types';
import { initializeAuth, clearAuthData, getCurrentUser } from './utils/auth';
import { authAPI } from './services/api';

// Import your existing landing page component
// For now, I'll create a placeholder
import LandingPage from './components/LandingPage'; // You'll need to extract your landing page

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsVerifying(true);
      try {
        const user = await initializeAuth();
        if (user) {
          setCurrentUser(user);
          setCurrentView('dashboard');
        } else {
          setCurrentUser(null);
          setCurrentView('landing');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthData();
        setCurrentUser(null);
        setCurrentView('landing');
      } finally {
        setIsVerifying(false);
      }
    };

    initAuth();
  }, []);

  const handleLoadingComplete = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    clearAuthData();
    authAPI.logout();
    setCurrentUser(null);
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.success('Logged out successfully! Come back soon! 💜', {
      duration: 3000,
      position: 'top-center',
    });
  };

  const handleNavigate = (view: ViewType) => {
    // Protect routes - only allow navigation if user is logged in
    if (!currentUser && view !== 'landing') {
      toast.error('Please login to access this feature');
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  // Render current view
  const renderView = () => {
    // Protect all views except landing
    if (!currentUser && currentView !== 'landing') {
      setCurrentView('landing');
      return null;
    }

    switch (currentView) {
      case 'dashboard':
        return currentUser ? (
          <Dashboard
            user={currentUser}
            onNavigate={handleNavigate}
          />
        ) : null;

      case 'chat':
        return <AIChat onBack={() => handleNavigate('dashboard')} />;

      case 'mood':
        return <MoodTracker onBack={() => handleNavigate('dashboard')} />;

      case 'therapists':
        return <TherapistDashboard onBack={() => handleNavigate('dashboard')} />;

      case 'resources':
        return <Resources onBack={() => handleNavigate('dashboard')} />;

      case 'journal':
        return <Journal onBack={() => handleNavigate('dashboard')} />;

      case 'settings':
        return <Settings user={currentUser} onBack={() => handleNavigate('dashboard')} onProfileUpdate={(updatedUser) => setCurrentUser(updatedUser)} />;

      case 'appointments':
        return <Appointments onBack={() => handleNavigate('dashboard')} onJoinSession={(sessionId) => {
          toast.success('Joining session...');
        }} />;

      case 'landing':
      default:
        return (
          <LandingPage 
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  // Show loading screen while verifying auth
  if (isLoading || isVerifying) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <div key={currentView}>
          {/* Global Header - Show when logged in and not on landing */}
          {currentUser && currentView !== 'landing' && currentView !== 'chat' && (
            <Header 
              user={currentUser}
              onLogin={() => {}}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
            />
          )}
          
          {renderView()}
        </div>
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onSuccess={handleAuthSuccess}
        onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
      />

      {/* Floating AI Chat Bot - Only show when logged in */}
      {currentUser && (currentView === 'landing' || currentView === 'dashboard') && (
        <FloatingAIChatBot onChatOpen={() => handleNavigate('chat')} />
      )}

      <Toaster position="top-right" richColors />
    </>
  );
}
