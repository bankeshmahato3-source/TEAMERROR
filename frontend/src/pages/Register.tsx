import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, User, Store, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('MERCHANT');
  const [merchantName, setMerchantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await register({
      name,
      email,
      password,
      role,
      merchantName: role === 'MERCHANT' ? merchantName || `${name}'s Store` : undefined,
    });
    setLoading(false);

    if (res.success) {
      if (role === 'MERCHANT') navigate('/merchant');
      else if (role === 'SECURITY_ANALYST') navigate('/security');
      else navigate('/');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="py-12 max-w-md mx-auto px-4 sm:px-6">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-blue-500/25">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white light:text-slate-900">
          Create PayGuard Account
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Select a role to start experimenting in the sandbox
        </p>
      </div>

      <div className="p-6 rounded-3xl glass-card border border-blue-500/20 shadow-2xl space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Sarah Connor"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 light:border-slate-300 text-xs text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 light:border-slate-300 text-xs text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 light:border-slate-300 text-xs text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
              Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 light:border-slate-300 text-xs text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
            >
              <option value="MERCHANT">Merchant (Create orders & manage revenue)</option>
              <option value="SECURITY_ANALYST">Security Analyst (Investigate fraud & alerts)</option>
              <option value="CUSTOMER">Customer / Shopper (Test checkout payments)</option>
              <option value="ADMIN">Platform Admin (Manage fraud rules & system)</option>
            </select>
          </div>

          {role === 'MERCHANT' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                Store / Business Name
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  placeholder="Apex Electronics Demo"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 light:border-slate-300 text-xs text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
