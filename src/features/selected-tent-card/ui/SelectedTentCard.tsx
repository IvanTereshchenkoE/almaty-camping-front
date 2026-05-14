import { Trash2, Tent } from 'lucide-react';
import { API_BASE_URL } from '@/shared/api';
import type { OrderItem } from '@/entities/order/model';
import { useTranslation } from 'react-i18next';

interface Props {
  tentItem: OrderItem;
  rentalDays: number;
  onRemove: () => void;
}

export const SelectedTentCard = ({ tentItem, rentalDays, onRemove }: Props) => {
  const { t } = useTranslation('order');
  const imageUrl = (tentItem as any).imageUrlSnapshot;
  const resolvedImage = imageUrl?.startsWith('/api/upload/')
    ? `${API_BASE_URL}${imageUrl}`
    : imageUrl;

  const dayLabel = rentalDays === 1 ? t('summaryPage.day_one')
    : rentalDays < 5 ? t('summaryPage.day_few')
    : t('summaryPage.day_many');

  return (
    <div className="rounded-[28px] border border-emerald-900/10 bg-white shadow-sm overflow-hidden">
      <div className="flex items-stretch">
        <div className="relative w-32 shrink-0 overflow-hidden bg-stone-100 md:w-40">
          {resolvedImage ? (
            <img
              src={resolvedImage}
              alt={tentItem.nameSnapshot}
              className="h-full w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 via-stone-100 to-emerald-200">
              <Tent className="h-10 w-10 text-emerald-800/20" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between p-4 md:p-5">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{tentItem.nameSnapshot}</h3>
                {(tentItem as any).brandSnapshot && (
                  <p className="text-sm text-slate-500">{(tentItem as any).brandSnapshot}</p>
                )}
              </div>
              <button
                onClick={onRemove}
                className="shrink-0 text-slate-400 hover:text-red-500 transition-colors p-1"
                title={t('summaryCard.remove')}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>{rentalDays} {dayLabel}</span>
              <span>{tentItem.dailyPriceSnapshot.toLocaleString()} ₸/тңл</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">{t('summaryCard.rentalTotal')}</span>
            <span className="text-lg font-bold text-slate-900">{tentItem.totalPrice.toLocaleString()} ₸</span>
          </div>
        </div>
      </div>
    </div>
  );
};
