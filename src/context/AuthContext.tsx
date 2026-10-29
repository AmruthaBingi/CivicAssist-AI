import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSigningIn: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<User | null>;
  signOutUser: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isSigningIn: false,
  authError: null,
  signInWithGoogle: async () => null,
  signOutUser: async () => {},
  clearAuthError: () => {},
});

// Designated admin email from runtime environment
const BOOTSTRAP_ADMIN_EMAIL = 'amruthabingi6@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const isSigningInRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(true);

      if (currentUser) {
        try {
          // Check if admin by email
          const emailMatches =
            currentUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();

          // Check if admin document exists in Firestore
          let docAdmin = false;
          try {
            const adminDocRef = doc(db, 'admins', currentUser.uid);
            const snap = await getDoc(adminDocRef);
            docAdmin = snap.exists();
          } catch {
            docAdmin = false;
          }

          setIsAdmin(emailMatches || docAdmin);
        } catch (err) {
          console.warn('Error checking admin status:', err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<User | null> => {
    // Prevent overlapping concurrent popup operations
    if (isSigningInRef.current) {
      return null;
    }
    isSigningInRef.current = true;
    setIsSigningIn(true);
    setAuthError(null);

    try {
      googleProvider.setCustomParameters({
        prompt: 'select_account',
      });
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: any) {
      const code = error?.code || '';
      // Gracefully handle expected user actions without logging fatal console.error
      if (code === 'auth/cancelled-popup-request') {
        // Ignored: popup request was replaced or user switched windows
        return null;
      }
      if (code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in popup was closed before completing. Click Continue with Google to try again.');
        return null;
      }
      if (code === 'auth/popup-blocked') {
        setAuthError('Sign-in popup was blocked by your browser. Please allow popups for this site and retry.');
        return null;
      }
      if (code === 'auth/unauthorized-domain') {
        setAuthError(
          `Domain ${window.location.hostname} is not in Firebase authorized domains. Please check Firebase Console > Auth > Settings.`
        );
        return null;
      }

      console.warn('Firebase sign-in notice:', error?.message || error);
      setAuthError(error?.message || 'Sign in could not be completed. Please try again.');
      return null;
    } finally {
      isSigningInRef.current = false;
      setIsSigningIn(false);
    }
  };

  const signOutUser = async (): Promise<void> => {
    setAuthError(null);
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (error: any) {
      console.warn('Sign-out notice:', error?.message || error);
      setAuthError(error?.message || 'Failed to sign out.');
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isSigningIn,
        authError,
        signInWithGoogle,
        signOutUser,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
