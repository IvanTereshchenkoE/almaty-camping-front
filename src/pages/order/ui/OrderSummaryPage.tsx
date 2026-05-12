import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '@/entities/order/model';
import { useCreateOrder } from '@/entities/order/model';
import { addMyOrder } from '@/entities/order/lib';
import { Button } from '@/shared/ui/button';
import { OrderLayout } from '@/features/order-layout/ui/OrderLayout';
import { OrderSummaryCard } from '@/features/order-summary-card/ui/OrderSummaryCard';
import { CalendarRange, User, Package } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import { Loader2 } from 'lucide-react';

export const OrderSummaryPage = () => {
  const navigate = useNavigate();
  const {
    tentItem,
    accessories,
    clientName,
    phone,
    telegram,
    whatsapp,
    email,
    comment,
    startDate,
    endDate,
    rentalDays,
    getTotal,
    clear,
  } = useOrderStore();
  const createOrder = useCreateOrder();

  useEffect(() => {
    if (!tentItem) {
      navigate(ROUTES.CATALOG);
    }
  }, [tentItem, navigate]);

  if (!tentItem) return null;

  const total = getTotal();

  const handleSubmit = async () => {
    const items = [];
    if (tentItem) items.push({ ...tentItem, rentalDays });
    accessories.forEach((a) => items.push({ ...a, rentalDays }));

    const order = await createOrder.mutateAsync({
      clientName,
      phone,
      telegram,
      whatsapp,
      email,
      comment,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      rentalDays,
      totalAmount: getTotal(),
      items,
    });

    addMyOrder({
      id: order.id,
      orderNumber: order.orderNumber,
      clientName: order.clientName,
      phone: order.phone,
      createdAt: order.createdAt,
      status: order.status,
      totalAmount: order.totalAmount,
    });
    clear();
    navigate(ROUTES.ORDER_SUCCESS, {
      state: { orderNumber: order.orderNumber, totalAmount: order.totalAmount },
    });
  };

  return (
    <OrderLayout currentStep={2}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_380px] md:gap-8">
        {/* Review */}
        <div className="space-y-5">
          <div className="rounded-[28px] border border-emerald-900/10 bg-white p-5 shadow-sm md:p-8">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-6">
              Проверьте данные
            </h2>

            {/* Dates */}
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-stone-50 p-4">
              <CalendarRange className="h-5 w-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {startDate} — {endDate}
                </p>
                <p className="text-xs text-slate-500">
                  {rentalDays} {rentalDays === 1 ? 'сутки' : rentalDays < 5 ? 'суток' : 'суток'}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Состав заказа</h3>
              <div className="divide-y divide-slate-100">
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-700">{tentItem.nameSnapshot}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">{tentItem.totalPrice.toLocaleString()} ₸</span>
                </div>
                {accessories.map((acc) => (
                  <div key={acc.itemId} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-700">
                        {acc.nameSnapshot} × {acc.quantity}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{acc.totalPrice.toLocaleString()} ₸</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contacts */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Контакты</h3>
              <div className="space-y-2 rounded-xl bg-stone-50 p-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-700">{clientName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 w-20">Телефон</span>
                  <span className="text-sm text-slate-700">{phone}</span>
                </div>
                {telegram && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500 w-20">Telegram</span>
                    <span className="text-sm text-slate-700">{telegram}</span>
                  </div>
                )}
                {whatsapp && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500 w-20">WhatsApp</span>
                    <span className="text-sm text-slate-700">{whatsapp}</span>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500 w-20">Email</span>
                    <span className="text-sm text-slate-700">{email}</span>
                  </div>
                )}
              </div>
            </div>

            {comment && (
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Комментарий</h3>
                <p className="text-sm text-slate-600 rounded-xl bg-stone-50 p-4">{comment}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.ORDER_CONTACTS)}
                className="h-12 flex-1 rounded-2xl border-emerald-900/10"
              >
                Назад
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createOrder.isPending}
                className="h-12 flex-1 rounded-2xl bg-emerald-700 hover:bg-emerald-800"
              >
                {createOrder.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Отправить заказ
              </Button>
            </div>
          </div>
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
