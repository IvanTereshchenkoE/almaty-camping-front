import { useTentFiltersStore } from '../model';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
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
    availableForRent,
    availableForSale,
    setMinPrice,
    setMaxPrice,
    toggleCapacity,
    toggleSeason,
    toggleType,
    setMaxWeight,
    toggleBrand,
    toggleRent,
    toggleSale,
    reset,
  } = useTentFiltersStore();

  const { data: brands, isLoading: brandsLoading } = useTentBrands();
  const { data: types, isLoading: typesLoading } = useTentTypes();
  const { data: seasons, isLoading: seasonsLoading } = useTentSeasons();

  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm space-y-6">
      <h3 className="text-lg font-semibold">Фильтры</h3>

      <div className="space-y-2">
        <Label>Цена, ₸</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="От"
            value={minPrice ?? ''}
            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="number"
            placeholder="До"
            value={maxPrice ?? ''}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Вместимость</Label>
        <div className="space-y-2">
          {CAPACITY_OPTIONS.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <Checkbox
                id={`cap-${opt.value}`}
                checked={capacity.includes(opt.value)}
                onCheckedChange={() => toggleCapacity(opt.value)}
              />
              <Label htmlFor={`cap-${opt.value}`} className="font-normal cursor-pointer">
                {opt.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Сезон</Label>
        {seasonsLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <div className="space-y-2">
            {seasons?.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                <Checkbox
                  id={`season-${opt.id}`}
                  checked={season.includes(opt.name)}
                  onCheckedChange={() => toggleSeason(opt.name)}
                />
                <Label htmlFor={`season-${opt.id}`} className="font-normal cursor-pointer">
                  {opt.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Тип конструкции</Label>
        {typesLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <div className="space-y-2">
            {types?.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                <Checkbox
                  id={`type-${opt.id}`}
                  checked={type.includes(opt.name)}
                  onCheckedChange={() => toggleType(opt.name)}
                />
                <Label htmlFor={`type-${opt.id}`} className="font-normal cursor-pointer">
                  {opt.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Макс. вес, кг</Label>
        <Input
          type="number"
          placeholder="Например, 5"
          value={maxWeight ?? ''}
          onChange={(e) => setMaxWeight(e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      <div className="space-y-2">
        <Label>Бренд</Label>
        {brandsLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <div className="space-y-2">
            {brands?.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                <Checkbox
                  id={`brand-${opt.id}`}
                  checked={brand.includes(opt.name)}
                  onCheckedChange={() => toggleBrand(opt.name)}
                />
                <Label htmlFor={`brand-${opt.id}`} className="font-normal cursor-pointer">
                  {opt.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Доступность</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="rent"
              checked={availableForRent}
              onCheckedChange={toggleRent}
            />
            <Label htmlFor="rent" className="font-normal cursor-pointer">В аренду</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="sale"
              checked={availableForSale}
              onCheckedChange={toggleSale}
            />
            <Label htmlFor="sale" className="font-normal cursor-pointer">На продажу</Label>
          </div>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={reset}>
        Сбросить фильтры
      </Button>
    </div>
  );
};
