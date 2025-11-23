import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/DashboardLayout';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { AIChat } from './components/AIChat';
import { MoodTracker } from './components/MoodTracker';
import { Journal } from './components/Journal';
import { TherapistDashboard } from './components/TherapistDashboard';
import { Appointments } from './components/Appointments';
import { Resources } from './components/Resources';
import { Settings } from './components/Settings';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<LandingPage />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard Home */}
              <Route index element={<Dashboard />} />
              
              {/* Dashboard Sub-pages */}
              <Route path="chat" element={<AIChat />} />
              <Route path="mood" element={<MoodTracker />} />
              <Route path="journal" element={<Journal />} />
              <Route path="therapists" element={<TherapistDashboard />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="resources" element={<Resources />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch all - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
              },
            }}
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;