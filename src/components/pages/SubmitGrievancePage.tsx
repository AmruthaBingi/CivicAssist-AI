import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  MapPin, 
  AlertTriangle, 
  Upload, 
  CheckCircle2, 
  Building2, 
  Clock, 
  X, 
  HelpCircle, 
  ArrowRight,
  Sparkles,
  Phone,
  User,
  Mail,
  ShieldCheck,
  LogIn,
  AlertCircle,
  Database
} from 'lucide-react';
import { GrievanceCategory, GrievancePriority, Grievance } from '../../types/civic';
import { generateReferenceNumber } from '../../data/seedData';
import { createGrievanceInFirestore } from '../../services/grievanceService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { GrievanceReceiptModal } from '../GrievanceReceiptModal';
import { NavigationTab } from '../Header';

interface SubmitGrievancePageProps {
  initialCategory?: GrievanceCategory;
  initialDepartment?: string;
  initialSubject?: string;
  onNavigate: (tab: NavigationTab, params?: any) => void;
  onGrievanceCreated?: () => void;
}

const CATEGORY_DEPARTMENTS: Record<GrievanceCategory, string[]> = {
  'Roads & Infrastructure': [
    'Roads & Infrastructure Maintenance Wing',
    'Public Works Department (PWD)',
    'Traffic Police Engineering Cell & Urban Mobility',
    'Town Planning & Enforcement Wing',
  ],
  'Water Supply & Drainage': [
    'Urban Water Supply & Sewerage Board',
    'Drainage & Flood Mitigation Division',
    'Water Quality & Laboratory Surveillance Cell',
    'Jal Nigam / Rural Water Supply',
  ],
  'Electricity & Power': [
    'State Electricity Distribution Company (DISCOM)',
    'Electrical Engineering (Streetlighting) Division',
    'Transmission Corporation Grid Operations',
    'Substation Maintenance Wing',
  ],
  'Waste & Sanitation': [
    'Solid Waste Management & Sanitation Wing',
    'Swachh Bharat Urban Cleanliness Cell',
    'Public Toilet & Sanitation Infrastructure Division',
    'Bio-Medical Waste Surveillance Wing',
  ],
  'Public Health & Safety': [
    'Public Health & Entomology Wing',
    'Veterinary Services & Animal Husbandry Cell',
    'Fire & Emergency Services Department',
    'State Pollution Control Board (SPCB)',
  ],
  'Civic Certificates & Welfare': [
    'e-Governance & Revenue (Tehsildar / Taluk Office)',
    'Food, Civil Supplies and Consumer Affairs',
    'Municipal Birth & Death Registration Wing',
    'Social Welfare & Pension Administration',
  ],
};

const CITY_OPTIONS = [
  'Bengaluru',
  'Hyderabad',
  'New Delhi',
  'Mumbai',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
];

