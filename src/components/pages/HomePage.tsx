import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Bot, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  Activity, 
  PhoneCall, 
  Award 
} from 'lucide-react';
import { NavigationTab } from '../Header';
import { Grievance } from '../../types/civic';
import { useLanguage } from '../../context/LanguageContext';

interface HomePageProps {
  onNavigate: (tab: NavigationTab, params?: any) => void;
  grievances: Grievance[];
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, grievances }) => {
  const { t, translateStatus, language } = useLanguage();
  const [quickSearchRef, setQuickSearchRef] = useState('');
  const [searchError, setSearchError] = useState('');

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickSearchRef.trim();
    if (!trimmed) {
      setSearchError(t('home.trackError'));
      return;
    }
    setSearchError('');
    onNavigate('track', { refId: trimmed });
  };

  const handleChipClick = (refId: string) => {
    onNavigate('track', { refId });
  };

  const sampleRefs = ['CA-2026-7841', 'CA-2026-3190', 'CA-2026-5524', 'CA-2026-9012'];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-teal-500/15 border border-teal-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-300">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>{t('home.heroBadge')}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {t('home.heroTitle1')}{' '}
            <span className="bg-gradient-to-r from-teal-300 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              {t('home.heroTitle2')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
            {t('home.heroSubtitle')}
          </p>

          {/* Instant Reference Tracker Box */}
          <div className="max-w-2xl mx-auto pt-4">
            <form onSubmit={handleQuickTrack} className="flex flex-col sm:flex-row gap-2.5 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={quickSearchRef}
                  onChange={(e) => {
                    setQuickSearchRef(e.target.value);
                    if (searchError) setSearchError('');
                  }}
                  placeholder={t('home.trackPlaceholder')}
                  className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 rounded-xl text-sm font-mono placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md hover:shadow-teal-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{t('home.trackButton')}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </form>
            {searchError && (
              <p className="text-xs text-rose-300 mt-2 text-left pl-3">{searchError}</p>
            )}

            {/* Quick Reference Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-300">
              <span className="text-[11px] text-slate-400 font-medium">{t('home.sampleRefHint')}</span>
              {sampleRefs.map((ref) => (
                <button
                  key={ref}
                  onClick={() => handleChipClick(ref)}
                  className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-teal-500/30 text-teal-200 border border-white/15 text-[11px] font-mono font-semibold transition cursor-pointer"
                >
                  {ref}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 Primary Action Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Lodge Grievance */}
          <div 
            onClick={() => onNavigate('submit')}
            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:border-teal-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                {t('nav.submit')}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {t('submit.subtitle')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-teal-700 group-hover:translate-x-1 transition-transform">
              <span>{t('home.ctaLodge')}</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 2: AI Assistant */}
          <div 
            onClick={() => onNavigate('ai-assistant')}
            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:border-indigo-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                {t('nav.aiAssistant')}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {t('ai.subtitle')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-indigo-700 group-hover:translate-x-1 transition-transform">
              <span>{t('home.ctaAskAI')}</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 3: Track Complaint */}
          <div 
            onClick={() => onNavigate('track')}
            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:border-amber-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                {t('nav.track')}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {t('track.subtitle')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
              <span>{t('track.button')}</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 4: 16+ Services Directory */}
          <div 
            onClick={() => onNavigate('services')}
            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {t('nav.services')}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {t('services.subtitle')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
              <span>{t('home.viewAllServices')}</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics / Impact Counters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-mono">16+</div>
              <div className="text-xs text-slate-300 font-semibold">{t('home.statServices')}</div>
              <p className="text-[11px] text-slate-400">Roads, Water, Power &amp; Welfare</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-mono">72h</div>
              <div className="text-xs text-slate-300 font-semibold">{t('home.statSLA')}</div>
              <p className="text-[11px] text-slate-400">Statutory Charter Timelines</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-mono">Gemini</div>
              <div className="text-xs text-slate-300 font-semibold">{t('home.statGemini')}</div>
              <p className="text-[11px] text-slate-400">Multi-language AI Support</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-400 font-mono">100%</div>
              <div className="text-xs text-slate-300 font-semibold">{t('home.statTracking')}</div>
              <p className="text-[11px] text-slate-400">Persistent Cloud Firestore</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works (4 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-wider font-extrabold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            {t('home.howItWorksTitle')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {t('home.howItWorksSubtitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-mono font-bold text-sm flex items-center justify-center mb-3">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-900">{t('home.step1Title')}</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t('home.step1Desc')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative">
            <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-mono font-bold text-sm flex items-center justify-center mb-3">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900">{t('home.step2Title')}</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t('home.step2Desc')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-mono font-bold text-sm flex items-center justify-center mb-3">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-900">{t('home.step3Title')}</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t('home.step3Desc')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-mono font-bold text-sm flex items-center justify-center mb-3">
              4
            </div>
            <h4 className="text-sm font-bold text-slate-900">{t('home.step4Title')}</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t('home.step4Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Showcase Grievances Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <span>{t('home.recentTitle')}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {t('home.recentSubtitle')}
            </p>
          </div>
          <button
            onClick={() => onNavigate('citizen-dashboard')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>{t('footer.citizenHistory')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {grievances.slice(0, 3).map((g) => {
            const isResolved = g.status === 'Resolved';
            const isInProgress = g.status === 'In Progress';
            return (
              <div
                key={g.id}
                onClick={() => onNavigate('track', { refId: g.id })}
                className="bg-white rounded-xl p-5 border border-slate-200 hover:border-teal-500/50 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {g.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-800'
                          : isInProgress
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {translateStatus(g.status)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {g.subject}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{g.area}, {g.city}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">
                    {new Date(g.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                  <span className="font-bold text-teal-700 flex items-center gap-0.5">
                    {t('citizen.trackLive')} <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Citizen Charter & Rights Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-indigo-50 border border-teal-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
              <Award className="w-5 h-5 text-teal-600" />
              <span>{t('home.exploreServicesTitle')}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {t('home.ctaTitle')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('home.ctaSubtitle')}
            </p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="shrink-0 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
          >
            {t('home.viewAllServices')}
          </button>
        </div>
      </section>
    </div>
  );
};
