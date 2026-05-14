import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Dialog, DialogOverlay } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { X, Users, Sun, Mountain, Weight } from 'lucide-react';
import { useOrderStore } from '@/entities/order/model';
import { useAuthStore } from '@/entities/user/model';
import { TentGallery } from './TentGallery';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from 'react-i18next';

interface Props {
  tent: any;
  open: boolean;
  onClose: () => void;
}

export const TentDetailModal = ({ tent, open, onClose }: Props) => {
  const { t } = useTranslation('catalog');
  const navigate = useNavigate();
  const { startDate, endDate, rentalDays, setTent } = useOrderStore();
  const { isAdmin } = useAuthStore();

  if (!tent) return null;

  const isUnavailable = tent.isAvailable === false;
  const days = rentalDays || Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));
  const totalPrice = (tent.dailyPrice || 0) * days;

  const handleSelect = () => {
    if (isUnavailable || !startDate || !endDate || tent.dailyPrice == null) return;
    setTent({
      itemType: 'tent',
      itemId: tent.id,
      nameSnapshot: tent.name,
      quantity: 1,
      dailyPriceSnapshot: tent.dailyPrice,
      totalPrice: tent.dailyPrice * days,
      imageUrlSnapshot: tent.mainImage,
      brandSnapshot: tent.brand?.name,
    });
    onClose();
    navigate(ROUTES.ORDER);
  };

  const images: string[] = Array.isArray(tent.images) ? tent.images : [];

  const dayLabel = days === 1 ? t('summaryPage.day_one', { ns: 'order' })
    : days < 5 ? t('summaryPage.day_few', { ns: 'order' })
    : t('summaryPage.day_many', { ns: 'order' });

  const characteristics = [
    { label: t('detail.type'), value: tent.type?.name ?? '—' },
    { label: t('detail.season'), value: tent.season?.name ?? '—' },
    { label: t('detail.weight'), value: tent.weight ? `${tent.weight} ${t('card.kg')}` : '—' },
    { label: t('detail.capacity'), value: tent.capacity ? `${tent.capacity} ${t('card.people')}` : '—' },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogPrimitive.Portal>
        <DialogOverlay className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            'fixed z-50 border-0 bg-white p-0 shadow-2xl outline-none overflow-hidden',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'bottom-0 left-0 right-0 h-[92svh] rounded-t-[28px]',
            'md:bottom-auto md:left-1/2 md:right-auto md:top-1/2 md:h-auto md:max-h-[calc(100svh-48px)] md:w-[min(1120px,calc(100vw-48px))] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[32px]'
          )}
        >
          <DialogPrimitive.Close
            onClick={onClose}
            className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 md:right-5 md:top-5"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>

          <div className="flex h-full flex-col md:grid md:grid-cols-2">
            <div className="flex shrink-0 items-center justify-center pt-3 pb-1 md:hidden">
              <div className="h-1 w-10 rounded-full bg-slate-300" />
            </div>

            <div className="flex-1 overflow-y-auto md:contents">
              <div className="md:h-full md:flex md:flex-col">
                <TentGallery
                  mainImage={tent.mainImage}
                  images={images}
                  name={tent.name}
                />
              </div>

              <div className="md:h-full md:flex md:flex-col md:overflow-hidden">
                <div className="p-5 md:p-8 md:flex-1 md:overflow-y-auto">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    {tent.name}
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-500">{tent.brand?.name ?? '—'}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {isUnavailable ? (
                      <span className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                        {t('card.outOfStock')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
                        {t('card.inStock')}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">
                      {t('card.available', { available: tent.availableQuantity ?? tent.totalQuantity ?? 0, total: tent.totalQuantity ?? 0 })}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 ml-auto md:ml-0">
                      {t('card.pricePerDay', { price: tent.dailyPrice?.toLocaleString() })}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      {tent.capacity} {t('card.people')}
                    </span>
                    {tent.season?.name && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                        <Sun className="h-3.5 w-3.5 text-slate-400" />
                        {tent.season.name}
                      </span>
                    )}
                    {tent.type?.name && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                        <Mountain className="h-3.5 w-3.5 text-slate-400" />
                        {tent.type.name}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                      <Weight className="h-3.5 w-3.5 text-slate-400" />
                      {tent.weight} {t('card.kg')}
                    </span>
                  </div>

                  {(tent.description || tent.shortDescription) && (
                    <div className="mt-6">
                      <h4 className="mb-2 text-sm font-semibold text-slate-900">{t('detail.description')}</h4>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {tent.description || tent.shortDescription}
                      </p>
                    </div>
                  )}

                  <div className="mt-6">
                    <h4 className="mb-3 text-sm font-semibold text-slate-900">{t('detail.characteristics')}</h4>
                    <div className="divide-y divide-slate-100">
                      {characteristics.map((c) => (
                        <div key={c.label} className="flex items-center justify-between py-2.5">
                          <span className="text-sm text-slate-500">{c.label}</span>
                          <span className="text-sm font-medium text-slate-800">{c.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hidden md:block border-t border-slate-100 p-5 md:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-500">{t('detail.totalFor', { days, unit: dayLabel })}</p>
                      <p className="text-xl font-bold text-slate-900">{totalPrice.toLocaleString()} ₸</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" onClick={onClose} className="h-11 rounded-2xl px-6">
                        {t('detail.close')}
                      </Button>
                      {!isAdmin && (
                        <Button
                          disabled={isUnavailable || !startDate || !endDate}
                          onClick={handleSelect}
                          className="h-11 rounded-2xl bg-emerald-700 px-6 hover:bg-emerald-800"
                        >
                          {t('card.select')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-white p-4 md:hidden">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-500">{t('detail.totalFor', { days, unit: dayLabel })}</p>
                  <p className="text-xl font-bold text-slate-900">{totalPrice.toLocaleString()} ₸</p>
                </div>
                {!isAdmin && (
                  <Button
                    disabled={isUnavailable || !startDate || !endDate}
                    onClick={handleSelect}
                    className="h-11 rounded-2xl bg-emerald-700 px-6 hover:bg-emerald-800"
                  >
                    {t('card.select')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
};
