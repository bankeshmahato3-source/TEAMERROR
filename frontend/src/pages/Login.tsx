import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/security');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setLoading(true);
    await switchDemoRole(role);
    setLoading(false);

    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'SECURITY_ANALYST') navigate('/security');
    else if (role === 'MERCHANT') navigate('/merchant');
    else navigate('/checkout/order_PF100001');
  };

  return (
    <div className="py-12 max-w-md mx-auto px-4 sm:px-6">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-blue-500/25">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white light:text-slate-900">
          Sign In to PayGuard
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Access your merchant, security, or customer dashboard
        </p>
      </div>

      <div className="p-6 rounded-3xl glass-card border border-blue-500/20 shadow-2xl space-y-6">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@payguard.io"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 light:border-slate-300 text-xs text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Login Roles */}
        <div className="pt-4 border-t border-slate-800 light:border-slate-200">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 font-bold uppercase mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant 1-Click Demo Logins:</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('SECURITY_ANALYST')}
              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-left text-xs transition-colors"
            >
              <div className="font-bold text-rose-300">🛡️ SOC Analyst</div>
              <div className="text-[10px] text-slate-400">analyst@payguard.io</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('MERCHANT')}
              className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-left text-xs transition-colors"
            >
              <div className="font-bold text-blue-300">💼 Merchant</div>
              <div className="text-[10px] text-slate-400">merchant@payguard.io</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('ADMIN')}
              className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-left text-xs transition-colors"
            >
              <div className="font-bold text-purple-300">👑 Admin</div>
              <div className="text-[10px] text-slate-400">admin@payguard.io</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('CUSTOMER')}
              className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-left text-xs transition-colors"
            >
              <div className="font-bold text-emerald-300">🛒 Customer</div>
              <div className="text-[10px] text-slate-400">customer@payguard.io</div>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};
