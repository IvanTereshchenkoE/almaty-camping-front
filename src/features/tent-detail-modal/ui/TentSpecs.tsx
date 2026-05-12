import { Badge } from '@/shared/ui/badge';
import { Users, Sun, Layers, Weight } from 'lucide-react';

interface Props {
  capacity: number;
  season?: string;
  type?: string;
  weight: number;
  availableQuantity?: number;
  totalQuantity?: number;
}

export const TentSpecs = ({ capacity, season, type, weight, availableQuantity, totalQuantity }: Props) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="gap-1 rounded-full bg-stone-100 text-slate-700 border border-emerald-900/10 font-normal">
          <Users className="h-3 w-3" />
          {capacity} чел.
        </Badge>
        {season && (
          <Badge variant="secondary" className="gap-1 rounded-full bg-stone-100 text-slate-700 border border-emerald-900/10 font-normal">
            <Sun className="h-3 w-3" />
            {season}
          </Badge>
        )}
        {type && (
          <Badge variant="secondary" className="gap-1 rounded-full bg-stone-100 text-slate-700 border border-emerald-900/10 font-normal">
            <Layers className="h-3 w-3" />
            {type}
          </Badge>
        )}
        <Badge variant="secondary" className="gap-1 rounded-full bg-stone-100 text-slate-700 border border-emerald-900/10 font-normal">
          <Weight className="h-3 w-3" />
          {weight} кг
        </Badge>
      </div>

      {totalQuantity !== undefined && (
        <p className="text-sm text-slate-500">
          Доступно: <span className="font-medium text-slate-700">{availableQuantity ?? totalQuantity} из {totalQuantity}</span>
        </p>
      )}
    </div>
  );
};
