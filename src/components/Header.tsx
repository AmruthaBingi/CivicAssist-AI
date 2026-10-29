import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Bot, 
  FileText, 
  ShieldAlert, 
  Menu, 
  X, 
  CheckCircle2, 
  UserCheck, 
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
  LogIn,
  LogOut,
  User,
  Database,
  Lock,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../i18n/types';

export type NavigationTab = 
  | 'home' 
  | 'services' 
  | 'ai-assistant' 
  | 'submit' 
  | 'track' 
  | 'citizen-dashboard' 
  | 'admin-dashboard'
  | 'login';

interface HeaderProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab, params?: any) => void;
  onResetData?: () => void;
  pendingCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  pendingCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, availableLanguages, t } = useLanguage();
  const { user, isAdmin, signOutUser } = useAuth();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: t('nav.home'), icon: <Building2 className="w-4 h-4" /> },
    { id: 'services', label: t('nav.services'), icon: <Search className="w-4 h-4" />, badge: '16' },
    { id: 'ai-assistant', label: t('nav.aiAssistant'), icon: <Bot className="w-4 h-4 text-teal-400" />, badge: 'AI' },
    { id: 'submit', label: t('nav.submit'), icon: <FileText className="w-4 h-4" /> },
    { id: 'track', label: t('nav.track'), icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'citizen-dashboard', label: t('nav.citizenDashboard'), icon: <UserCheck className="w-4 h-4" /> },
    { id: 'admin-dashboard', label: t('nav.adminDashboard'), icon: <LayoutDashboard className="w-4 h-4" />, badge: isAdmin ? t('nav.admin') : t('nav.restricted') },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
      {/* Top Cloud Firestore Status Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              {t('common.cloudActive')}
            </span>
            <span className="text-slate-300 text-[11px] sm:text-xs">
              {t('common.cloudSub')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-900/10 group-hover:scale-105 transition-transform duration-200 border border-teal-500/20">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  CivicAssist<span className="text-teal-600">.ai</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider font-extrabold bg-teal-50 text-teal-700 border border-teal-200 px-1.5 py-0.5 rounded">
                  Cloud
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                {t('app.tagline')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                        isActive
                          ? 'bg-teal-500 text-slate-950'
                          : item.badge === t('nav.admin')
                          ? 'bg-amber-100 text-amber-800'
                          : item.badge === t('nav.restricted')
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Language, Auth & Lodge Complaint */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Language Selection Behavior (HACK-P438 Requirement) */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                aria-label={t('nav.languageSelect')}
                className="bg-transparent text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {availableLanguages.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {user ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || t('nav.citizen')}
                    className="w-6 h-6 rounded-full border border-slate-300"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="text-left max-w-[110px] truncate">
                  <div className="text-xs font-bold text-slate-800 truncate leading-none">
                    {user.displayName || t('nav.citizen')}
                  </div>
                  {isAdmin && (
                    <span className="text-[9px] font-bold text-amber-700 leading-none">{t('nav.admin')}</span>
                  )}
                </div>
                <button
                  onClick={signOutUser}
                  className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  title={t('nav.signOut')}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-teal-600" />
                <span>{t('nav.signIn')}</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('submit')}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
            >
              <span>{t('nav.lodgeComplaint')}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {/* User Info Bar in mobile */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-2 flex items-center justify-between">
            {user ? (
              <div className="flex items-center gap-2.5">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-slate-900">{user.displayName || t('nav.citizen')}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{user.email}</div>
                </div>
              </div>
            ) : (
              <span className="text-xs text-slate-600 font-medium">{t('nav.notSignedIn')}</span>
            )}

            {user ? (
              <button
                onClick={signOutUser}
                className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg cursor-pointer"
              >
                {t('nav.signOut')}
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="px-3 py-1 text-xs font-bold bg-slate-900 text-white rounded-lg cursor-pointer"
              >
                {t('nav.signIn')}
              </button>
            )}
          </div>

          {/* Mobile Language Selector */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl mb-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <Globe className="w-4 h-4 text-teal-600" aria-hidden="true" />
              <span>Language / भाषा:</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              aria-label={t('nav.languageSelect')}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {availableLanguages.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
            {t('nav.menu')}
          </div>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-teal-400 text-slate-900'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </div>
              </button>
            );
          })}

          <div className="pt-3">
            <button
              onClick={() => handleNavClick('submit')}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <span>{t('nav.lodgeNewGrievance')}</span>
            </button>
          </div>
        </div>
      )}

      {/* End Mobile Menu */}
    </header>
  );
};
