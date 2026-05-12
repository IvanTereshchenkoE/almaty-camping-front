import { MapPin, Mountain, ArrowRight } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/cn';
import type { Location } from '@/shared/types';

interface LocationCardProps {
  location: Location;
  onClick: () => void;
  index: number;
  isVisible: boolean;
}

export function LocationCard({ location, onClick, index, isVisible }: LocationCardProps) {
  const hasImage = !!location.imageUrl;

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative isolate w-full text-left overflow-hidden rounded-[28px]',
        'border border-slate-200/80 bg-white shadow-sm',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_50px_rgba(15,118,110,0.12)]',
        'active:scale-[0.99]',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image area — unified aspect ratio, overflow hidden */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {hasImage ? (
          <img
            src={location.imageUrl}
            alt={location.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-emerald-100 via-stone-100 to-emerald-200">
            {/* Decorative radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.7),transparent_35%)]" />
            {/* Decorative icon */}
            <Mountain className="absolute right-6 top-6 h-10 w-10 text-emerald-700/20" strokeWidth={1.2} />
            {/* Large faint text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-bold tracking-tight text-emerald-950/20">
                {location.region.slice(0, 3)}
              </span>
            </div>
          </div>
        )}

        {/* Distance badge — stays still on hover */}
        <div className="absolute left-4 top-4 z-10">
          <Badge className="rounded-full bg-white/90 text-slate-700 backdrop-blur-sm border-0 shadow-sm">
            <MapPin className="mr-1 h-3 w-3 text-emerald-600" />
            {location.distanceFromAlmatyKm} км
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 mb-1 transition-colors group-hover:text-emerald-800">
          {location.name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{location.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(Array.isArray(location.features) ? location.features : []).slice(0, 2).map((f) => (
              <Badge key={f} variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                {f}
              </Badge>
            ))}
            {Array.isArray(location.features) && location.features.length > 2 && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-normal">
                +{location.features.length - 2}
              </Badge>
            )}
          </div>

          <span className="inline-flex items-center text-xs font-medium text-emerald-700 opacity-0 transition-all group-hover:opacity-100 translate-x-0 group-hover:translate-x-1">
            Подробнее
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </button>
  );
}
