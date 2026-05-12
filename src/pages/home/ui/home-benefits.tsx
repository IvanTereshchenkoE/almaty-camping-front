import { useRevealOnScroll } from '@/shared/lib/use-reveal-on-scroll';
import { MapPin, Truck, ShieldCheck, HeartHandshake } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

const BENEFITS = [
  {
    icon: MapPin,
    title: 'Близко к городу',
    desc: 'Все локации в радиусе 450 км от Алматы — от Кольсай до Алтын-Эмеля.',
  },
  {
    icon: Truck,
    title: 'Доставка',
    desc: 'Привезём палатку к месту старта или заберём оттуда после похода.',
  },
  {
    icon: ShieldCheck,
    title: 'Простая аренда',
    desc: 'Без залога и лишних документов. Онлайн-бронирование за пару минут.',
  },
  {
    icon: HeartHandshake,
    title: 'Для всех',
    desc: 'От новичков до опытных. Подберём палатку под ваш уровень и сезон.',
  },
];

function BenefitCard({ item, index }: { item: typeof BENEFITS[0]; index: number }) {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn(
        'group rounded-3xl border border-emerald-900/10 bg-white p-6 md:p-8 transition-all duration-500 hover:shadow-lg hover:shadow-emerald-900/5 hover:-translate-y-1',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100">
        <item.icon className="h-6 w-6" strokeWidth={1.8} />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-slate-900 mb-2">
        {item.title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
    </div>
  );
}

export function HomeBenefits() {
  const { ref: titleRef, isVisible: titleVisible } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-emerald-50/40">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div
          ref={titleRef}
          className={cn(
            'text-center mb-12 md:mb-16 transition-all duration-500',
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          )}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Почему выбирают нас
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Мы сами ходим в походы и знаем, что важно — надёжное снаряжение, честные цены и никакой бюрократии.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((item, i) => (
            <BenefitCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
