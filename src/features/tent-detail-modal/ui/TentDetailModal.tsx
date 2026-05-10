import { useOrderStore } from '@/entities/order/model';
import { useAuthStore } from '@/entities/user/model';
import { API_BASE_URL } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/dialog';
import { Badge } from '@/shared/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Props {
  tent: any;
  open: boolean;
  onClose: () => void;
}

export const TentDetailModal = ({ tent, open, onClose }: Props) => {
  const navigate = useNavigate();
  const { startDate, endDate, rentalDays, setTent } = useOrderStore();
  const { isAdmin } = useAuthStore();

  if (!tent) return null;

  const imageSrc = tent.mainImage?.startsWith('/api/upload/')
    ? `${API_BASE_URL}${tent.mainImage}`
    : (tent.mainImage || 'https://placehold.co/400x300?text=No+Image');

  const images: string[] = (() => {
    try {
      const parsed = JSON.parse(tent.images || '[]');
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [imageSrc];
    } catch {
      return [imageSrc];
    }
  })();

  const isUnavailable = tent.isAvailable === false;
  const days = rentalDays || Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));

  const handleSelect = () => {
    if (isUnavailable || !startDate || !endDate || tent.dailyPrice == null) return;
    setTent({
      itemType: 'tent',
      itemId: tent.id,
      nameSnapshot: tent.name,
      quantity: 1,
      dailyPriceSnapshot: tent.dailyPrice,
      totalPrice: tent.dailyPrice * days,
    });
    onClose();
    navigate(ROUTES.ORDER);
  };

  const characteristics = tent.characteristics || [];
  const tags = tent.tags || [];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="relative h-64 md:h-80">
          <img
            src={imageSrc}
            alt={tent.name}
            className="w-full h-full object-cover rounded-t-lg"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x400?text=No+Image'; }}
          />
          {images.length > 1 && (
            <div className="absolute bottom-3 left-3 flex gap-2">
              {images.map((img: string, i: number) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-md border-2 border-white/80 overflow-hidden bg-black/20"
                >
                  <img src={img.startsWith('/api/upload/') ? `${API_BASE_URL}${img}` : img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <DialogHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <DialogTitle className="text-2xl">{tent.name}</DialogTitle>
                <DialogDescription className="mt-1">{tent.brand?.name ?? '—'}</DialogDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {isUnavailable && <Badge variant="destructive">Нет в наличии</Badge>}
                {!isUnavailable && tent.availableQuantity !== undefined && (
                  <Badge variant="secondary">Доступно: {tent.availableQuantity} из {tent.totalQuantity || 0}</Badge>
                )}
                <Badge variant="outline">{tent.dailyPrice?.toLocaleString()} ₸/сут</Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{tent.capacity} чел.</Badge>
            <Badge variant="outline">{tent.season?.name ?? '—'}</Badge>
            <Badge variant="outline">{tent.type?.name ?? '—'}</Badge>
            <Badge variant="outline">{tent.weight} кг</Badge>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((t: any) => (
                <Badge key={t.tag?.id || t.id} variant="secondary" className="text-xs">
                  {t.tag?.name || t.name}
                </Badge>
              ))}
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-2">Описание</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{tent.description || tent.shortDescription || 'Нет описания'}</p>
          </div>

          {characteristics.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Характеристики</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {characteristics.map((c: any) => (
                  <div key={c.characteristicDefinition?.id || c.id} className="flex justify-between border-b py-1">
                    <span className="text-muted-foreground">{c.characteristicDefinition?.name || c.name}</span>
                    <span className="font-medium">{c.value} {c.characteristicDefinition?.unit || c.unit || ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-muted-foreground">
              {startDate && endDate ? (
                <span>
                  Выбрано: {startDate} — {endDate} ({days} сут) ={' '}
                  <span className="font-medium text-foreground">
                    {tent.dailyPrice ? (tent.dailyPrice * days).toLocaleString() : 0} ₸
                  </span>
                </span>
              ) : (
                'Выберите даты аренды'
              )}
            </div>
            {!isAdmin && (
              <Button
                disabled={isUnavailable || !startDate || !endDate}
                onClick={handleSelect}
              >
                {isUnavailable ? 'Недоступно' : 'Выбрать'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
