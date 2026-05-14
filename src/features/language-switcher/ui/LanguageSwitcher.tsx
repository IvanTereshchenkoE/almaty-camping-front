import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore, type Language } from '@/entities/language/model/store';
import { cn } from '@/shared/lib/cn';

const LANGUAGES: { code: Language; native: string }[] = [
  { code: 'kk', native: 'KK' },
  { code: 'ru', native: 'RU' },
  { code: 'en', native: 'EN' },
];

export const LanguageSwitcher = ({ mobileOnly = false, desktopOnly = false }: { mobileOnly?: boolean; desktopOnly?: boolean }) => {
  const { t } = useTranslation('admin');
  const { language, setLanguage } = useLanguageStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const current = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // Mobile inline buttons
  if (!desktopOnly) {
    return (
      <div className={cn('md:hidden', mobileOnly ? 'block' : 'block')}>
        <div className="flex items-center gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={cn(
                'px-2.5 py-1 text-xs font-semibold uppercase tracking-wide rounded-md transition-colors',
                language === lang.code
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {lang.native}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Desktop dropdown
  if (mobileOnly) return null;

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors',
          open
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
        )}
        aria-label="Switch language"
      >
        <Globe className="h-3.5 w-3.5" />
        {current.native}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-40 rounded-xl border border-emerald-100 bg-white py-1 shadow-lg shadow-emerald-900/5 animate-in fade-in zoom-in-95 duration-150">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center justify-between px-3 py-2 text-sm transition-colors',
                language === lang.code
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <span>{t(`language.${lang.code}`)}</span>
              {language === lang.code && <Check className="h-3.5 w-3.5 text-emerald-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
