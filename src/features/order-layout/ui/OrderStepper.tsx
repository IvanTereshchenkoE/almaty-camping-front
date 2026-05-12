import { Tent, User, ClipboardCheck, CheckCircle } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

const STEPS = [
  { label: 'Комплектация', icon: Tent },
  { label: 'Контакты', icon: User },
  { label: 'Проверка', icon: ClipboardCheck },
  { label: 'Готово', icon: CheckCircle },
];

interface Props {
  currentStep: number; // 0-based
}

export const OrderStepper = ({ currentStep }: Props) => {
  return (
    <div className="mb-6 md:mb-8">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center gap-2">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;
          const isUpcoming = i > currentStep;

          return (
            <div key={step.label} className="flex items-center gap-2">
              <div
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 transition-colors',
                  isActive && 'bg-emerald-50 text-emerald-800',
                  isCompleted && 'text-emerald-700',
                  isUpcoming && 'text-slate-400'
                )}
              >
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                    isActive && 'bg-emerald-700 text-white',
                    isCompleted && 'bg-emerald-100 text-emerald-700',
                    isUpcoming && 'bg-slate-100 text-slate-400'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                </div>
                <span className="text-sm font-medium">{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-px w-8',
                    isCompleted ? 'bg-emerald-300' : 'bg-slate-200'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            Шаг {currentStep + 1} из {STEPS.length - 1}
          </span>
          <span className="text-sm text-slate-500">{STEPS[currentStep]?.label}</span>
        </div>
        <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
