import { Button } from '@/shared/ui/button';
import { useTranslation } from 'react-i18next';

interface Props {
  dailyPrice: number;
  days: number;
  startDate?: string;
  endDate?: string;
  isUnavailable: boolean;
  isAdmin: boolean;
  onSelect: () => void;
}

export const TentOrderSummary = ({
  dailyPrice,
  days,
  startDate,
  endDate,
  isUnavailable,
  isAdmin,
  onSelect,
}: Props) => {
  const { t } = useTranslation('catalog');
  const total = dailyPrice * days;

  const dayLabel = days === 1 ? t('summaryPage.day_one', { ns: 'order' })
    : days < 5 ? t('summaryPage.day_few', { ns: 'order' })
    : t('summaryPage.day_many', { ns: 'order' });

  return (
    <div className="sticky bottom-0 mt-auto border-t border-emerald-900/10 bg-white/90 p-4 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          {startDate && endDate ? (
            <>
              <p className="text-xs text-slate-500">
                {t('detail.totalFor', { days, unit: dayLabel })}
              </p>
              <p className="text-xl font-bold text-slate-900">{total.toLocaleString()} ₸</p>
            </>
          ) : (
            <p className="text-sm text-slate-500">{t('detail.chooseDates')}</p>
          )}
        </div>
        {!isAdmin && (
          <Button
            disabled={isUnavailable || !startDate || !endDate}
            onClick={onSelect}
            className="h-12 rounded-2xl bg-emerald-700 px-6 text-base font-semibold hover:bg-emerald-800"
          >
            {isUnavailable ? t('card.unavailable') : t('card.select')}
          </Button>
        )}
      </div>
    </div>
  );
};
