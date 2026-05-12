import { useState } from 'react';
import { ChevronLeft, ChevronRight, Tent } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { API_BASE_URL } from '@/shared/api';

interface Props {
  mainImage: string;
  images: string[];
  name: string;
}

export const TentGallery = ({ mainImage, images, name }: Props) => {
  const allImages = images.length > 0 ? images : [mainImage].filter(Boolean);
  const resolvedImages = allImages.map((img) =>
    img?.startsWith('/api/upload/') ? `${API_BASE_URL}${img}` : img
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = resolvedImages[activeIndex] || 'https://placehold.co/800x600?text=No+Image';

  const hasFallback = !activeImage || activeImage.includes('placehold');

  return (
    <div className="flex h-full flex-col">
      {/* Main image */}
      <div className="relative flex-1 overflow-hidden bg-stone-100">
        {hasFallback ? (
          <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-emerald-100 via-stone-100 to-emerald-200">
            <Tent className="absolute right-5 top-5 h-9 w-9 text-emerald-800/20" />
            <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-4xl font-bold text-emerald-950/20">
              {name.slice(0, 15)}
            </span>
          </div>
        ) : (
          <img
            src={activeImage}
            alt={name}
            className="h-full w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x600?text=No+Image'; }}
          />
        )}

        {resolvedImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => (i - 1 + resolvedImages.length) % resolvedImages.length); }}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => (i + 1) % resolvedImages.length); }}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {resolvedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto border-t border-slate-100 bg-white p-3">
          {resolvedImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
              className={cn(
                'relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                i === activeIndex
                  ? 'border-emerald-600 ring-1 ring-emerald-600/20'
                  : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <img
                src={img}
                alt={`${name} ${i + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image'; }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
