import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserCheck, 
  Search, 
  Filter, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  MapPin, 
  Calendar, 
  FileText, 
  Copy, 
  Check, 
  Plus,
  LogIn,
  Database,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Grievance } from '../../types/civic';
import { fetchCitizenGrievances } from '../../services/grievanceService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { NavigationTab } from '../Header';

interface CitizenDashboardPageProps {
  onNavigate: (tab: NavigationTab, params?: any) => void;
}

export const CitizenDashboardPage: React.FC<CitizenDashboardPageProps> = ({
  onNavigate,
}) => {
  const { user, loading: authLoading, isSigningIn, signInWithGoogle } = useAuth();
  const { t, translateStatus, translatePriority } = useLanguage();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadGrievances = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCitizenGrievances(user.uid);
      setGrievances(data);
    } catch (err: any) {
      console.error('Error loading grievances:', err);
      setError(err?.message || 'Failed to fetch grievances from Cloud Firestore.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadGrievances();
    }
  }, [user]);

  // Compute summary stats
  const stats = useMemo(() => {
    const total = grievances.length;
    const inProgress = grievances.filter((g) => g.status === 'In Progress' || g.status === 'Assigned').length;
    const resolved = grievances.filter((g) => g.status === 'Resolved').length;
    const pending = grievances.filter((g) => g.status === 'Submitted' || g.status === 'Under Review').length;
    return { total, inProgress, resolved, pending };
  }, [grievances]);

  const filteredGrievances = useMemo(() => {
    return grievances.filter((g) => {
      const matchesStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'Active' && (g.status === 'In Progress' || g.status === 'Assigned')) ||
        (selectedStatus === 'Pending' && (g.status === 'Submitted' || g.status === 'Under Review')) ||
        (selectedStatus === 'Resolved' && g.status === 'Resolved');

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        g.id.toLowerCase().includes(q) ||
        g.subject.toLowerCase().includes(q) ||
        g.area.toLowerCase().includes(q) ||
        g.department.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [grievances, selectedStatus, searchQuery]);

  const handleCopy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!authLoading && !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center mx-auto">
            <UserCheck className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              {t('citizen.notSignedIn')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {t('citizen.notSignedInDesc')}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => signInWithGoogle()}
              disabled={isSigningIn}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2.5 mx-auto cursor-pointer"
            >
              {isSigningIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('login.signingIn')}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{t('login.googleButton')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusTabLabel = (st: string) => {
    switch (st) {
      case 'All':
        return `${t('common.all')} (${stats.total})`;
      case 'Active':
        return `${t('citizen.inProgress')} (${stats.inProgress})`;
      case 'Resolved':
        return `${t('citizen.resolved')} (${stats.resolved})`;
      case 'Pending':
        return `${t('citizen.underReview')} (${stats.pending})`;
      default:
        return st;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Database className="w-3.5 h-3.5" />
            <span>Cloud Firestore Verified • Citizen Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('citizen.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {user?.displayName || user?.email ? (
              <>
                Logged in as <strong>{user?.displayName || user?.email}</strong>. {t('citizen.subtitle')}.
              </>
            ) : (
              t('citizen.subtitle')
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={loadGrievances}
            disabled={isLoading}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Refresh records from Cloud Firestore"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{t('common.search')}</span>
          </button>
          <button
            onClick={() => onNavigate('submit')}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t('citizen.lodgeFirst')}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t('citizen.total')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {stats.total}
          </div>
          <p className="text-[11px] text-slate-500">Stored in Cloud Firestore</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
            {t('citizen.inProgress')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">
            {stats.inProgress}
          </div>
          <p className="text-[11px] text-slate-500">Field action underway</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
            {t('citizen.resolved')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
            {stats.resolved}
          </div>
          <p className="text-[11px] text-slate-500">Closed with remarks</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
            {t('citizen.underReview')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono">
            {stats.pending}
          </div>
          <p className="text-[11px] text-slate-500">Under initial review</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['All', 'Active', 'Resolved', 'Pending'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {getStatusTabLabel(st)}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('citizen.searchPlaceholder')}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-slate-200 p-8">
          <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Syncing citizen grievances from Cloud Firestore...</p>
        </div>
      ) : filteredGrievances.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {grievances.length === 0
              ? t('citizen.emptyTitle')
              : 'No grievances match your filter criteria'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {grievances.length === 0
              ? t('citizen.emptyDesc')
              : 'Try clearing the search query or selecting a different status filter tab.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('submit')}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow cursor-pointer"
            >
              {t('citizen.lodgeFirst')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGrievances.map((g) => {
            const isResolved = g.status === 'Resolved';
            const isInProgress = g.status === 'In Progress' || g.status === 'Assigned';
            return (
              <div
                key={g.id}
                onClick={() => onNavigate('track', { refId: g.id })}
                className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500/50 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Line: ID & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {g.id}
                      </span>
                      <button
                        onClick={(e) => handleCopy(g.id, e)}
                        className="text-slate-400 hover:text-slate-700 transition"
                        title="Copy Reference ID"
                      >
                        {copiedId === g.id ? (
                          <Check className="w-3.5 h-3.5 text-teal-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isResolved
                            ? 'bg-emerald-100 text-emerald-800'
                            : isInProgress
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {translateStatus(g.status)}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {translatePriority(g.priority)}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition leading-snug line-clamp-2">
                    {g.subject}
                  </h3>

                  {/* Department & Location */}
                  <div className="space-y-1 text-xs text-slate-500">
                    <p className="flex items-center gap-1 truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{g.department}</span>
                    </p>
                    <p className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{g.area}, {g.city}</span>
                    </p>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {t('track.lodgedOn')} {new Date(g.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <span className="font-bold text-teal-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{t('citizen.trackLive')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

