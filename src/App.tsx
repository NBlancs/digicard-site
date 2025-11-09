import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { IoGridOutline, IoQrCodeOutline } from 'react-icons/io5';
import { supabase } from './lib/supabase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import QRScanner from './components/QRScanner';
import DigitalCard from './components/DigitalCard';
import './App.css';

const App: React.FC = () => {
  const [session, setSession] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading application...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Route: Digital Card */}
        <Route path="/card/:schoolId" element={<DigitalCard />} />

        {/* Protected Routes */}
        {!session ? (
          <>
            <Route path="/login" element={<Login onLoginSuccess={() => {}} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route
              path="/*"
              element={
                <div className="app-container">
                  {/* Navigation */}
                  <nav className="navbar">
                    <div className="nav-content">
                      <div className="nav-brand">
                        <span className="brand-text">SITE ID Scanner & Digital Card</span>
                      </div>
                      <div className="nav-links">
                        <Link to="/dashboard" className="nav-link">
                          <IoGridOutline size={20} />
                          Dashboard
                        </Link>
                        <Link to="/scanner" className="nav-link">
                          <IoQrCodeOutline size={20} />
                          Scanner
                        </Link>
                        <button onClick={handleLogout} className="logout-btn">
                          Logout
                        </button>
                      </div>
                    </div>
                  </nav>

                  {/* Main Content */}
                  <main className="main-content">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/scanner" element={<QRScanner />} />
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </main>

                  {/* Footer */}
                  <footer className="app-footer">
                    <p>&copy; 2025 SITE USTP-CDO ID Scanner & Digital Card Generator. All rights reserved.</p>
                  </footer>
                </div>
              }
            />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
