import { OrderStepper } from './OrderStepper';

interface Props {
  currentStep: number;
  children: React.ReactNode;
}

export const OrderLayout = ({ currentStep, children }: Props) => {
  return (
    <main className="min-h-screen bg-stone-50/40">
      <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6 md:py-8">
        <OrderStepper currentStep={currentStep} />
        {children}
      </div>
    </main>
  );
};