export const SubmitGrievancePage: React.FC<SubmitGrievancePageProps> = ({
  initialCategory = 'Roads & Infrastructure',
  initialDepartment,
  initialSubject,
  onNavigate,
  onGrievanceCreated,
}) => {
  const { user, loading: authLoading, isSigningIn, signInWithGoogle } = useAuth();
  const { t, translateCategory, translatePriority } = useLanguage();

  const [category, setCategory] = useState<GrievanceCategory>(initialCategory);
  const [department, setDepartment] = useState<string>(
    initialDepartment || CATEGORY_DEPARTMENTS[initialCategory][0]
  );
  const [city, setCity] = useState('Bengaluru');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [subject, setSubject] = useState(initialSubject || '');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<GrievancePriority>('Medium');

  // Citizen details pre-filled from user profile
  const [citizenName, setCitizenName] = useState(user?.displayName || '');
  const [citizenPhone, setCitizenPhone] = useState('+91 98450 11223');
  const [citizenEmail, setCitizenEmail] = useState(user?.email || '');

  // Attachment state
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [createdGrievance, setCreatedGrievance] = useState<Grievance | null>(null);

  useEffect(() => {
    if (user) {
      if (!citizenName && user.displayName) setCitizenName(user.displayName);
      if (!citizenEmail && user.email) setCitizenEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
      setDepartment(initialDepartment || CATEGORY_DEPARTMENTS[initialCategory][0]);
    }
    if (initialSubject) {
      setSubject(initialSubject);
    }
  }, [initialCategory, initialDepartment, initialSubject]);

  const handleCategoryChange = (newCat: GrievanceCategory) => {
    setCategory(newCat);
    setDepartment(CATEGORY_DEPARTMENTS[newCat][0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFormErrors((prev) => ({
        ...prev,
        attachment: 'File size must be under 2MB for cloud document storage.',
      }));
      return;
    }

    setAttachmentName(file.name);
    setFormErrors((prev) => {
      const copy = { ...prev };
      delete copy.attachment;
      return copy;
    });

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachmentPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAttachmentPreview(null);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachmentName(null);
    setAttachmentPreview(null);
  };

  // Helper to format Firestore / network error messages into friendly readable text
  const formatErrorMessage = (err: any): string => {
    if (!err) return 'Failed to save grievance to Cloud Firestore. Please check your network connection and retry.';
    const msg = err.message || String(err);
    try {
      const parsed = JSON.parse(msg);
      if (parsed.error) {
        if (
          parsed.error.includes('Missing or insufficient permissions') ||
          parsed.error.includes('permission-denied')
        ) {
          return 'Permission Denied: Your signed-in Google account is not permitted to write to this document under Firestore rules. Please ensure you are signed in.';
        }
        return parsed.error;
      }
    } catch {
      // Not JSON string
    }
    return msg;
  };

  const handleFillSampleData = () => {
    setCategory('Roads & Infrastructure');
    setDepartment('Roads & Infrastructure Maintenance Wing');
    setCity('Bengaluru');
    setArea('Ward 102 - Vasanth Nagar, High Grounds Main Road');
    setPincode('560052');
    setLandmark('Near High Grounds Police Station, opposite Post Office');
    setSubject('Deep hazardous pothole crater causing two-wheeler accidents');
    setDescription(
      'A deep 2-foot road crater has opened up at the intersection after water pipe excavation. Two-wheeler riders are repeatedly losing balance at night due to poor lighting. Urgent cold-mix bitumen patching is required to prevent major injury.'
    );
    setPriority('High');
    if (!citizenName.trim()) setCitizenName(user?.displayName || 'Citizen Tester');
    if (!citizenPhone.trim()) setCitizenPhone('+91 98450 11223');
    if (!citizenEmail.trim()) setCitizenEmail(user?.email || 'citizen@civicassist.in');
    setFormErrors({});
    setSubmissionError(null);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let firstErrorFieldId: string | null = null;

    if (!subject.trim()) {
      errors.subject = t('submit.errSubject');
      if (!firstErrorFieldId) firstErrorFieldId = 'field-subject';
    } else if (subject.trim().length < 6) {
      errors.subject = t('submit.errSubject');
      if (!firstErrorFieldId) firstErrorFieldId = 'field-subject';
    }

    if (!description.trim()) {
      errors.description = t('submit.errDescription');
      if (!firstErrorFieldId) firstErrorFieldId = 'field-description';
    } else if (description.trim().length < 15) {
      errors.description = t('submit.errDescription');
      if (!firstErrorFieldId) firstErrorFieldId = 'field-description';
    }

    if (!area.trim()) {
      errors.area = t('submit.errArea');
      if (!firstErrorFieldId) firstErrorFieldId = 'field-area';
    }

    if (!pincode.trim()) {
      errors.pincode = t('submit.errPincode');
      if (!firstErrorFieldId) firstErrorFieldId = 'field-pincode';
    } else if (!/^\d{6}$/.test(pincode.trim())) {
      errors.pincode = t('submit.errPincode');
      if (!firstErrorFieldId) firstErrorFieldId = 'field-pincode';
    }

    if (!citizenName.trim()) {
      errors.citizenName = t('submit.errName');
      if (!firstErrorFieldId) firstErrorFieldId = 'field-citizenName';
    }

    if (!citizenPhone.trim()) {
      errors.citizenPhone = t('submit.errPhone');
      if (!firstErrorFieldId) firstErrorFieldId = 'field-citizenPhone';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      if (firstErrorFieldId) {
        setTimeout(() => {
          const el = document.getElementById(firstErrorFieldId!);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.focus();
          }
        }, 50);
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!user) {
      setSubmissionError('You must be signed in with your Google account to lodge a grievance.');
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const refId = generateReferenceNumber();
      const now = new Date();
      const slaDays = priority === 'Emergency' ? 1 : priority === 'High' ? 2 : 5;
      const targetDate = new Date(now.getTime() + slaDays * 24 * 60 * 60 * 1000);

      const newGrievance: Grievance = {
        id: refId,
        ownerUid: user.uid,
        subject: subject.trim(),
        description: description.trim(),
        category,
        department,
        area: area.trim(),
        city,
        pincode: pincode.trim(),
        priority,
        status: 'Submitted',
        citizenName: citizenName.trim() || user.displayName || 'Citizen',
        citizenPhone: citizenPhone.trim() || '+91 98450 11223',
        citizenEmail: citizenEmail.trim() || user.email || '',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        estimatedResolutionDate: targetDate.toISOString(),
        assignedOfficer: {
          name: 'Central Registry Triage Desk',
          designation: 'Triage Desk Officer',
          department: department,
          phone: '+91 1800-425-001',
        },
        timeline: [
          {
            id: 'tl-' + Date.now(),
            status: 'Submitted',
            title: 'Saved in CivicAssist Cloud Database',
            description: `Grievance registered under ${category} by authenticated citizen. Unique Reference ID ${refId} issued in CivicAssist Cloud Registry.`,
            timestamp: now.toISOString(),
            actor: 'CivicAssist Cloud Registry',
          },
        ],
      };

      // Safely attach optional fields only if defined and non-empty (never undefined)
      if (landmark.trim()) {
        newGrievance.landmark = landmark.trim();
      }
      if (attachmentName && attachmentName.trim()) {
        newGrievance.attachmentName = attachmentName.trim();
      }
      if (attachmentPreview) {
        newGrievance.attachmentData = attachmentPreview;
      }

      // Save directly to Firestore cloud database
      await createGrievanceInFirestore(newGrievance);

      // Only display success after database write confirms!
      setIsSubmitting(false);
      setCreatedGrievance(newGrievance);
      if (onGrievanceCreated) onGrievanceCreated();
    } catch (err: any) {
      console.error('Firestore save failed:', err);
      setIsSubmitting(false);
      const friendlyMsg = formatErrorMessage(err);
      setSubmissionError(friendlyMsg);
    }
  };

  // If auth is still checking, show clean loading state
  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Verifying Google citizen authentication state...
        </p>
      </div>
    );
  }

  // If user is not signed in, show a dedicated authentication prompt
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
            <LogIn className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              {t('submit.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {t('submit.authNotice')}
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
                  <span>Connecting to Google...</span>
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
                  <span>{t('submit.signInGoogle')}</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Backed by Firebase Cloud Firestore • Isolated securely to your user ID
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Database className="w-3.5 h-3.5" />
            <span>{t('submit.cloudNotice')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('submit.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t('submit.subtitle')}
          </p>
        </div>
      </div>

      {submissionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Database Write Error:</strong> {submissionError}
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-8">
        {/* Step 1: Category & Department */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {t('submit.issueDetails')}
              </h3>
            </div>
            <button
              type="button"
              onClick={handleFillSampleData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 shadow-2xs transition cursor-pointer self-start sm:self-auto"
              title="Populate all fields with standard sample data for rapid testing"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Auto-Fill Sample Data</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('submit.category')} *
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as GrievanceCategory)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              >
                {Object.keys(CATEGORY_DEPARTMENTS).map((cat) => (
                  <option key={cat} value={cat}>
                    {translateCategory(cat)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('submit.department')} *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              >
                {CATEGORY_DEPARTMENTS[category].map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Location Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t('submit.issueDetails')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('submit.city')} *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              >
                {CITY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('submit.area')} *
              </label>
              <input
                id="field-area"
                type="text"
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  if (formErrors.area) setFormErrors((p) => ({ ...p, area: '' }));
                }}
                placeholder={t('submit.areaPlaceholder')}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition ${
                  formErrors.area ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {formErrors.area && (
                <p className="text-[11px] text-rose-500 mt-1">{formErrors.area}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('submit.pincode')} *
              </label>
              <input
                id="field-pincode"
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, ''));
                  if (formErrors.pincode) setFormErrors((p) => ({ ...p, pincode: '' }));
                }}
                placeholder={t('submit.pincodePlaceholder')}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition ${
                  formErrors.pincode ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {formErrors.pincode && (
                <p className="text-[11px] text-rose-500 mt-1">{formErrors.pincode}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('submit.landmark')}
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder={t('submit.landmarkPlaceholder')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Grievance Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t('submit.subject')} &amp; {t('submit.priority')}
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t('submit.subject')} *
            </label>
            <input
              id="field-subject"
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (formErrors.subject) setFormErrors((p) => ({ ...p, subject: '' }));
              }}
              placeholder={t('submit.subjectPlaceholder')}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition ${
                formErrors.subject ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {formErrors.subject && (
              <p className="text-[11px] text-rose-500 mt-1">{formErrors.subject}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {t('submit.description')} *
              </label>
              <span className="text-[11px] text-slate-400">{t('common.required')}</span>
            </div>
            <textarea
              id="field-description"
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (formErrors.description) setFormErrors((p) => ({ ...p, description: '' }));
              }}
              placeholder={t('submit.descriptionPlaceholder')}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition ${
                formErrors.description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {formErrors.description && (
              <p className="text-[11px] text-rose-500 mt-1">{formErrors.description}</p>
            )}
          </div>

          {/* Severity Radio Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t('submit.priority')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['Low', 'Medium', 'High', 'Emergency'] as GrievancePriority[]).map((p) => {
                const isSelected = priority === p;
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? p === 'Emergency'
                          ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                          : p === 'High'
                          ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                          : 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{translatePriority(p)}</span>
                    {p === 'Emergency' && <AlertTriangle className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 4: Photo / Document Attachment */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
              4
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t('submit.attachmentSection')}
            </h3>
          </div>

          {attachmentName ? (
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-teal-300 rounded-xl">
              <div className="flex items-center gap-3">
                {attachmentPreview ? (
                  <img
                    src={attachmentPreview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200 shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-slate-800 truncate max-w-xs">{attachmentName}</p>
                  <p className="text-[11px] text-teal-600 font-medium">{t('submit.attachmentSelected')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveAttachment}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                title={t('submit.removeAttachment')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-slate-50/50 hover:bg-teal-50/30 transition cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-teal-600">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-center">
                <span className="text-xs font-bold text-slate-700">{t('submit.attachmentClick')}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{t('submit.attachmentDrag')}</p>
              </div>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
          {formErrors.attachment && (
            <p className="text-[11px] text-rose-500">{formErrors.attachment}</p>
          )}
        </div>

        {/* Step 5: Citizen Contact Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
              5
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t('submit.citizenDetails')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('submit.citizenName')} *
              </label>
              <input
                id="field-citizenName"
                type="text"
                value={citizenName}
                onChange={(e) => {
                  setCitizenName(e.target.value);
                  if (formErrors.citizenName) setFormErrors((p) => ({ ...p, citizenName: '' }));
                }}
                placeholder={t('submit.citizenName')}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition ${
                  formErrors.citizenName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {formErrors.citizenName && (
                <p className="text-[11px] text-rose-500 mt-1">{formErrors.citizenName}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('submit.citizenPhone')} *
              </label>
              <input
                id="field-citizenPhone"
                type="text"
                value={citizenPhone}
                onChange={(e) => {
                  setCitizenPhone(e.target.value);
                  if (formErrors.citizenPhone) setFormErrors((p) => ({ ...p, citizenPhone: '' }));
                }}
                placeholder="+91 98450 11223"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition ${
                  formErrors.citizenPhone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {formErrors.citizenPhone && (
                <p className="text-[11px] text-rose-500 mt-1">{formErrors.citizenPhone}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('submit.citizenEmail')}
              </label>
              <input
                type="email"
                value={citizenEmail}
                onChange={(e) => setCitizenEmail(e.target.value)}
                placeholder="citizen@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Civic Advisory Disclosure */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 leading-relaxed">
          <strong className="text-slate-700">{t('footer.advisoryTitle')}:</strong> {t('footer.advisory1')} {t('footer.advisory2')}
        </div>

        {/* Action Error / Validation Summary (Directly above the submit button!) */}
        {(Object.keys(formErrors).length > 0 || submissionError) && (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
              <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
              <span>
                {submissionError
                  ? 'Firestore Write Failed'
                  : 'Please complete the required fields before submitting:'}
              </span>
            </div>
            {submissionError ? (
              <p className="text-xs text-rose-700 leading-relaxed pl-6 font-medium">
                {submissionError}
              </p>
            ) : (
              <ul className="text-xs text-rose-700 list-disc list-inside space-y-1 pl-3 font-medium">
                {Object.entries(formErrors).map(([key, err]) => (
                  <li key={key}>{err}</li>
                ))}
              </ul>
            )}
            <div className="pt-1 pl-2">
              <button
                type="button"
                onClick={handleFillSampleData}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 underline cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Click here to Auto-Fill valid sample complaint data and retry</span>
              </button>
            </div>
          </div>
        )}

        {/* Submit Action */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-slate-400 text-center sm:text-left">
            {t('login.signedInAs')} <strong className="text-slate-600">{user?.email || t('nav.citizen')}</strong>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t('submit.submitting')}</span>
              </>
            ) : (
              <>
                <span>{t('submit.submitBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Post-Submit Modal */}
      {createdGrievance && (
        <GrievanceReceiptModal
          grievance={createdGrievance}
          onClose={() => setCreatedGrievance(null)}
          onTrack={(refId) => {
            setCreatedGrievance(null);
            onNavigate('track', { refId });
          }}
          onGoToDashboard={() => {
            setCreatedGrievance(null);
            onNavigate('citizen-dashboard');
          }}
        />
      )}
    </div>
  );
};
