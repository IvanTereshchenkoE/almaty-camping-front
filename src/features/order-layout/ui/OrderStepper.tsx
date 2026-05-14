import { Tent, User, ClipboardCheck, CheckCircle } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from 'react-i18next';

interface Props {
  currentStep: number;
}

export const OrderStepper = ({ currentStep }: Props) => {
  const { t } = useTranslation('order');

  const steps = [
    { label: t('stepper.equipment'), icon: Tent },
    { label: t('stepper.contacts'), icon: User },
    { label: t('stepper.review'), icon: ClipboardCheck },
    { label: t('stepper.done'), icon: CheckCircle },
  ];

  return (
    <div className="mb-6 md:mb-8">
      <div className="hidden md:flex items-center justify-center gap-2">
        {steps.map((step, i) => {
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
              {i < steps.length - 1 && (
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

      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            {t('stepper.step')} {currentStep + 1} / {steps.length - 1}
          </span>
          <span className="text-sm text-slate-500">{steps[currentStep]?.label}</span>
        </div>
        <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
