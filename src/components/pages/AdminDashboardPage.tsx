import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Filter, 
  RotateCcw, 
  Download, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Building2, 
  User, 
  MapPin, 
  X, 
  Check, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Lock,
  LogIn,
  Database,
  AlertCircle
} from 'lucide-react';
import { Grievance, GrievanceStatus, GrievancePriority } from '../../types/civic';
import { 
  fetchAllGrievancesAdmin, 
  updateGrievanceStatusInFirestore 
} from '../../services/grievanceService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { NavigationTab } from '../Header';

interface AdminDashboardPageProps {
  onNavigate: (tab: NavigationTab, params?: any) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigate,
}) => {
  const { user, isAdmin, loading: authLoading, signInWithGoogle } = useAuth();
  const { t, translateStatus, translatePriority } = useLanguage();

  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');

  // Edit Status Modal State
  const [editingGrievance, setEditingGrievance] = useState<Grievance | null>(null);
  const [newStatus, setNewStatus] = useState<GrievanceStatus>('In Progress');
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [officerName, setOfficerName] = useState(user?.displayName ? `${user.displayName} (Municipal Officer)` : 'Er. Sunil Varma (Ward Exec Engineer)');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadAdminGrievances = async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllGrievancesAdmin();
      setGrievances(data);
    } catch (err: any) {
      console.error('Failed to load admin grievances:', err);
      setError(err?.message || 'Access Denied: Cloud Firestore security rules rejected unrestricted collection query.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminGrievances();
    }
  }, [isAdmin]);

  // Departments list for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    grievances.forEach((g) => set.add(g.department));
    return ['All', ...Array.from(set)];
  }, [grievances]);

  // Filtered grievances
  const filteredGrievances = useMemo(() => {
    return grievances.filter((g) => {
      const matchesStatus = statusFilter === 'All' || g.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || g.priority === priorityFilter;
      const matchesDept = departmentFilter === 'All' || g.department === departmentFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        g.id.toLowerCase().includes(q) ||
        g.subject.toLowerCase().includes(q) ||
        g.citizenName.toLowerCase().includes(q) ||
        g.area.toLowerCase().includes(q);

      return matchesStatus && matchesPriority && matchesDept && matchesSearch;
    });
  }, [grievances, statusFilter, priorityFilter, departmentFilter, searchQuery]);

  // Aggregate stats
  const metrics = useMemo(() => {
    const total = grievances.length;
    const resolved = grievances.filter((g) => g.status === 'Resolved').length;
    const inProgress = grievances.filter((g) => g.status === 'In Progress' || g.status === 'Assigned').length;
    const emergency = grievances.filter((g) => g.priority === 'Emergency' || g.priority === 'High').length;
    const complianceRate = total > 0 ? Math.round((resolved / total) * 100) : 92;

    return { total, resolved, inProgress, emergency, complianceRate };
  }, [grievances]);

  const handleOpenEditModal = (g: Grievance) => {
    setEditingGrievance(g);
    setNewStatus(g.status);
    setOfficerRemarks(g.resolutionRemarks || '');
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGrievance) return;

    setIsUpdating(true);
    try {
      await updateGrievanceStatusInFirestore(
        editingGrievance.id,
        newStatus,
        officerRemarks.trim(),
        officerName.trim()
      );
      setIsUpdating(false);
      setEditingGrievance(null);
      await loadAdminGrievances();
    } catch (err: any) {
      console.error('Failed to update status in Firestore:', err);
      alert('Firestore update failed: ' + (err.message || err));
      setIsUpdating(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Reference ID',
      'Owner UID',
      'Subject',
      'Category',
      'Department',
      'Area',
      'City',
      'Priority',
      'Status',
      'Citizen Name',
      'Phone',
      'Lodged Date',
      'SLA Target Date',
      'Resolution Remarks'
    ];

    const rows = filteredGrievances.map((g) => [
      `"${g.id}"`,
      `"${g.ownerUid || ''}"`,
      `"${g.subject.replace(/"/g, '""')}"`,
      `"${g.category}"`,
      `"${g.department}"`,
      `"${g.area}"`,
      `"${g.city}"`,
      `"${g.priority}"`,
      `"${g.status}"`,
      `"${g.citizenName}"`,
      `"${g.citizenPhone}"`,
      `"${new Date(g.createdAt).toISOString()}"`,
      `"${new Date(g.estimatedResolutionDate).toISOString()}"`,
      `"${(g.resolutionRemarks || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CivicAssist_Cloud_Grievances_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If user is not an admin, show zero-trust restriction screen
  if (!authLoading && !isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              {t('admin.accessRestricted')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {t('admin.accessRestrictedDesc')}
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs text-slate-600 space-y-1.5 max-w-md mx-auto">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Admin Authorization Policy</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Access to this operations console requires an authenticated identity in the Firestore <code>/admins</code> collection or the verified administrative email (<code>amruthabingi6@gmail.com</code>).
            </p>
          </div>

          {!user ? (
            <div className="pt-2">
              <button
                onClick={() => signInWithGoogle()}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition flex items-center gap-2.5 mx-auto cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-teal-400" />
                <span>{t('nav.signIn')}</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 text-xs text-slate-500">
              Signed in as <strong className="font-mono text-slate-700">{user.email}</strong>. This account does not possess municipal administrator privileges.
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-3 text-xs">
            <button
              onClick={() => onNavigate('citizen-dashboard')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
            >
              {t('nav.citizenDashboard')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <LayoutDashboard className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-wider font-extrabold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
              Cloud Operations Console • Authorized Admin
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('admin.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Authorized administrator session for <strong>{user?.email}</strong>. Live connection to Cloud Firestore database: <code>ai-studio-civicassistai-3fc31dea-f6b3-429d-9086-49e5598a14ca</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={loadAdminGrievances}
            disabled={isLoading}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Refresh from Cloud Firestore"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Download CSV report"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t('admin.statTotal')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {metrics.total}
          </div>
          <p className="text-[11px] text-slate-500">Live in Cloud Firestore</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
            {t('admin.statPending')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">
            {metrics.inProgress}
          </div>
          <p className="text-[11px] text-slate-500">Work orders underway</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
            {t('admin.statEmergency')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-mono">
            {metrics.emergency}
          </div>
          <p className="text-[11px] text-slate-500">Priority SLA alerts</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">
            {t('home.statSLA')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 font-mono">
            {metrics.complianceRate}%
          </div>
          <p className="text-[11px] text-slate-500">Disposed within target charter</p>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('admin.searchPlaceholder')}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">{t('admin.filterStatus')} {t('common.all')}</option>
              <option value="Submitted">{translateStatus('Submitted')}</option>
              <option value="Under Review">{translateStatus('Under Review')}</option>
              <option value="Assigned">{translateStatus('Assigned')}</option>
              <option value="In Progress">{translateStatus('In Progress')}</option>
              <option value="Resolved">{translateStatus('Resolved')}</option>
              <option value="Rejected">{translateStatus('Rejected')}</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">{t('admin.filterPriority')} {t('common.all')}</option>
              <option value="Low">{translatePriority('Low')}</option>
              <option value="Medium">{translatePriority('Medium')}</option>
              <option value="High">{translatePriority('High')}</option>
              <option value="Emergency">{translatePriority('Emergency')}</option>
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 max-w-[200px] truncate"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? `${t('admin.filterDept')} ${t('common.all')}` : d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grievance Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">{t('admin.tableRef')}</th>
                <th className="py-3 px-4">{t('admin.tableSubject')}</th>
                <th className="py-3 px-4">{t('services.modalDepartment')}</th>
                <th className="py-3 px-4">{t('admin.tablePriority')}</th>
                <th className="py-3 px-4">{t('admin.tableStatus')}</th>
                <th className="py-3 px-4">{t('admin.tableCitizen')}</th>
                <th className="py-3 px-4 text-right">{t('admin.tableActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Querying Cloud Firestore collection...
                  </td>
                </tr>
              ) : filteredGrievances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No grievances in Cloud Firestore match the active staff filters.
                  </td>
                </tr>
              ) : (
                filteredGrievances.map((g) => {
                  const isResolved = g.status === 'Resolved';
                  const isInProgress = g.status === 'In Progress' || g.status === 'Assigned';
                  return (
                    <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <button
                          onClick={() => onNavigate('track', { refId: g.id })}
                          className="hover:text-teal-700 transition cursor-pointer"
                        >
                          {g.id}
                        </button>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 truncate">{g.subject}</div>
                        <div className="text-[11px] text-slate-400 truncate">{g.area}, {g.city}</div>
                      </td>
                      <td className="py-3 px-4 max-w-[180px] truncate">
                        <span className="truncate">{g.department}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            g.priority === 'Emergency'
                              ? 'bg-rose-100 text-rose-800'
                              : g.priority === 'High'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {translatePriority(g.priority)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                            isResolved
                              ? 'bg-emerald-100 text-emerald-800'
                              : isInProgress
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {translateStatus(g.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{g.citizenName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{g.citizenPhone}</div>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(g)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 transition cursor-pointer"
                            title="Update status & remarks in Firestore"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                            <span>{t('admin.updateStatus')}</span>
                          </button>
                          <button
                            onClick={() => onNavigate('track', { refId: g.id })}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title="View audit trail"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      {editingGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {editingGrievance.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {t('admin.modalTitle')}
                </h3>
                <p className="text-xs text-slate-500 truncate max-w-xs">{editingGrievance.subject}</p>
              </div>
              <button
                onClick={() => setEditingGrievance(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('admin.modalSelectStatus')}
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as GrievanceStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Submitted">{translateStatus('Submitted')} (Registered)</option>
                  <option value="Under Review">{translateStatus('Under Review')} (Triage)</option>
                  <option value="Assigned">{translateStatus('Assigned')} (Assigned)</option>
                  <option value="In Progress">{translateStatus('In Progress')} (Work Order)</option>
                  <option value="Resolved">{translateStatus('Resolved')} (Rectified)</option>
                  <option value="Rejected">{translateStatus('Rejected')} (Rejected)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Actioning Officer Name &amp; Designation
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="Officer name & designation"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('admin.modalRemarks')}
                </label>
                <textarea
                  rows={3}
                  value={officerRemarks}
                  onChange={(e) => setOfficerRemarks(e.target.value)}
                  placeholder="Enter specific actions taken (e.g. Cold-mix patch compacted; 3 tippers deployed; cable replaced)..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
                Committing this update writes directly to Cloud Firestore and appends an immutable audit entry to the citizen's timeline.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingGrievance(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  {isUpdating ? 'Writing to Firestore...' : t('admin.modalSave')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

