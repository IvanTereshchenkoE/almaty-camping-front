import { DateRangePicker } from '@/shared/ui/date-range-picker';
import { CalendarRange } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

export const RentalDatePanel = ({ startDate, endDate, onChange }: Props) => {
  const { t } = useTranslation('catalog');

  return (
    <section className="rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <CalendarRange className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">{t('datePanel.title')}</h2>
            <p className="text-xs text-slate-500">{t('datePanel.subtitle')}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={onChange}
            className="w-full sm:w-auto"
          />
        </div>
      </div>
    </section>
  );
};
