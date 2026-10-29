import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, LanguageOption } from '../i18n/types';
import { TRANSLATIONS } from '../i18n/translations';
import { GrievanceCategory, GrievanceStatus, GrievancePriority } from '../types/civic';

const STORAGE_KEY = 'civicassist_selected_language';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  availableLanguages: LanguageOption[];
  t: (key: string, params?: Record<string, string | number>) => string;
  translateCategory: (category: GrievanceCategory | string) => string;
  translateStatus: (status: GrievanceStatus | string) => string;
  translatePriority: (priority: GrievancePriority | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const CATEGORY_KEY_MAP: Record<string, string> = {
  'Roads & Infrastructure': 'cat.roads',
  'Water Supply & Drainage': 'cat.water',
  'Electricity & Power': 'cat.electricity',
  'Waste & Sanitation': 'cat.waste',
  'Public Health & Safety': 'cat.health',
  'Civic Certificates & Welfare': 'cat.certificates',
};

const STATUS_KEY_MAP: Record<string, string> = {
  'All': 'status.all',
  'Submitted': 'status.submitted',
  'Under Review': 'status.underReview',
  'Assigned': 'status.assigned',
  'In Progress': 'status.inProgress',
  'Resolved': 'status.resolved',
  'Rejected': 'status.rejected',
};

const PRIORITY_KEY_MAP: Record<string, string> = {
  'Low': 'priority.low',
  'Medium': 'priority.medium',
  'High': 'priority.high',
  'Emergency': 'priority.emergency',
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (stored && ['en', 'hi', 'te', 'kn', 'ta'].includes(stored)) {
        return stored;
      }
    } catch {
      // Ignore localStorage access failures
    }
    return 'en';
  });

  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    if (['en', 'hi', 'te', 'kn', 'ta'].includes(newLang)) {
      setLanguageState(newLang);
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
      } catch (err) {
        console.warn('Could not persist language to localStorage:', err);
      }
    }
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        if (['en', 'hi', 'te', 'kn', 'ta'].includes(e.newValue)) {
          setLanguageState(e.newValue as SupportedLanguage);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update HTML document lang attribute
  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // Safe no-op
    }
  }, [language]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
      let text = langDict[key] || TRANSLATIONS.en[key] || key;

      if (params) {
        Object.entries(params).forEach(([paramKey, paramVal]) => {
          text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
        });
      }

      return text;
    },
    [language]
  );

  const translateCategory = useCallback(
    (category: GrievanceCategory | string): string => {
      const key = CATEGORY_KEY_MAP[category];
      if (key) {
        return t(key);
      }
      return category;
    },
    [t]
  );

  const translateStatus = useCallback(
    (status: GrievanceStatus | string): string => {
      const key = STATUS_KEY_MAP[status];
      if (key) {
        return t(key);
      }
      return status;
    },
    [t]
  );

  const translatePriority = useCallback(
    (priority: GrievancePriority | string): string => {
      const key = PRIORITY_KEY_MAP[priority];
      if (key) {
        return t(key);
      }
      return priority;
    },
    [t]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      availableLanguages: SUPPORTED_LANGUAGES,
      t,
      translateCategory,
      translateStatus,
      translatePriority,
    }),
    [language, setLanguage, t, translateCategory, translateStatus, translatePriority]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { t, language, translateCategory, translateStatus, translatePriority } = useLanguage();
  return { t, language, translateCategory, translateStatus, translatePriority };
};
