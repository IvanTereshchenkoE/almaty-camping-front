import { Button } from '@/shared/ui/button';

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
  const total = dailyPrice * days;

  return (
    <div className="sticky bottom-0 mt-auto border-t border-emerald-900/10 bg-white/90 p-4 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          {startDate && endDate ? (
            <>
              <p className="text-xs text-slate-500">
                Итого за {days} {days === 1 ? 'сутки' : days < 5 ? 'суток' : 'суток'}
              </p>
              <p className="text-xl font-bold text-slate-900">{total.toLocaleString()} ₸</p>
            </>
          ) : (
            <p className="text-sm text-slate-500">Выберите даты аренды</p>
          )}
        </div>
        {!isAdmin && (
          <Button
            disabled={isUnavailable || !startDate || !endDate}
            onClick={onSelect}
            className="h-12 rounded-2xl bg-emerald-700 px-6 text-base font-semibold hover:bg-emerald-800"
          >
            {isUnavailable ? 'Недоступно' : 'Выбрать'}
          </Button>
        )}
      </div>
    </div>
  );
};
