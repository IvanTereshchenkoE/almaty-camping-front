import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';

export type SortOption = 'availability' | 'price_asc' | 'price_desc' | 'capacity' | 'weight';

interface Props {
  total: number;
  activeFiltersCount: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  filterChips: { label: string; onRemove: () => void }[];
  onResetFilters: () => void;
  onOpenMobileFilters: () => void;
  onOpenMobileSort: () => void;
}

const SORT_LABELS: Record<SortOption, string> = {
  availability: 'Сначала доступные',
  price_asc: 'Сначала дешевле',
  price_desc: 'Сначала дороже',
  capacity: 'По вместимости',
  weight: 'По весу',
};

export const CatalogToolbar = ({
  total,
  activeFiltersCount,
  sort,
  onSortChange,
  filterChips,
  onResetFilters,
  onOpenMobileFilters,
  onOpenMobileSort,
}: Props) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-700">
          Найдено: <span className="text-slate-900">{total} палаток</span>
        </p>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-slate-500">Сортировка:</span>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="h-9 rounded-xl border border-emerald-900/10 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                <option key={key} value={key}>
                  {SORT_LABELS[key]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex md:hidden gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-emerald-900/10"
              onClick={onOpenMobileFilters}
            >
              <SlidersHorizontal className="mr-1.5 h-4 w-4" />
              Фильтры
              {activeFiltersCount > 0 && (
                <span className="ml-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-700 px-1 text-[10px] font-bold text-white">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-emerald-900/10"
              onClick={onOpenMobileSort}
            >
              <ArrowUpDown className="mr-1.5 h-4 w-4" />
              {SORT_LABELS[sort]}
            </Button>
          </div>
        </div>
      </div>

      {filterChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {filterChips.map((chip, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="cursor-pointer gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-stone-200 border-0"
              onClick={chip.onRemove}
            >
              {chip.label}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          <button
            onClick={onResetFilters}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Сбросить всё
          </button>
        </div>
      )}
    </div>
  );
};
