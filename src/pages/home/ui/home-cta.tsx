import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { useRevealOnScroll } from '@/shared/lib/use-reveal-on-scroll';
import { cn } from '@/shared/lib/cn';
import { ArrowRight } from 'lucide-react';

export function HomeCta() {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div
          ref={ref}
          className={cn(
            'relative overflow-hidden rounded-[2rem] bg-emerald-900 px-6 py-16 text-center text-white md:px-12 md:py-20 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          )}
        >
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-800/40" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-emerald-800/40" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Готовы к выходным на природе?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/75 md:text-lg">
              Выбери палатку из каталога, укажи даты — и мы всё подготовим.
              Останется только собрать рюкзак.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to={ROUTES.CATALOG}>
                <Button
                  size="lg"
                  className="min-w-[220px] bg-white text-emerald-950 font-semibold shadow-lg hover:bg-emerald-50"
                >
                  Перейти в каталог
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <p className="text-xs text-white/50 sm:hidden">
                Доставка, бронь и подбор палатки — онлайн
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
