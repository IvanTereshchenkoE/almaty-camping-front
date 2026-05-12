import { useTents } from '@/entities/tent/model';
import { useTentFiltersStore } from '@/features/tent-filters/model';
import { TentFilters } from '@/features/tent-filters/ui';
import { TentCard } from '@/features/tent-card/ui';
import { useOrderStore } from '@/entities/order/model';
import { useMemo, useState, useCallback } from 'react';
import { Button } from '@/shared/ui/button';
import { PackageOpen, RotateCcw } from 'lucide-react';
import { TentDetailModal } from '@/features/tent-detail-modal/ui';
import { RentalDatePanel } from '@/features/catalog/ui/RentalDatePanel';
import { CatalogToolbar, type SortOption } from '@/features/catalog/ui/CatalogToolbar';
import { MobileFilterDrawer } from '@/features/catalog/ui/MobileFilterDrawer';
import { TentSkeletonCard } from '@/features/catalog/ui/TentSkeletonCard';

const PAGE_SIZE = 6;

export const CatalogPage = () => {
  const filters = useTentFiltersStore();
  const { startDate, endDate, setDates } = useOrderStore();
  const [page, setPage] = useState(1);
  const [selectedTentId, setSelectedTentId] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  const apiFilters = useMemo(
    () => ({
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      capacity: filters.capacity,
      season: filters.season,
      type: filters.type,
      maxWeight: filters.maxWeight,
      brand: filters.brand,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
    [filters, startDate, endDate],
  );

  const { data: tents, isLoading, error, refetch } = useTents(apiFilters);

  const sortedTents = useMemo(() => {
    if (!tents) return [];
    let result = [...tents];

    switch (filters.sort) {
      case 'price_asc':
        result.sort((a, b) => (a.dailyPrice || 0) - (b.dailyPrice || 0));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.dailyPrice || 0) - (a.dailyPrice || 0));
        break;
      case 'capacity':
        result.sort((a, b) => (a.capacity || 0) - (b.capacity || 0));
        break;
      case 'weight':
        result.sort((a, b) => (a.weight || 0) - (b.weight || 0));
        break;
      default:
        // availability: available first
        const available = result.filter((t: any) => t.isAvailable !== false);
        const unavailable = result.filter((t: any) => t.isAvailable === false);
        result = [...available, ...unavailable];
    }

    return result;
  }, [tents, filters.sort]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedTents.slice(start, start + PAGE_SIZE);
  }, [sortedTents, page]);

  const total = sortedTents.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleDateChange = useCallback((start: string, end: string) => {
    setDates(start, end);
    setPage(1);
  }, [setDates]);

  const selectedTent = useMemo(() => {
    if (!selectedTentId || !tents) return null;
    return tents.find((t: any) => t.id === selectedTentId) || null;
  }, [selectedTentId, tents]);

  // Active filter chips
  const filterChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];
    filters.capacity.forEach((v) =>
      chips.push({ label: `${v} чел.`, onRemove: () => filters.toggleCapacity(v) }),
    );
    filters.season.forEach((v) =>
      chips.push({ label: v, onRemove: () => filters.toggleSeason(v) }),
    );
    filters.type.forEach((v) =>
      chips.push({ label: v, onRemove: () => filters.toggleType(v) }),
    );
    filters.brand.forEach((v) =>
      chips.push({ label: v, onRemove: () => filters.toggleBrand(v) }),
    );
    if (filters.minPrice !== undefined)
      chips.push({ label: `от ${filters.minPrice.toLocaleString()} ₸`, onRemove: () => filters.setMinPrice(undefined) });
    if (filters.maxPrice !== undefined)
      chips.push({ label: `до ${filters.maxPrice.toLocaleString()} ₸`, onRemove: () => filters.setMaxPrice(undefined) });
    if (filters.maxWeight !== undefined)
      chips.push({ label: `до ${filters.maxWeight} кг`, onRemove: () => filters.setMaxWeight(undefined) });
    return chips;
  }, [filters]);

  const activeFiltersCount = filterChips.length;

  const handleResetFilters = useCallback(() => {
    filters.reset();
    setPage(1);
  }, [filters]);

  const handleSortChange = useCallback((sort: SortOption) => {
    filters.setSort(sort);
    setMobileSortOpen(false);
  }, [filters]);

  return (
    <main className="min-h-screen bg-stone-50/40">
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 md:py-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl mb-2">
          Каталог палаток
        </h1>
        <p className="text-sm text-slate-500 mb-6 md:mb-8">
          Выберите даты и подберите палатку под свои планы
        </p>

        <div className="space-y-6">
          <RentalDatePanel
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr] md:gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden md:block">
              <div className="sticky top-24">
                <TentFilters />
              </div>
            </aside>

            {/* Products */}
            <div className="space-y-5">
              <CatalogToolbar
                total={total}
                activeFiltersCount={activeFiltersCount}
                sort={filters.sort}
                onSortChange={handleSortChange}
                filterChips={filterChips}
                onResetFilters={handleResetFilters}
                onOpenMobileFilters={() => setMobileFiltersOpen(true)}
                onOpenMobileSort={() => setMobileSortOpen(true)}
              />

              {isLoading ? (
                <div className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TentSkeletonCard key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-emerald-900/10 bg-white py-20 text-center shadow-sm">
                  <p className="text-sm text-slate-500 mb-4">Не удалось загрузить палатки</p>
                  <Button variant="outline" onClick={() => refetch()} className="rounded-2xl">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Повторить
                  </Button>
                </div>
              ) : paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-emerald-900/10 bg-white py-20 text-center shadow-sm">
                  <PackageOpen className="h-12 w-12 text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Палатки не найдены</h3>
                  <p className="text-sm text-slate-500 mb-6 max-w-sm">
                    Попробуйте изменить даты или сбросить фильтры
                  </p>
                  <Button variant="outline" onClick={handleResetFilters} className="rounded-2xl">
                    Сбросить фильтры
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {paginated.map((tent: any) => (
                      <TentCard
                        key={tent.id}
                        tent={tent}
                        onClick={() => setSelectedTentId(tent.id)}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Назад
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Button
                          key={p}
                          variant={p === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPage(p)}
                          className={`min-w-[2.5rem] rounded-xl ${p === page ? 'pointer-events-none' : ''}`}
                        >
                          {p}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        Вперёд
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Фильтры"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-2xl" onClick={handleResetFilters}>
              Сбросить
            </Button>
            <Button
              className="flex-1 rounded-2xl bg-emerald-700 hover:bg-emerald-800"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Показать {total} палаток
            </Button>
          </div>
        }
      >
        <TentFilters />
      </MobileFilterDrawer>

      {/* Mobile sort drawer */}
      <MobileFilterDrawer
        open={mobileSortOpen}
        onClose={() => setMobileSortOpen(false)}
        title="Сортировка"
      >
        <div className="space-y-2 py-2">
          {([
            ['availability', 'Сначала доступные'],
            ['price_asc', 'Сначала дешевле'],
            ['price_desc', 'Сначала дороже'],
            ['capacity', 'По вместимости'],
            ['weight', 'По весу'],
          ] as [SortOption, string][]).map(([value, label]) => (
            <button
              key={value}
              onClick={() => handleSortChange(value)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                filters.sort === value
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-700 hover:bg-stone-50'
              }`}
            >
              {label}
              {filters.sort === value && (
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
              )}
            </button>
          ))}
        </div>
      </MobileFilterDrawer>

      <TentDetailModal
        tent={selectedTent}
        open={!!selectedTentId}
        onClose={() => setSelectedTentId(null)}
      />
    </main>
  );
};
