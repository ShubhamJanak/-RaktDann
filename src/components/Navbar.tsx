import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  AlertCircle, 
  UserPlus, 
  PhoneCall, 
  ShieldCheck, 
  Menu, 
  X, 
  Activity,
  UserCheck
} from 'lucide-react';
import { AdminUser } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  adminUser: AdminUser | null;
  onLogoutAdmin: () => void;
  activeRequestsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  adminUser,
  onLogoutAdmin,
  activeRequestsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home & Awareness', icon: Activity },
    { id: 'search', label: 'Search Donors', icon: Search },
    { 
      id: 'emergency', 
      label: 'Emergency Requests', 
      icon: AlertCircle,
      badge: activeRequestsCount > 0 ? `${activeRequestsCount}` : undefined,
      pulse: activeRequestsCount > 0
    },
    { id: 'register', label: 'Register as Donor', icon: UserPlus },
    { id: 'portal', label: 'Donor Status & Cooldown', icon: UserCheck },
    { id: 'helpline', label: 'Indian Helplines', icon: PhoneCall },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Top Emergency Ticker - Indian 24x7 Helplines */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 font-medium tracking-wide">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-rose-100">🇮🇳 24x7 Indian Blood & Health Helplines:</span>
            <span className="hidden sm:inline text-rose-200">National Blood Helpline:</span>
            <a href="tel:104" className="bg-red-900/60 hover:bg-red-900 px-2 py-0.5 rounded font-bold text-white transition-colors">
              📞 104 (Blood Bank)
            </a>
            <a href="tel:1910" className="hidden md:inline bg-red-900/60 hover:bg-red-900 px-2 py-0.5 rounded font-bold text-white transition-colors">
              📞 1910 (NBTC)
            </a>
            <a href="tel:108" className="hidden lg:inline bg-red-900/60 hover:bg-red-900 px-2 py-0.5 rounded font-bold text-white transition-colors">
              🚨 108 (Ambulance)
            </a>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="hidden md:inline text-rose-200">Ministry of Health & Family Welfare Guidelines</span>
            {adminUser ? (
              <div className="flex items-center space-x-2 bg-red-900/80 px-2.5 py-0.5 rounded-full border border-red-400/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white font-semibold">Admin: {adminUser.name}</span>
                <button 
                  onClick={onLogoutAdmin}
                  className="text-rose-200 hover:text-white underline ml-1 text-xs"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleNavClick('admin')}
                className="text-rose-200 hover:text-white flex items-center space-x-1 font-medium hover:underline cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 text-left group cursor-pointer focus:outline-hidden"
            id="brand-logo-btn"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform duration-200">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white animate-pulse" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Rakt<span className="text-red-600">Daan</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                  India
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Blood Donor Directory & Emergency Response
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-red-50 text-red-700 font-semibold shadow-xs border border-red-200/70'
                      : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-slate-400 group-hover:text-red-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                      item.pulse 
                        ? 'bg-red-600 text-white animate-pulse' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Action Emergency Request Button */}
            <button
              onClick={() => handleNavClick('emergency')}
              className="ml-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-md shadow-red-600/20 hover:shadow-lg transition-all duration-200 flex items-center space-x-1.5 cursor-pointer transform hover:-translate-y-0.5"
              id="cta-emergency-header-btn"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Need Blood</span>
            </button>
          </nav>

          {/* Mobile menu trigger */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => handleNavClick('emergency')}
              className="bg-red-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 shadow-xs"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Need Blood</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-xl animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-50 text-red-700 font-bold border border-red-100'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 mt-2">
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <ShieldCheck className="w-5 h-5 text-slate-400" />
              <span>{adminUser ? `Admin Portal (${adminUser.name})` : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
