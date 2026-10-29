import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  Building2, 
  MapPin, 
  Calendar, 
  Printer, 
  Star, 
  Send, 
  FileText, 
  ShieldCheck, 
  X,
  ArrowRight,
  Lock,
  LogIn,
  Database
} from 'lucide-react';
import { Grievance, GrievanceStatus } from '../../types/civic';
import { 
  fetchGrievanceByRef, 
  normalizeReferenceNumber, 
  submitFeedbackInFirestore 
} from '../../services/grievanceService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { NavigationTab } from '../Header';

interface TrackComplaintPageProps {
  initialRefId?: string;
  onNavigate: (tab: NavigationTab, params?: any) => void;
}

export const TrackComplaintPage: React.FC<TrackComplaintPageProps> = ({
  initialRefId = '',
  onNavigate,
}) => {
  const { user, isAdmin, signInWithGoogle } = useAuth();
  const { t, translateStatus, translateCategory, translatePriority } = useLanguage();
  const [searchInput, setSearchInput] = useState(initialRefId);
  const [activeGrievance, setActiveGrievance] = useState<Grievance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAccessDenied, setIsAccessDenied] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Feedback state for resolved complaints
  const [rating, setRating] = useState<number>(5);
  const [feedbackRemarks, setFeedbackRemarks] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const sampleRefs = ['CA-2026-7841', 'CA-2026-3190', 'CA-2026-5524', 'CA-2026-9012', 'CA-2026-1140', 'CA-2026-6421'];

  useEffect(() => {
    if (initialRefId) {
      setSearchInput(initialRefId);
      performSearch(initialRefId);
    }
  }, [initialRefId]);

  const performSearch = async (refToFind: string) => {
    const trimmed = refToFind.trim();
    setHasSearched(true);
    setErrorMessage(null);
    setIsAccessDenied(false);

    if (!trimmed) {
      setActiveGrievance(null);
      return;
    }

    const normalized = normalizeReferenceNumber(trimmed);
    setIsLoading(true);

    try {
      const result = await fetchGrievanceByRef(normalized);
      if (!result) {
        setActiveGrievance(null);
      } else {
        setActiveGrievance(result);
        setFeedbackSubmitted(Boolean(result.feedbackRating));
      }
    } catch (error: any) {
      console.error('Error fetching grievance:', error);
      setActiveGrievance(null);

      // Check if permission denied from security rules
      const errMsg = error?.message || '';
      if (
        errMsg.includes('permission') ||
        errMsg.includes('Missing or insufficient permissions') ||
        errMsg.includes('PERMISSION_DENIED')
      ) {
        setIsAccessDenied(true);
      } else {
        setErrorMessage('Unable to query Cloud Firestore. Please check your network connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchInput);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGrievance) return;
    setIsSubmittingFeedback(true);
    try {
      await submitFeedbackInFirestore(activeGrievance.id, rating, feedbackRemarks);
      setActiveGrievance({
        ...activeGrievance,
        feedbackRating: rating,
        feedbackRemarks: feedbackRemarks.trim(),
      });
      setFeedbackSubmitted(true);
    } catch (err: any) {
      console.error('Failed to submit feedback:', err);
      alert('Failed to submit feedback to Firestore: ' + (err.message || err));
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const getStepStatus = (stepName: GrievanceStatus, currentStatus: GrievanceStatus) => {
    const sequence: GrievanceStatus[] = [
      'Submitted',
      'Under Review',
      'Assigned',
      'In Progress',
      'Resolved',
    ];

    if (currentStatus === 'Rejected') {
      return stepName === 'Submitted' ? 'complete' : 'rejected';
    }

    const currentIndex = sequence.indexOf(currentStatus);
    const stepIndex = sequence.indexOf(stepName);

    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const steps: { name: GrievanceStatus; label: string; desc: string }[] = [
    { name: 'Submitted', label: translateStatus('Submitted'), desc: 'Cloud Firestore' },
    { name: 'Under Review', label: translateStatus('Under Review'), desc: 'Control Room' },
    { name: 'Assigned', label: translateStatus('Assigned'), desc: 'Ward Division' },
    { name: 'In Progress', label: translateStatus('In Progress'), desc: 'Site Inspection' },
    { name: 'Resolved', label: translateStatus('Resolved'), desc: 'Closure' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Database className="w-3.5 h-3.5" />
            <span>{t('common.cloudActive')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('track.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t('track.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-6 max-w-xl">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t('track.inputPlaceholder')}
                className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-xl text-sm font-mono placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{t('track.button')}</span>
              )}
            </button>
          </form>

          {/* Quick Reference Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-300">
            <span className="text-[11px] text-slate-400">{t('track.sampleHint')}</span>
            {sampleRefs.map((ref) => (
              <button
                key={ref}
                onClick={() => {
                  setSearchInput(ref);
                  performSearch(ref);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition cursor-pointer ${
                  activeGrievance?.id === ref
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'bg-white/10 hover:bg-teal-500/20 text-teal-200 border border-white/15'
                }`}
              >
                {ref}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-slate-200 p-8">
          <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">{t('common.loading')}</p>
        </div>
      )}

      {/* Security Rule Access Denied State */}
      {!isLoading && isAccessDenied && (
        <div className="bg-white rounded-2xl border border-amber-200 p-8 shadow-sm space-y-4 text-center max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 mx-auto flex items-center justify-center border border-amber-200">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900">
              {t('track.accessDenied')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('track.signInPrompt')}
            </p>
          </div>

          {!user ? (
            <div className="pt-2">
              <button
                onClick={() => signInWithGoogle()}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 mx-auto cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-teal-400" />
                <span>{t('submit.signInGoogle')}</span>
              </button>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500">
              {t('login.signedInAs')} <strong className="font-mono text-slate-700">{user.email}</strong>.
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {!isLoading && errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Not Found State */}
      {!isLoading && !isAccessDenied && !activeGrievance && hasSearched && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {t('track.notFound', { ref: searchInput.toUpperCase() })}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {t('citizen.emptyDesc')}
          </p>
          <button
            onClick={() => onNavigate('submit')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            {t('nav.lodgeNewGrievance')}
          </button>
        </div>
      )}

      {/* Results View */}
      {!isLoading && activeGrievance && (
        <div className="space-y-6">
          {/* Main Status Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-extrabold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                    {activeGrievance.id}
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      activeGrievance.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : activeGrievance.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : activeGrievance.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {t('track.currentStatus')} {translateStatus(activeGrievance.status)}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  {activeGrievance.subject}
                </h2>
              </div>

              <button
                onClick={() => window.print()}
                className="self-start sm:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer no-print"
              >
                <Printer className="w-4 h-4" />
                <span>{t('track.printReceipt')}</span>
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                {t('track.auditHistory')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {steps.map((st, idx) => {
                  const state = getStepStatus(st.name, activeGrievance.status);
                  return (
                    <div
                      key={st.name}
                      className={`p-3.5 rounded-xl border transition-all ${
                        state === 'complete'
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          : state === 'current'
                          ? 'bg-teal-50 border-teal-400 shadow-xs text-teal-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold">
                          Step 0{idx + 1}
                        </span>
                        {state === 'complete' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                        {state === 'current' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
                        )}
                      </div>
                      <div className="text-xs font-bold">{st.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{st.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info Grid (Department, SLA, Officer, Location) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              {/* Box 1: Administrative Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <span>{t('services.modalCategory')}</span>
                </div>
                <div className="space-y-1.5 pt-1 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('submit.category')}:</span>
                    <span className="font-semibold text-slate-800">{translateCategory(activeGrievance.category)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('submit.department')}:</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[200px] truncate">{activeGrievance.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('track.location')}</span>
                    <span className="font-semibold text-slate-800">{activeGrievance.area}, {activeGrievance.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('submit.priority')}:</span>
                    <span className="font-bold text-amber-700">{translatePriority(activeGrievance.priority)}</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Officer & SLA Target */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <User className="w-4 h-4 text-teal-600" />
                  <span>{t('track.officerAssigned')}</span>
                </div>
                <div className="space-y-1.5 pt-1 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('track.officerAssigned')}:</span>
                    <span className="font-semibold text-slate-800">{activeGrievance.assignedOfficer?.name || 'Triage Desk'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('admin.modalOfficerName')}:</span>
                    <span className="font-semibold text-slate-800">{activeGrievance.assignedOfficer?.designation || 'Central Officer'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('track.officerPhone')}</span>
                    <span className="font-mono text-slate-800">{activeGrievance.assignedOfficer?.phone || '1913'}</span>
                  </div>
                  <div className="flex justify-between text-teal-800 font-bold">
                    <span>{t('track.estimatedTarget')}</span>
                    <span>
                      {new Date(activeGrievance.estimatedResolutionDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Landmark */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t('submit.description')}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                {activeGrievance.description}
              </p>
              {activeGrievance.landmark && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('submit.landmark')}: <strong>{activeGrievance.landmark}</strong></span>
                </div>
              )}
              {activeGrievance.attachmentName && (
                <div className="flex items-center gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200/60 mt-2">
                  <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{t('submit.attachmentSelected')} <strong className="text-slate-800">{activeGrievance.attachmentName}</strong></span>
                  {activeGrievance.attachmentData && (
                    <a
                      href={activeGrievance.attachmentData}
                      download={activeGrievance.attachmentName}
                      className="ml-auto text-teal-700 hover:text-teal-900 font-semibold underline shrink-0 cursor-pointer text-[11px]"
                    >
                      {t('common.view')}
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Resolution Remarks */}
            {activeGrievance.resolutionRemarks && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('admin.modalRemarks')}</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {activeGrievance.resolutionRemarks}
                </p>
              </div>
            )}
          </div>

          {/* Detailed Audit Trail Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t('track.auditHistory')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('track.auditDesc')}
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {activeGrievance.timeline.length} Steps
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {activeGrievance.timeline.map((entry, idx) => (
                <div key={entry.id || idx} className="relative space-y-1">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-teal-600 border-2 border-white ring-2 ring-teal-100" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {entry.title}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(entry.timestamp).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {entry.description}
                  </p>
                  <div className="text-[11px] text-teal-700 font-medium">
                    Logged by: {entry.actor}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Feedback Form (For Resolved Cases) */}
          {activeGrievance.status === 'Resolved' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-4 no-print">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="text-base font-bold text-slate-900">
                  {t('track.feedbackTitle')}
                </h3>
              </div>

              {activeGrievance.feedbackRating ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-amber-900">{t('track.feedbackRating')}</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= (activeGrievance.feedbackRating || 0)
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {activeGrievance.feedbackRemarks && (
                    <p className="text-xs text-amber-800 italic">
                      "{activeGrievance.feedbackRemarks}"
                    </p>
                  )}
                  <div className="text-[10px] text-slate-400 pt-1">
                    {t('track.feedbackSuccess')}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <p className="text-xs text-slate-600">
                    {t('track.feedbackDesc')}
                  </p>

                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="p-1 text-slate-300 hover:text-amber-500 transition cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            s <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {rating === 5 ? '5 ★★★★★' : `${rating} ★`}
                    </span>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={feedbackRemarks}
                      onChange={(e) => setFeedbackRemarks(e.target.value)}
                      placeholder={t('track.feedbackRemarks')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingFeedback}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
                  >
                    {isSubmittingFeedback ? (
                      <span>{t('track.feedbackSubmitting')}</span>
                    ) : (
                      <>
                        <span>{t('track.feedbackSubmit')}</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
