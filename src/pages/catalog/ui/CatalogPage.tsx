import { useTents } from '@/entities/tent/model';
import { useTentFiltersStore } from '@/features/tent-filters/model';
import { TentFilters } from '@/features/tent-filters/ui';
import { TentCard } from '@/features/tent-card/ui';
import { useOrderStore } from '@/entities/order/model';
import { useMemo, useState, useCallback } from 'react';
import { Button } from '@/shared/ui/button';
import { DateRangePicker } from '@/shared/ui/date-range-picker';
import { Loader2, PackageOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { TentDetailModal } from '@/features/tent-detail-modal/ui';

const PAGE_SIZE = 6;

export const CatalogPage = () => {
  const filters = useTentFiltersStore();
  const { startDate, endDate, setDates } = useOrderStore();
  const [page, setPage] = useState(1);
  const [selectedTentId, setSelectedTentId] = useState<string | null>(null);

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

  const { data: tents, isLoading } = useTents(apiFilters);

  const sortedTents = useMemo(() => {
    if (!tents) return [];
    const available = tents.filter((t: any) => t.isAvailable !== false);
    const unavailable = tents.filter((t: any) => t.isAvailable === false);
    return [...available, ...unavailable];
  }, [tents]);

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <h2 className="text-3xl font-bold tracking-tight mb-8">Каталог палаток</h2>

      <div className="mb-8 rounded-lg border bg-card p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Выберите даты аренды</h3>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside>
          <TentFilters />
        </aside>

        <div>
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-1">Палатки не найдены</h3>
              <p className="text-sm text-muted-foreground">Попробуйте изменить фильтры или даты</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
                    size="icon"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(p)}
                      className={cn('min-w-[2.5rem]', p === page && 'pointer-events-none')}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <TentDetailModal
        tent={selectedTent}
        open={!!selectedTentId}
        onClose={() => setSelectedTentId(null)}
      />
    </div>
  );
};
