import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '@/entities/order/model';
import { OrderLayout } from '@/features/order-layout/ui/OrderLayout';
import { OrderSummaryCard } from '@/features/order-summary-card/ui/OrderSummaryCard';
import { ContactForm, type ContactFormData } from '@/features/contact-form/ui/ContactForm';
import { ROUTES } from '@/shared/config';

export const OrderContactsPage = () => {
  const navigate = useNavigate();
  const {
    tentItem,
    accessories,
    startDate,
    endDate,
    rentalDays,
    clientName,
    phone,
    telegram,
    whatsapp,
    email,
    comment,
    setContacts,
    getTotal,
  } = useOrderStore();

  useEffect(() => {
    if (!tentItem) {
      navigate(ROUTES.CATALOG);
    }
  }, [tentItem, navigate]);

  if (!tentItem) return null;

  const total = getTotal();

  const handleSubmit = (data: ContactFormData) => {
    setContacts(data);
    navigate(ROUTES.ORDER_SUMMARY);
  };

  return (
    <OrderLayout currentStep={1}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_380px] md:gap-8">
        {/* Form */}
        <div className="rounded-[28px] border border-emerald-900/10 bg-white p-5 shadow-sm md:p-8">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-2">
            Контактные данные
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Укажите данные, чтобы мы могли связаться с вами для подтверждения заказа
          </p>
          <ContactForm
            defaultValues={{ clientName, phone, telegram, whatsapp, email, comment }}
            onSubmit={handleSubmit}
            onBack={() => navigate(ROUTES.ORDER)}
          />
        </div>

        {/* Desktop summary */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <OrderSummaryCard
              startDate={startDate}
              endDate={endDate}
              rentalDays={rentalDays}
              tentItem={tentItem}
              accessories={accessories}
              total={total}
            />
          </div>
        </div>
      </div>
    </OrderLayout>
  );
};
