import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { MapPin, Truck, ShieldCheck, Smartphone } from 'lucide-react';


const HERO_VIDEO_SRC = '/videos/videoplayback.mp4';

const METRICS = [
  { icon: MapPin, label: '450 км', desc: 'вокруг Алматы' },
  { icon: Truck, label: 'Доставка', desc: 'к старту' },
  { icon: ShieldCheck, label: 'Без залога', desc: 'и лишних документов' },
  { icon: Smartphone, label: 'Онлайн', desc: 'бронирование' },
];

export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      el.pause();
    } else {
      void el.play().catch(() => {});
    }
  }, []);

  const bgOffset = scrollY * 0.08;
  const contentOffset = scrollY * -0.04;

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[min(100svh,900px)] flex-col overflow-hidden bg-emerald-950 text-white"
    >
      {/* Video background with parallax */}
      <div
        className="pointer-events-none absolute inset-0 z-0 will-change-transform"
        style={{ transform: `translateY(${bgOffset}px) scale(1.08)` }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={HERO_VIDEO_SRC}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden
        />
      </div>

      {/* Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-emerald-950/75 via-emerald-900/60 to-emerald-950/85"
        aria-hidden
      />

      {/* Content with parallax */}
      <div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-24 md:px-6 md:py-28 will-change-transform"
        style={{ transform: `translateY(${contentOffset}px)` }}
      >
        <div className="flex flex-col items-center text-center">
          <Badge
            variant="outline"
            className="mb-6 border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm hover:bg-white/15"
          >
            Аренда палаток в Алматы
          </Badge>

          <h1 className="max-w-4xl text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Кемпинг в Алматы
            <br />
            <span className="text-emerald-300">просто и удобно</span>
          </h1>

          <p className="mx-auto mt-6 max-w-[720px] text-lg leading-relaxed text-white/85 md:text-xl">
            Мы не профессиональные альпинисты. Мы обычные люди, которые любят природу.
            Возьми палатку в аренду или купи свою — и отправляйся на выходные в горы.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={ROUTES.CATALOG}>
              <Button
                size="lg"
                className="min-w-[220px] bg-white text-emerald-950 font-semibold shadow-lg hover:bg-emerald-50"
              >
                Посмотреть палатки
              </Button>
            </Link>
            <a href="#locations">
              <Button
                size="lg"
                variant="outline"
                className="min-w-[220px] border-white/40 bg-transparent text-white font-semibold shadow-sm hover:bg-white/15 hover:text-white hover:border-white/50"
              >
                Популярные места
              </Button>
            </a>
          </div>
        </div>

        {/* Metrics */}
        <div className="mx-auto mt-12 grid grid-cols-2 gap-3 md:mt-16 md:max-w-3xl md:grid-cols-4 md:gap-4">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm md:px-5 md:py-3.5"
            >
              <m.icon className="h-5 w-5 shrink-0 text-emerald-300" />
              <div className="text-left">
                <p className="text-sm font-semibold">{m.label}</p>
                <p className="text-xs text-white/70">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
