import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogOverlay,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { MapPin, Mountain, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import type { Location } from '@/shared/types';

const CONVENIENCE_ITEMS = [
  'Подходит для поездки на выходные',
  'Можно подобрать палатку под маршрут',
  'Доставка обсуждается при бронировании',
];

interface Props {
  location: Location | null;
  onClose: () => void;
}

export function LocationDetailDialog({ location, onClose }: Props) {
  if (!location) return null;

  const hasImage = !!location.imageUrl;
  const features = Array.isArray(location.features) ? location.features : [];

  return (
    <Dialog open={!!location} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogOverlay className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-[50%] top-[50%] z-50 grid w-[calc(100vw-24px)] max-w-[1040px] translate-x-[-50%] translate-y-[-50%] gap-0 overflow-hidden rounded-[28px] border-0 bg-white shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] md:rounded-[32px] md:w-[min(1040px,calc(100vw-48px))]"
          style={{ maxHeight: 'calc(100svh - 48px)' }}
        >
          {/* Close button */}
          <DialogPrimitive.Close
            onClick={onClose}
            className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>

          <div className="grid max-h-[calc(100svh-48px)] grid-cols-1 overflow-y-auto md:grid-cols-[0.95fr_1.05fr]">
            {/* Left — Image / Fallback */}
            <div className="relative min-h-[280px] md:min-h-[560px]">
              {hasImage ? (
                <img
                  src={location.imageUrl}
                  alt={location.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-stone-100 to-emerald-200">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.7),transparent_35%)]" />
                  <Mountain className="absolute right-8 top-8 h-16 w-16 text-emerald-700/20" strokeWidth={1.2} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-bold tracking-tight text-emerald-950/20">
                      {location.region.slice(0, 3)}
                    </span>
                  </div>
                </div>
              )}

              {/* Gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:hidden" />

              {/* Badges on image */}
              <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2">
                <Badge className="rounded-full bg-white/90 text-slate-700 backdrop-blur-sm border-0 shadow-sm">
                  <MapPin className="mr-1 h-3 w-3 text-emerald-600" />
                  {location.distanceFromAlmatyKm} км
                </Badge>
                <Badge className="rounded-full bg-white/90 text-slate-700 backdrop-blur-sm border-0 shadow-sm">
                  {location.region}
                </Badge>
              </div>
            </div>

            {/* Right — Content */}
            <div className="flex flex-col p-6 md:p-8">
              {/* Label */}
              <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Локация для кемпинга
              </span>

              {/* Title */}
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                {location.name}
              </h2>

              {/* Meta */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span>{location.region}</span>
                <span className="text-slate-300">·</span>
                <span>{location.distanceFromAlmatyKm} км от Алматы</span>
              </div>

              {/* Description */}
              <p className="mt-5 text-sm leading-relaxed text-slate-600">
                {location.description}
              </p>

              {/* Features */}
              {features.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Особенности
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {features.map((f) => (
                      <Badge
                        key={f}
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-normal"
                      >
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Convenience block */}
              <div className="mt-6">
                <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Что удобно
                </h4>
                <ul className="space-y-2">
                  {CONVENIENCE_ITEMS.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Spacer */}
              <div className="flex-1 min-h-6" />

              {/* Footer actions */}
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Link to={ROUTES.CATALOG} className="flex-1" onClick={onClose}>
                  <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold">
                    Перейти в каталог
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <DialogPrimitive.Close asChild>
                  <Button variant="outline" className="flex-1" onClick={onClose}>
                    Закрыть
                  </Button>
                </DialogPrimitive.Close>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}
