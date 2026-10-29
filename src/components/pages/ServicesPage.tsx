import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Building2, 
  Clock, 
  Phone, 
  FileCheck, 
  ArrowRight, 
  ExternalLink, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  X,
  BookOpen
} from 'lucide-react';
import { SAMPLE_SERVICES } from '../../data/seedData';
import { PublicService, GrievanceCategory } from '../../types/civic';
import { NavigationTab } from '../Header';
import { useLanguage } from '../../context/LanguageContext';

interface ServicesPageProps {
  onNavigate: (tab: NavigationTab, params?: any) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const { t, translateCategory } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalService, setActiveModalService] = useState<PublicService | null>(null);
  const [copiedHelpline, setCopiedHelpline] = useState<string | null>(null);

  const categories: string[] = [
    'All',
    'Roads & Infrastructure',
    'Water Supply & Drainage',
    'Electricity & Power',
    'Waste & Sanitation',
    'Public Health & Safety',
    'Civic Certificates & Welfare',
  ];

  const filteredServices = useMemo(() => {
    return SAMPLE_SERVICES.filter((srv) => {
      const matchesCategory =
        selectedCategory === 'All' || srv.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        srv.title.toLowerCase().includes(q) ||
        srv.description.toLowerCase().includes(q) ||
        srv.department.toLowerCase().includes(q) ||
        srv.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopyHelpline = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedHelpline(num);
    setTimeout(() => setCopiedHelpline(null), 2000);
  };

  const handleLodgeGrievance = (srv: PublicService) => {
    onNavigate('submit', {
      category: srv.category,
      department: srv.department,
      subjectHint: `Issue regarding ${srv.title}`
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('footer.charterStandards')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('services.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Search Bar inside Header */}
        <div className="mt-6 max-w-2xl">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('services.searchPlaceholder')}
              className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 pl-1">
          <Filter className="w-3.5 h-3.5" /> {t('common.filter')}:
        </span>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const displayLabel = cat === 'All' ? t('services.filterAll') : translateCategory(cat);
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {displayLabel}
              {cat === 'All' && ` (${SAMPLE_SERVICES.length})`}
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">{t('services.noResults')}</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {t('services.searchPlaceholder')}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            {t('services.resetFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500/40 shadow-xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Category & SLA Badges */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {translateCategory(srv.category)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    <Clock className="w-3 h-3 text-teal-600" />
                    <span>{srv.slaDays} {srv.slaDays === 1 ? 'Day' : 'Days'} SLA</span>
                  </span>
                </div>

                {/* Title & Department */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 hover:text-teal-700 transition leading-snug">
                    {srv.title}
                  </h3>
                  <p className="text-[11px] text-teal-700 font-medium mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-teal-600 shrink-0" />
                    <span className="truncate">{srv.department}</span>
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {srv.description}
                </p>

                {/* Helpline Pill */}
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-1.5 text-xs">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {t('services.helplineLabel')}
                  </span>
                  <button
                    onClick={() => handleCopyHelpline(srv.helpline)}
                    className="font-mono font-bold text-slate-800 hover:text-teal-700 text-[11px] cursor-pointer"
                    title="Click to copy helpline"
                  >
                    {copiedHelpline === srv.helpline ? `✓ ${t('common.copied')}` : srv.helpline}
                  </button>
                </div>

                {/* Document Tags preview */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">{t('services.modalDocs')}:</span>
                  <div className="flex flex-wrap gap-1">
                    {srv.requiredDocs.slice(0, 2).map((doc, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded truncate max-w-[200px]"
                      >
                        • {doc}
                      </span>
                    ))}
                    {srv.requiredDocs.length > 2 && (
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                        +{srv.requiredDocs.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setActiveModalService(srv)}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{t('services.viewDetails')}</span>
                </button>
                <button
                  onClick={() => handleLodgeGrievance(srv)}
                  className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                >
                  <span>{t('services.lodgeThis')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Detail Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  {translateCategory(activeModalService.category)}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {activeModalService.title}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>{activeModalService.department} • {activeModalService.ministry}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveModalService(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs max-h-[65vh] overflow-y-auto pr-1">
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                  {t('services.modalCategory')}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {activeModalService.description}
                </p>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5 flex items-start gap-3">
                <Clock className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-teal-900 text-xs">{t('services.modalSLA')}</h5>
                  <p className="text-teal-800 text-xs mt-0.5">{activeModalService.slaDescription}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                  {t('services.modalDocs')}
                </h4>
                <ul className="space-y-1.5">
                  {activeModalService.requiredDocs.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                  {t('services.modalSteps')}
                </h4>
                <ol className="space-y-1.5 list-decimal pl-4 text-slate-700">
                  {activeModalService.processSteps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <span>{t('services.modalSource')}: <strong className="text-slate-700">{activeModalService.source}</strong></span>
                <span>{t('services.modalReviewDate')}: <strong className="text-slate-700">{activeModalService.reviewDate}</strong></span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveModalService(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                {t('common.close')}
              </button>
              <button
                onClick={() => {
                  const s = activeModalService;
                  setActiveModalService(null);
                  handleLodgeGrievance(s);
                }}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <span>{t('services.modalLodgeBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
