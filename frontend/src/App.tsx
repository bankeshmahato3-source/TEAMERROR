import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// Public Pages
import { Home } from './pages/Home';
import { Features } from './pages/Features';
import { FraudDetection } from './pages/FraudDetection';
import { UpiSecurity } from './pages/UpiSecurity';
import { ScamAwareness } from './pages/ScamAwareness';
import { ScamDemo } from './pages/ScamDemo';
import { UpiCheck } from './pages/UpiCheck';
import { PaymentVerification } from './pages/PaymentVerification';
import { Developers } from './pages/Developers';
import { Documentation } from './pages/Documentation';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Checkout Gateway
import { Checkout } from './pages/Checkout';

// Security Operations Center
import { SecurityDashboard } from './pages/SecurityDashboard';
import { InvestigationPage } from './pages/InvestigationPage';

// Merchant Dashboard
import { MerchantDashboard } from './pages/merchant/MerchantDashboard';
import { MerchantPayments } from './pages/merchant/MerchantPayments';
import { MerchantOrders } from './pages/merchant/MerchantOrders';
import { MerchantRefunds } from './pages/merchant/MerchantRefunds';
import { MerchantSecurity } from './pages/merchant/MerchantSecurity';
import { MerchantApiKeys } from './pages/merchant/MerchantApiKeys';
import { MerchantWebhooks } from './pages/merchant/MerchantWebhooks';

// Admin Console
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminFraudRules } from './pages/admin/AdminFraudRules';
import { AdminLogs } from './pages/admin/AdminLogs';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] light:bg-slate-50 text-slate-100 light:text-slate-900 transition-colors">
      <Navbar />
      <ToastContainer />

      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/fraud-detection" element={<FraudDetection />} />
          <Route path="/upi-security" element={<UpiSecurity />} />
          <Route path="/scam-awareness" element={<ScamAwareness />} />
          <Route path="/scam-demo" element={<ScamDemo />} />
          <Route path="/upi-check" element={<UpiCheck />} />
          <Route path="/verify" element={<PaymentVerification />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Sandbox Checkout Modal/Page */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/:orderId" element={<Checkout />} />

          {/* Security Operations Center */}
          <Route path="/security" element={<SecurityDashboard />} />
          <Route path="/security/transactions" element={<SecurityDashboard />} />
          <Route path="/security/alerts" element={<SecurityDashboard />} />
          <Route path="/security/investigation/:paymentId" element={<InvestigationPage />} />

          {/* Merchant Suite */}
          <Route path="/merchant" element={<MerchantDashboard />} />
          <Route path="/merchant/payments" element={<MerchantPayments />} />
          <Route path="/merchant/orders" element={<MerchantOrders />} />
          <Route path="/merchant/refunds" element={<MerchantRefunds />} />
          <Route path="/merchant/analytics" element={<MerchantDashboard />} />
          <Route path="/merchant/security" element={<MerchantSecurity />} />
          <Route path="/merchant/api-keys" element={<MerchantApiKeys />} />
          <Route path="/merchant/webhooks" element={<MerchantWebhooks />} />

          {/* Platform Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/merchants" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminDashboard />} />
          <Route path="/admin/fraud-rules" element={<AdminFraudRules />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;
