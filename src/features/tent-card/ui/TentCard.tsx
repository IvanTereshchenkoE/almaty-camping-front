import { useNavigate } from 'react-router-dom';
import type { Tent } from '@/shared/types';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { useOrderStore } from '@/entities/order/model';
import { useAuthStore } from '@/entities/user/model';
import { ROUTES } from '@/shared/config';
import { API_BASE_URL } from '@/shared/api';
import { cn } from '@/shared/lib/cn';
import { Tent as TentIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  tent: Tent & { totalQuantity?: number; availableQuantity?: number; isAvailable?: boolean };
  onClick?: () => void;
}

export const TentCard = ({ tent, onClick }: Props) => {
  const { t } = useTranslation('catalog');
  const navigate = useNavigate();
  const { startDate, endDate, rentalDays, setTent } = useOrderStore();
  const { isAdmin } = useAuthStore();
  const isUnavailable = tent.isAvailable === false;

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnavailable || !startDate || !endDate || tent.dailyPrice == null) return;
    const days = rentalDays || Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));
    const price = tent.dailyPrice;
    setTent({
      itemType: 'tent',
      itemId: tent.id,
      nameSnapshot: tent.name,
      quantity: 1,
      dailyPriceSnapshot: price,
      totalPrice: price * days,
      imageUrlSnapshot: tent.mainImage,
      brandSnapshot: tent.brand?.name,
    });
    navigate(ROUTES.ORDER);
  };

  const imageSrc = tent.mainImage?.startsWith('/api/upload/')
    ? `${API_BASE_URL}${tent.mainImage}`
    : (tent.mainImage || '');

  const hasImage = !!imageSrc;

  return (
    <article
      onClick={onClick}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm',
        'transition-all duration-300 ease-out transform-gpu',
        'hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_50px_rgba(15,118,110,0.12)]',
        'cursor-pointer'
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[4/3]">
        {hasImage ? (
          <img
            alt={tent.name}
            src={imageSrc}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-emerald-100 via-stone-100 to-emerald-200">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.7),transparent_35%)]" />
            <TentIcon className="absolute right-5 top-5 h-9 w-9 text-emerald-800/20" />
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <span className="text-3xl font-bold text-emerald-950/20">
                {tent.name.slice(0, 12)}
              </span>
            </div>
          </div>
        )}

        <div className="absolute left-4 top-4 z-10">
          {isUnavailable ? (
            <Badge className="rounded-full bg-stone-100 text-stone-500 border-0 shadow-sm">
              {t('card.outOfStock')}
            </Badge>
          ) : (
            <Badge className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
              {t('card.inStock')}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 line-clamp-2 mb-1 group-hover:text-emerald-800 transition-colors">
          {tent.name}
        </h3>
        <p className="text-sm text-emerald-900/55 mb-3">{tent.brand?.name ?? '—'}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant="secondary" className="rounded-full bg-stone-100 text-slate-600 border border-emerald-900/10 font-normal text-xs">
            {tent.capacity} {t('card.people')}
          </Badge>
          <Badge variant="secondary" className="rounded-full bg-stone-100 text-slate-600 border border-emerald-900/10 font-normal text-xs">
            {tent.season?.name ?? '—'}
          </Badge>
          <Badge variant="secondary" className="rounded-full bg-stone-100 text-slate-600 border border-emerald-900/10 font-normal text-xs">
            {tent.type?.name ?? '—'}
          </Badge>
          <Badge variant="secondary" className="rounded-full bg-stone-100 text-slate-600 border border-emerald-900/10 font-normal text-xs">
            {tent.weight} {t('card.kg')}
          </Badge>
        </div>

        <p className="text-sm text-slate-500 truncate mb-4">
          {tent.shortDescription || tent.description || t('card.noDescription')}
        </p>

        {tent.totalQuantity !== undefined && tent.availableQuantity !== undefined && (
          <p className="text-xs text-slate-400 mb-4">
            {t('card.available', { available: tent.availableQuantity, total: tent.totalQuantity })}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="text-xl font-bold text-slate-900 whitespace-nowrap">
            {tent.dailyPrice != null ? t('card.pricePerDay', { price: tent.dailyPrice.toLocaleString() }) : '—'}
          </span>
          {!isAdmin && (
            <Button
              variant={isUnavailable ? 'outline' : 'default'}
              size="sm"
              disabled={isUnavailable || !startDate || !endDate}
              onClick={handleSelect}
              className="h-11 rounded-2xl px-5 whitespace-nowrap"
            >
              {isUnavailable ? t('card.unavailable') : t('card.select')}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};
