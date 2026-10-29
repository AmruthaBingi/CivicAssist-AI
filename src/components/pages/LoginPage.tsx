import React from 'react';
import { 
  ShieldCheck, 
  User, 
  LogIn, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  FileText, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { NavigationTab } from '../Header';

interface LoginPageProps {
  onNavigate: (tab: NavigationTab, params?: any) => void;
  redirectTab?: NavigationTab;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, redirectTab = 'citizen-dashboard' }) => {
  const { user, loading, isAdmin, isSigningIn, authError, signInWithGoogle, signOutUser, clearAuthError } = useAuth();
  const { t } = useLanguage();

  const handleSignIn = async () => {
    if (isSigningIn) return;
    clearAuthError();
    const loggedUser = await signInWithGoogle();
    if (loggedUser) {
      onNavigate(redirectTab);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-teal-700 mx-auto flex items-center justify-center text-white shadow-lg border border-teal-500/20">
          <ShieldCheck className="w-8 h-8 text-teal-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('login.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          {t('login.subtitle')}
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        {authError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold">Authentication Error:</strong> {authError}
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Checking authentication state...</p>
          </div>
        ) : user ? (
          /* Signed In State */
          <div className="space-y-6">
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl flex items-center gap-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-14 h-14 rounded-full border-2 border-teal-400 shadow-xs"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-lg">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {user.displayName || 'Authenticated Citizen'}
                  </h3>
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      Staff Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 truncate font-mono">{user.email}</p>
                <p className="text-[10px] text-teal-800 font-mono">UID: {user.uid}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => onNavigate('submit')}
                className="p-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>{t('nav.submit')}</span>
              </button>
              <button
                onClick={() => onNavigate('citizen-dashboard')}
                className="p-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>{t('nav.citizenDashboard')}</span>
              </button>
            </div>

            {isAdmin && (
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>{t('admin.title')}</span>
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Authenticated via Firebase Auth</span>
              <button
                onClick={signOutUser}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('login.signOutBtn')}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Signed Out State */
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">{t('login.googleButton')}</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                {t('login.subtitle')}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed border-2 border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-3 cursor-pointer active:scale-98"
              >
                {isSigningIn ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                    <span>{t('login.signingIn')}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Lock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Zero-Trust Privacy</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {t('login.citizenPrivileges')}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Cross-Device Cloud Sync</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {t('login.staffPrivileges')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Civic Information Banner */}
      <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Building2 className="w-3.5 h-3.5 text-slate-600" />
          <span>Civic Advisory Notice</span>
        </div>
        <p>
          Complaints submitted through CivicAssist are <strong>saved securely in Cloud Firestore</strong>. This civic-technology platform provides service guidance and automated redressal tracking. For emergency municipal dispatch, please contact local emergency authorities (112).
        </p>
      </div>
    </div>
  );
};

