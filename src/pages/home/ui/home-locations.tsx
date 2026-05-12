import { useState } from 'react';
import { useLocations } from '@/entities/location/model';
import { useRevealOnScroll } from '@/shared/lib/use-reveal-on-scroll';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { LocationCard } from './location-card';
import { LocationDetailDialog } from './location-detail-dialog';
import type { Location } from '@/shared/types';

export function HomeLocations() {
  const { data: locations, isLoading } = useLocations();
  const [selected, setSelected] = useState<Location | null>(null);
  const { ref: titleRef, isVisible: titleVisible } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section id="locations" className="py-20 md:py-28 bg-slate-50/60">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div
          ref={titleRef}
          className={cn(
            'text-center mb-12 md:mb-16 transition-all duration-500',
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          )}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Популярные места для кемпинга
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            От горных озёр до степных каньонов — выбирай локацию под свои планы.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {locations?.map((loc, i) => (
              <LocationCard
                key={loc.id}
                location={loc}
                index={i}
                isVisible={true}
                onClick={() => setSelected(loc)}
              />
            ))}
          </div>
        )}
      </div>

      <LocationDetailDialog location={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
