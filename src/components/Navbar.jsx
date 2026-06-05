/**
 * Navbar Component
 * 
 * Application header with navigation links, user info, and logout.
 * Includes a mobile hamburger menu.
 */
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Wallet,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/add', label: 'Add Expense', icon: PlusCircle },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  return (
    <div className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8 mb-8">
      <nav className="max-w-7xl mx-auto glass-panel rounded-2xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-md shadow-indigo-200 transition-transform duration-300 group-hover:scale-105">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              ExpenseFlow
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* User info + logout (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm text-slate-600 max-w-[140px] truncate">
                {user?.email || 'User'}
              </span>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden max-w-7xl mx-auto mt-2 glass-panel rounded-2xl animate-fade-in overflow-hidden">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50/80 text-indigo-700'
                      : 'text-slate-700 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}

            <div className="pt-2 mt-2 border-t border-white/50">
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="truncate font-medium">{user?.email}</span>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-rose-500 hover:bg-white/50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl w-full max-w-sm p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Sign Out</h3>
            <p className="text-sm text-slate-600 mb-6">Are you sure you want to sign out of ExpenseFlow?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white/50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors shadow-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
