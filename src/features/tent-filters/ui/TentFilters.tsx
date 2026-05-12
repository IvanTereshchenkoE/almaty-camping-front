import { useTentFiltersStore } from '../model';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import { FilterSection } from './FilterSection';
import { useTentBrands } from '@/entities/tent-brand/model/use-tent-brands';
import { useTentTypes } from '@/entities/tent-type/model/use-tent-types';
import { useTentSeasons } from '@/entities/tent-season/model/use-tent-seasons';
import { Loader2 } from 'lucide-react';

const CAPACITY_OPTIONS = [
  { label: '1 человек', value: 1 },
  { label: '2 человека', value: 2 },
  { label: '3 человека', value: 3 },
  { label: '4 человека', value: 4 },
  { label: '5+ человек', value: 5 },
];

export const TentFilters = () => {
  const {
    minPrice,
    maxPrice,
    capacity,
    season,
    type,
    maxWeight,
    brand,
    setMinPrice,
    setMaxPrice,
    toggleCapacity,
    toggleSeason,
    toggleType,
    setMaxWeight,
    toggleBrand,
    reset,
  } = useTentFiltersStore();

  const { data: brands, isLoading: brandsLoading } = useTentBrands();
  const { data: types, isLoading: typesLoading } = useTentTypes();
  const { data: seasons, isLoading: seasonsLoading } = useTentSeasons();

  const activeCount =
    (minPrice !== undefined ? 1 : 0) +
    (maxPrice !== undefined ? 1 : 0) +
    capacity.length +
    season.length +
    type.length +
    (maxWeight !== undefined ? 1 : 0) +
    brand.length;

  return (
    <div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900">Фильтры</h3>
          {activeCount > 0 && (
            <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-700 px-1.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={reset}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Сбросить
          </button>
        )}
      </div>

      <div className="space-y-1">
        <FilterSection title="Цена, ₸">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="number"
                placeholder="От"
                value={minPrice ?? ''}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="h-10 rounded-xl border-emerald-900/10 pr-8"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">₸</span>
            </div>
            <span className="text-slate-300">—</span>
            <div className="relative flex-1">
              <Input
                type="number"
                placeholder="До"
                value={maxPrice ?? ''}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="h-10 rounded-xl border-emerald-900/10 pr-8"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">₸</span>
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Вместимость">
          <div className="space-y-2">
            {CAPACITY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                htmlFor={`cap-${opt.value}`}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-stone-50"
              >
                <Checkbox
                  id={`cap-${opt.value}`}
                  checked={capacity.includes(opt.value)}
                  onCheckedChange={() => toggleCapacity(opt.value)}
                />
                <span className="text-sm text-slate-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Сезон">
          {seasonsLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <div className="space-y-2">
              {seasons?.map((opt) => (
                <label
                  key={opt.id}
                  htmlFor={`season-${opt.id}`}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-stone-50"
                >
                  <Checkbox
                    id={`season-${opt.id}`}
                    checked={season.includes(opt.name)}
                    onCheckedChange={() => toggleSeason(opt.name)}
                  />
                  <span className="text-sm text-slate-700">{opt.name}</span>
                </label>
              ))}
            </div>
          )}
        </FilterSection>

        <FilterSection title="Тип конструкции">
          {typesLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <div className="space-y-2">
              {types?.map((opt) => (
                <label
                  key={opt.id}
                  htmlFor={`type-${opt.id}`}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-stone-50"
                >
                  <Checkbox
                    id={`type-${opt.id}`}
                    checked={type.includes(opt.name)}
                    onCheckedChange={() => toggleType(opt.name)}
                  />
                  <span className="text-sm text-slate-700">{opt.name}</span>
                </label>
              ))}
            </div>
          )}
        </FilterSection>

        <FilterSection title="Макс. вес, кг">
          <div className="relative">
            <Input
              type="number"
              step="0.1"
              placeholder="Например, 5"
              value={maxWeight ?? ''}
              onChange={(e) => setMaxWeight(e.target.value ? Number(e.target.value) : undefined)}
              className="h-10 rounded-xl border-emerald-900/10 pr-10"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">кг</span>
          </div>
        </FilterSection>

        <FilterSection title="Бренд">
          {brandsLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <div className="space-y-2">
              {brands?.map((opt) => (
                <label
                  key={opt.id}
                  htmlFor={`brand-${opt.id}`}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-stone-50"
                >
                  <Checkbox
                    id={`brand-${opt.id}`}
                    checked={brand.includes(opt.name)}
                    onCheckedChange={() => toggleBrand(opt.name)}
                  />
                  <span className="text-sm text-slate-700">{opt.name}</span>
                </label>
              ))}
            </div>
          )}
        </FilterSection>
      </div>

      <Button variant="outline" className="mt-5 w-full rounded-2xl border-emerald-900/10" onClick={reset}>
        Сбросить фильтры
      </Button>
    </div>
  );
};
