import { create } from 'zustand';
import i18n from '@/shared/lib/i18n';
import { queryClient } from '@/shared/lib/query-client';

export type Language = 'kk' | 'ru' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>(() => ({
  language: (i18n.language as Language) || 'kk',
  setLanguage: (lang: Language) => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    // Invalidate all cached queries so they refetch with new Accept-Language header
    queryClient.invalidateQueries({ queryKey: [] });
    queryClient.refetchQueries({ type: 'active' });
  },
}));

// Sync store when i18n language changes externally
i18n.on('languageChanged', (lang: string) => {
  useLanguageStore.setState({ language: lang as Language });
});
