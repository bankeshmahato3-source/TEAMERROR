import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  ShoppingCart,
  RotateCcw,
  BarChart3,
  ShieldAlert,
  Key,
  Webhook,
  Sliders,
  FileText,
  Users,
  Store,
  ExternalLink,
  Shield,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  type: 'MERCHANT' | 'SECURITY' | 'ADMIN';
}

export const Sidebar: React.FC<SidebarProps> = ({ type }) => {
  const { role } = useAuth();

  const merchantLinks = [
    { label: 'Overview', to: '/merchant', icon: LayoutDashboard, end: true },
    { label: 'Payments', to: '/merchant/payments', icon: CreditCard },
    { label: 'Orders', to: '/merchant/orders', icon: ShoppingCart },
    { label: 'Refunds', to: '/merchant/refunds', icon: RotateCcw },
    { label: 'Analytics', to: '/merchant/analytics', icon: BarChart3 },
    { label: 'Security Score', to: '/merchant/security', icon: Shield },
    { label: 'API Keys', to: '/merchant/api-keys', icon: Key },
    { label: 'Webhooks', to: '/merchant/webhooks', icon: Webhook },
  ];

  const securityLinks = [
    { label: 'SOC Overview', to: '/security', icon: Activity, end: true },
    { label: 'Transactions Audit', to: '/security/transactions', icon: CreditCard },
    { label: 'Fraud Alerts Feed', to: '/security/alerts', icon: ShieldAlert },
    { label: 'UPI Scanner Tool', to: '/upi-check', icon: Sliders },
  ];

  const adminLinks = [
    { label: 'Admin Overview', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Fraud Rules Engine', to: '/admin/fraud-rules', icon: Sliders },
    { label: 'Merchants Roster', to: '/admin/merchants', icon: Store },
    { label: 'Platform Users', to: '/admin/users', icon: Users },
    { label: 'Audit Security Logs', to: '/admin/logs', icon: FileText },
  ];

  const links =
    type === 'MERCHANT' ? merchantLinks : type === 'SECURITY' ? securityLinks : adminLinks;

  const title =
    type === 'MERCHANT'
      ? 'Merchant Portal'
      : type === 'SECURITY'
      ? 'Security SOC'
      : 'Admin Console';

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 light:border-slate-200 bg-[#0A0E17] light:bg-slate-50 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 transition-colors">
      <div className="space-y-6">
        {/* Header */}
        <div className="px-2 pt-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
            Navigation
          </div>
          <h2 className="text-sm font-bold text-slate-200 light:text-slate-800 mt-0.5">
            {title}
          </h2>
        </div>

        {/* Links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 light:bg-blue-100 text-blue-400 light:text-blue-700 font-semibold border border-blue-500/30'
                      : 'text-slate-400 light:text-slate-600 hover:text-slate-200 light:hover:text-slate-900 hover:bg-slate-800/40 light:hover:bg-slate-200/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Switch Portal Box */}
      <div className="pt-6 border-t border-slate-800/80 light:border-slate-200 space-y-2">
        <div className="text-[10px] font-mono uppercase text-slate-500 px-2">Cross-Portal Access</div>
        <div className="grid grid-cols-2 gap-1.5">
          {type !== 'SECURITY' && (
            <Link
              to="/security"
              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[11px] font-medium text-center border border-rose-500/20 transition-colors"
            >
              SOC Portal
            </Link>
          )}
          {type !== 'MERCHANT' && (
            <Link
              to="/merchant"
              className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-[11px] font-medium text-center border border-blue-500/20 transition-colors"
            >
              Merchant
            </Link>
          )}
          {type !== 'ADMIN' && (
            <Link
              to="/admin"
              className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 text-[11px] font-medium text-center border border-purple-500/20 transition-colors"
            >
              Admin
            </Link>
          )}
          <Link
            to="/checkout/order_PF100001"
            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-medium text-center border border-emerald-500/20 transition-colors"
          >
            Checkout
          </Link>
        </div>
      </div>
    </aside>
  );
};
