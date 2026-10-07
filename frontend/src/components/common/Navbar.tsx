import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Shield,
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Activity,
  Store,
  Layers,
  Search,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { user, role, logout, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleSwitch = async (targetRole: UserRole) => {
    await switchDemoRole(targetRole);
    setRoleDropdownOpen(false);
    if (targetRole === 'SECURITY_ANALYST') navigate('/security');
    else if (targetRole === 'MERCHANT') navigate('/merchant');
    else if (targetRole === 'ADMIN') navigate('/admin');
  };

  const navLinks = [
    { label: 'Features', path: '/features' },
    { label: 'Fraud Engine', path: '/fraud-detection' },
    { label: 'UPI Scanner', path: '/upi-check' },
    { label: 'Scam Awareness', path: '/scam-awareness' },
    { label: 'Fake Page Demo', path: '/scam-demo' },
    { label: 'Verify Payment', path: '/verify' },
    { label: 'Docs', path: '/documentation' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0B0F19]/80 dark:bg-[#0B0F19]/80 light:bg-white/85 border-b border-slate-800/80 light:border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 fill-white/10" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                PayGuard
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Sandbox Core
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-500/10'
                      : 'text-slate-300 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-slate-800/40 light:hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons & Auth Controls */}
          <div className="flex items-center gap-2.5">
            {/* Quick Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800/80 light:bg-slate-100 border border-slate-700/60 light:border-slate-300 text-slate-200 light:text-slate-800 hover:border-blue-500/50 transition-all"
                title="Switch Demo Role"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline text-slate-400 light:text-slate-500 text-[11px]">Role:</span>
                <span className="font-mono text-cyan-400 light:text-blue-600">
                  {role || 'GUEST'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 light:bg-white border border-slate-700 light:border-slate-200 shadow-2xl p-2 z-50">
                  <div className="px-2 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800 light:border-slate-100 mb-1">
                    Select Demo Role (1-Click)
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('ADMIN')}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-800 light:hover:bg-slate-100 flex items-center justify-between text-slate-200 light:text-slate-800"
                  >
                    <span>👑 Platform Admin</span>
                    <span className="text-[10px] text-slate-500">/admin</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('SECURITY_ANALYST')}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-800 light:hover:bg-slate-100 flex items-center justify-between text-slate-200 light:text-slate-800"
                  >
                    <span>🛡️ Security Analyst (SOC)</span>
                    <span className="text-[10px] text-slate-500">/security</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('MERCHANT')}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-800 light:hover:bg-slate-100 flex items-center justify-between text-slate-200 light:text-slate-800"
                  >
                    <span>💼 Merchant Portal</span>
                    <span className="text-[10px] text-slate-500">/merchant</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('CUSTOMER')}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-800 light:hover:bg-slate-100 flex items-center justify-between text-slate-200 light:text-slate-800"
                  >
                    <span>🛒 Customer / Shopper</span>
                    <span className="text-[10px] text-slate-500">/checkout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Portal Direct Quick Links */}
            <div className="hidden md:flex items-center gap-1.5">
              <Link
                to="/security"
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center gap-1"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>SOC</span>
              </Link>
              <Link
                to="/merchant"
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all flex items-center gap-1"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Merchant</span>
              </Link>
            </div>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800/80 light:bg-slate-100 text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 border border-slate-700/60 light:border-slate-300 transition-colors"
              aria-label="Toggle Theme"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={logout}
                  className="p-2 rounded-lg bg-slate-800/80 light:bg-slate-100 text-slate-400 hover:text-rose-400 border border-slate-700/60 light:border-slate-300 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="text-xs font-medium px-3 py-1.5 rounded-lg text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800/80 light:bg-slate-100 text-slate-300 light:text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 border-t border-slate-800 light:border-slate-200 bg-[#0B0F19] light:bg-white space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 light:text-slate-700 hover:bg-slate-800 light:hover:bg-slate-100"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-800 light:border-slate-200 flex flex-col gap-2">
            <Link
              to="/security"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-rose-500/10 text-rose-400"
            >
              Security Operations Center (SOC)
            </Link>
            <Link
              to="/merchant"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-blue-500/10 text-blue-400"
            >
              Merchant Dashboard
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-purple-500/10 text-purple-400"
            >
              Admin Dashboard & Fraud Rules
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
