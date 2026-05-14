import { CalendarRange, Tent, Package, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { API_BASE_URL } from '@/shared/api';
import type { OrderItem } from '@/entities/order/model';
import { useTranslation } from 'react-i18next';

interface Props {
  startDate: string;
  endDate: string;
  rentalDays: number;
  tentItem: OrderItem | null;
  accessories: OrderItem[];
  total: number;
  onRemoveTent?: () => void;
  onRemoveAccessory?: (id: string) => void;
  actionButton?: React.ReactNode;
  className?: string;
}

export const OrderSummaryCard = ({
  startDate,
  endDate,
  rentalDays,
  tentItem,
  accessories,
  total,
  onRemoveTent,
  onRemoveAccessory,
  actionButton,
  className,
}: Props) => {
  const { t } = useTranslation('order');

  const dayLabel = rentalDays === 1 ? t('summaryPage.day_one')
    : rentalDays < 5 ? t('summaryPage.day_few')
    : t('summaryPage.day_many');

  return (
    <div
      className={cn(
        'rounded-[28px] border border-emerald-900/10 bg-white shadow-sm',
        className
      )}
    >
      <div className="p-5 md:p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">{t('summaryCard.yourOrder')}</h3>

        <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-3 mb-4">
          <CalendarRange className="h-4 w-4 text-slate-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-slate-700">
              {startDate} — {endDate}
            </p>
            <p className="text-xs text-slate-500">
              {rentalDays} {dayLabel}
            </p>
          </div>
        </div>

        {tentItem && (
          <div className="flex items-start gap-3 mb-4 pb-4 border-b border-slate-100">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100">
              {(tentItem as any).imageUrlSnapshot ? (
                <img
                  src={(tentItem as any).imageUrlSnapshot?.startsWith('/api/upload/') ? `${API_BASE_URL}${(tentItem as any).imageUrlSnapshot}` : (tentItem as any).imageUrlSnapshot}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <Tent className="absolute inset-0 m-auto h-6 w-6 text-slate-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{tentItem.nameSnapshot}</p>
              <p className="text-xs text-slate-500">
                {tentItem.dailyPriceSnapshot.toLocaleString()} ₸ × {rentalDays} ={' '}
                <span className="font-medium text-slate-700">{tentItem.totalPrice.toLocaleString()} ₸</span>
              </p>
            </div>
            {onRemoveTent && (
              <button
                onClick={onRemoveTent}
                className="shrink-0 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {accessories.length > 0 && (
          <div className="space-y-3 mb-4 pb-4 border-b border-slate-100">
            {accessories.map((acc) => (
              <div key={acc.itemId} className="flex items-start gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                  <Package className="absolute inset-0 m-auto h-4 w-4 text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{acc.nameSnapshot}</p>
                  <p className="text-xs text-slate-500">
                    {acc.dailyPriceSnapshot.toLocaleString()} ₸ × {acc.quantity} × {rentalDays} ={' '}
                    <span className="font-medium text-slate-700">{acc.totalPrice.toLocaleString()} ₸</span>
                  </p>
                </div>
                {onRemoveAccessory && (
                  <button
                    onClick={() => onRemoveAccessory(acc.itemId)}
                    className="shrink-0 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">{t('summaryCard.total')}</span>
          <span className="text-xl font-bold text-slate-900">{total.toLocaleString()} ₸</span>
        </div>

        {actionButton && <div className="mt-4">{actionButton}</div>}
      </div>
    </div>
  );
};
