import { useNavigate } from 'react-router-dom';
import type { Tent } from '@/shared/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { useOrderStore } from '@/entities/order/model';
import { useAuthStore } from '@/entities/user/model';
import { ROUTES } from '@/shared/config';
import { API_BASE_URL } from '@/shared/api';
import { cn } from '@/shared/lib/cn';

interface Props {
  tent: Tent & { totalQuantity?: number; availableQuantity?: number; isAvailable?: boolean };
  onClick?: () => void;
}

export const TentCard = ({ tent, onClick }: Props) => {
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
    });
    navigate(ROUTES.ORDER);
  };

  const imageSrc = tent.mainImage?.startsWith('/api/upload/')
    ? `${API_BASE_URL}${tent.mainImage}`
    : (tent.mainImage || 'https://placehold.co/400x300?text=No+Image');

  return (
    <Card
      className={cn(
        "overflow-hidden flex flex-col transition-shadow hover:shadow-md",
        isUnavailable && "opacity-60",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <img
        alt={tent.name}
        src={imageSrc}
        className="h-48 w-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image'; }}
      />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{tent.name}</CardTitle>
          {isUnavailable && (
            <Badge variant="destructive">Нет в наличии</Badge>
          )}
          {!isUnavailable && tent.availableQuantity !== undefined && tent.availableQuantity < (tent.totalQuantity || 0) && (
            <Badge variant="secondary">Осталось {tent.availableQuantity}</Badge>
          )}
          {!isUnavailable && tent.availableQuantity !== undefined && tent.availableQuantity === (tent.totalQuantity || 0) && tent.totalQuantity !== undefined && (
            <Badge variant="outline" className="text-green-600 border-green-600">В наличии</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{tent.brand?.name ?? '—'}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary">{tent.capacity} чел.</Badge>
          <Badge variant="outline">{tent.season?.name ?? '—'}</Badge>
          <Badge variant="outline">{tent.type?.name ?? '—'}</Badge>
          <Badge variant="outline">{tent.weight} кг</Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{tent.description}</p>
        {tent.totalQuantity !== undefined && tent.availableQuantity !== undefined && (
          <p className="text-xs text-muted-foreground mt-2">
            Доступно: <span className="font-medium">{tent.availableQuantity}</span> из {tent.totalQuantity}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-0">
        {!isAdmin && (
          <Button
            variant={isUnavailable ? 'outline' : 'default'}
            size="sm"
            className="flex-1"
            disabled={isUnavailable || !startDate || !endDate}
            onClick={handleSelect}
          >
            {isUnavailable ? 'Недоступно' : 'Выбрать'}
          </Button>
        )}
        <div className="text-sm font-medium w-full text-center">
          {tent.dailyPrice != null ? `${tent.dailyPrice.toLocaleString()} ₸/сут` : '—'}
        </div>
      </CardFooter>
    </Card>
  );
};
