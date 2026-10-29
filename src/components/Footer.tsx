import React from 'react';
import { ShieldCheck, Phone, ExternalLink, Heart, Sparkles, Building2 } from 'lucide-react';
import { NavigationTab } from './Header';
import { useTranslation } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs no-print">
      {/* Quick Emergency Helplines Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs">
            <Phone className="w-4 h-4 text-teal-400" />
            <span>{t('footer.helplinesTitle')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded text-slate-200 border border-slate-700/60">
              <span className="text-teal-400 font-bold">112</span> {t('footer.nationalEmergency')}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded text-slate-200 border border-slate-700/60">
              <span className="text-teal-400 font-bold">1912</span> {t('footer.electricityOutages')}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded text-slate-200 border border-slate-700/60">
              <span className="text-teal-400 font-bold">1916</span> {t('footer.waterBoard')}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded text-slate-200 border border-slate-700/60">
              <span className="text-teal-400 font-bold">1969</span> {t('footer.swachhataGarbage')}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded text-slate-200 border border-slate-700/60">
              <span className="text-teal-400 font-bold">1967</span> {t('footer.foodSupplies')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-base tracking-tight text-white">
                CivicAssist<span className="text-teal-400">.ai</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              {t('footer.brandDesc')}
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              {t('footer.techBadge')}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {t('footer.sectionsTitle')}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  {t('footer.homeOverview')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  {t('footer.servicesDirectory')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-assistant')}
                  className="hover:text-white transition cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>{t('footer.aiAssistantLink')}</span>
                  <Sparkles className="w-3 h-3 text-teal-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('submit')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  {t('footer.lodgeGrievanceLink')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  {t('footer.trackRefLink')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Dashboards */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {t('footer.dashboardsTitle')}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('citizen-dashboard')}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  {t('footer.citizenHistory')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="hover:text-white transition cursor-pointer text-left flex items-center gap-1"
                >
                  <span>{t('footer.adminConsole')}</span>
                </button>
              </li>
              <li className="text-slate-500 pt-1">
                {t('footer.charterStandards')}
              </li>
              <li className="text-slate-500">
                {t('footer.rtsa')}
              </li>
              <li className="text-slate-500">
                {t('footer.cpgrams')}
              </li>
            </ul>
          </div>

          {/* Col 4: Civic Advisory */}
          <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-teal-300 font-semibold text-xs">
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>{t('footer.advisoryTitle')}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {t('footer.advisory1')}
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t('footer.advisory2')}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            {t('footer.copyright')}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>{t('footer.crafted')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
