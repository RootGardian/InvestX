import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout Components
import TickerTape from './components/landing/TickerTape';
import Header from './components/landing/Header';
import Footer from './components/landing/Footer';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AdminLayout from './components/admin/AdminLayout';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import MarketsPage from './pages/MarketsPage';
import NlpAnalysisPage from './pages/NlpAnalysisPage';
import OrderBookPage from './pages/OrderBookPage';
import PricingPage from './pages/PricingPage';
import AcademyPage from './pages/AcademyPage';
import ApiDocsPage from './pages/ApiDocsPage';
import BlogPage from './pages/BlogPage';
import SupportPage from './pages/SupportPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import LegalNoticePage from './pages/LegalNoticePage';

// Dashboard Pages
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PortfolioPage from './pages/PortfolioPage';
import DepositPage from './pages/DepositPage';
import BuyPage from './pages/BuyPage';
import SellPage from './pages/SellPage';
import AlertsPage from './pages/AlertsPage';
import LiveMarketsPage from './pages/LiveMarketsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminHistoryPage from './pages/admin/AdminHistoryPage';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-background"><div className="text-primary">Chargement...</div></div>;
  if (!token) return <Navigate to="/auth" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { token, user, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-background"><div className="text-[#5e35b1]">Chargement...</div></div>;
  if (!token) return <Navigate to="/auth" />;
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" />;
  return children;
};

// Public Layout Wrapper
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <TickerTape />
    <Header />
    {children}
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
          <Route path="/auth" element={<PublicLayout><AuthPage /></PublicLayout>} />
          <Route path="/markets" element={<PublicLayout><MarketsPage /></PublicLayout>} />
          <Route path="/nlp" element={<PublicLayout><NlpAnalysisPage /></PublicLayout>} />
          <Route path="/orderbook" element={<PublicLayout><OrderBookPage /></PublicLayout>} />
          <Route path="/pricing" element={<PublicLayout><PricingPage /></PublicLayout>} />
          
          <Route path="/academy" element={<PublicLayout><AcademyPage /></PublicLayout>} />
          <Route path="/api-docs" element={<PublicLayout><ApiDocsPage /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
          <Route path="/support" element={<PublicLayout><SupportPage /></PublicLayout>} />
          
          <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
          <Route path="/legal" element={<PublicLayout><LegalNoticePage /></PublicLayout>} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="deposit" element={<DepositPage />} />
            <Route path="markets" element={<LiveMarketsPage />} />
            <Route path="buy" element={<BuyPage />} />
            <Route path="sell" element={<SellPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="history" element={<AdminHistoryPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
