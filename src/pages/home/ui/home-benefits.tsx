import { useRevealOnScroll } from '@/shared/lib/use-reveal-on-scroll';
import { MapPin, Truck, ShieldCheck, HeartHandshake } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from 'react-i18next';

const BENEFIT_ICONS = [MapPin, Truck, ShieldCheck, HeartHandshake];
const BENEFIT_KEYS = ['nearCity', 'delivery', 'simple', 'forAll'];

function BenefitCard({ keyName, index }: { keyName: string; index: number }) {
  const { t } = useTranslation('home');
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>();
  const Icon = BENEFIT_ICONS[index];

  return (
    <div
      ref={ref}
      className={cn(
        'group rounded-3xl border border-emerald-900/10 bg-white p-6 md:p-8 transition-all duration-500 hover:shadow-lg hover:shadow-emerald-900/5 hover:-translate-y-1',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100">
          <Icon className="h-6 w-6" strokeWidth={1.8} />
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">
          {t(`benefits.cards.${keyName}.title`)}
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-slate-500">
        {t(`benefits.cards.${keyName}.desc`)}
      </p>
    </div>
  );
}

export function HomeBenefits() {
  const { t } = useTranslation('home');
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
            {t('benefits.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            {t('benefits.subtitle')}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFIT_KEYS.map((key, i) => (
            <BenefitCard key={key} keyName={key} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
