export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'te' | 'ta';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English (EN)', nativeLabel: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)', nativeLabel: 'हिन्दी' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'te', label: 'తెలుగు (Telugu)', nativeLabel: 'తెలుగు' },
  { code: 'ta', label: 'தமிழ் (Tamil)', nativeLabel: 'தமிழ்' },
];
