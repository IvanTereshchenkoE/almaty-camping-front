import { useState } from 'react';
import { Plus, Minus, Package } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { API_BASE_URL } from '@/shared/api';
import { cn } from '@/shared/lib/cn';

interface Props {
  name: string;
  dailyPrice: number;
  availableQuantity: number;
  totalQuantity: number;
  mainImage?: string;
  quantity?: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const AccessoryCard = ({
  name,
  dailyPrice,
  availableQuantity,
  totalQuantity,
  mainImage,
  quantity = 0,
  onAdd,
  onIncrement,
  onDecrement,
}: Props) => {
  const [added, setAdded] = useState(quantity > 0);
  const isUnavailable = availableQuantity <= 0;

  const resolvedImage = mainImage?.startsWith('/api/upload/')
    ? `${API_BASE_URL}${mainImage}`
    : mainImage;

  const handleAdd = () => {
    if (isUnavailable) return;
    setAdded(true);
    onAdd();
  };

  const handleIncrement = () => {
    if (quantity >= availableQuantity) return;
    onIncrement();
  };

  const handleDecrement = () => {
    if (quantity <= 1) {
      setAdded(false);
    }
    onDecrement();
  };

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-2xl border bg-white p-4 transition-shadow',
        'border-emerald-900/10 shadow-sm hover:shadow-md',
        isUnavailable && 'opacity-60'
      )}
    >
      {/* Image */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100">
        {resolvedImage ? (
          <img
            src={resolvedImage}
            alt={name}
            className="h-full w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <Package className="absolute inset-0 m-auto h-6 w-6 text-slate-300" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{name}</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {dailyPrice.toLocaleString()} ₸/сут · Доступно: {availableQuantity} из {totalQuantity}
        </p>
      </div>

      {/* Actions */}
      <div className="shrink-0">
        {!added || quantity === 0 ? (
          <Button
            variant="outline"
            size="sm"
            disabled={isUnavailable}
            onClick={handleAdd}
            className="h-9 rounded-xl border-emerald-900/10 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Добавить
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={handleIncrement}
              disabled={quantity >= availableQuantity}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
