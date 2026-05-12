import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface Props {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const FilterSection = ({ title, children, defaultOpen = true }: Props) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-emerald-900/10 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 text-sm font-semibold text-slate-800 transition-colors hover:text-emerald-800"
      >
        {title}
        <ChevronDown
          className={cn(
            'h-4 w-4 text-slate-400 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-200',
          open ? 'grid-rows-[1fr] opacity-100 pb-3' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
};
