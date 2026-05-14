import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/cn';

const LANG_CODES = ['kk', 'ru', 'en'] as const;

interface LanguageTabsProps {
  children: Record<string, React.ReactNode>;
  className?: string;
}

export const LanguageTabs = ({ children, className }: LanguageTabsProps) => {
  const { t } = useTranslation('admin');
  const [active, setActive] = useState('kk');

  return (
    <div className={className}>
      <div className="flex gap-1 mb-3">
        {LANG_CODES.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setActive(code)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              active === code
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            {t(`language.${code}`)}
          </button>
        ))}
      </div>
      <div>{children[active]}</div>
    </div>
  );
};
