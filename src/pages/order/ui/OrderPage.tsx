import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '@/entities/order/model';
import { useAvailableAccessories } from '@/entities/accessory/model';
import { Button } from '@/shared/ui/button';
import { OrderLayout } from '@/features/order-layout/ui/OrderLayout';
import { OrderSummaryCard } from '@/features/order-summary-card/ui/OrderSummaryCard';
import { SelectedTentCard } from '@/features/selected-tent-card/ui/SelectedTentCard';
import { AccessoryCard } from '@/features/accessory-card/ui/AccessoryCard';
import { PackageOpen } from 'lucide-react';
import { ROUTES } from '@/shared/config';

export const OrderPage = () => {
  const navigate = useNavigate();
  const {
    tentItem,
    accessories,
    startDate,
    endDate,
    rentalDays,
    addAccessory,
    removeAccessory,
    setTent,
    getTotal,
  } = useOrderStore();

  const { data: availableAccessories, isLoading } = useAvailableAccessories(startDate, endDate);

  useEffect(() => {
    if (!tentItem) {
      navigate(ROUTES.CATALOG);
    }
  }, [tentItem, navigate]);

  if (!tentItem) return null;

  const handleAddAccessory = (acc: any) => {
    addAccessory({
      itemType: 'accessory',
      itemId: acc.id,
      nameSnapshot: acc.name,
      quantity: 1,
      dailyPriceSnapshot: acc.dailyPrice,
      totalPrice: acc.dailyPrice * rentalDays,
      imageUrlSnapshot: acc.mainImage,
    });
  };

  const handleIncrement = (acc: any) => {
    const existing = accessories.find((a) => a.itemId === acc.id);
    if (!existing) return;
    const newQty = existing.quantity + 1;
    addAccessory({
      ...existing,
      quantity: newQty,
      totalPrice: existing.dailyPriceSnapshot * newQty * rentalDays,
    });
  };

  const handleDecrement = (acc: any) => {
    const existing = accessories.find((a) => a.itemId === acc.id);
    if (!existing) return;
    const newQty = existing.quantity - 1;
    if (newQty <= 0) {
      removeAccessory(acc.id);
    } else {
      addAccessory({
        ...existing,
        quantity: newQty,
        totalPrice: existing.dailyPriceSnapshot * newQty * rentalDays,
      });
    }
  };

  const total = getTotal();

  return (
    <OrderLayout currentStep={0}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_380px] md:gap-8">
        {/* Main content */}
        <div className="space-y-6">
          <SelectedTentCard
            tentItem={tentItem}
            rentalDays={rentalDays}
            onRemove={() => setTent(null)}
          />

          <div>
            <h3 className="text-base font-semibold text-slate-900 mb-3">Дополнительное оборудование</h3>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 animate-pulse rounded-2xl bg-stone-100" />
                ))}
              </div>
            ) : availableAccessories && availableAccessories.length > 0 ? (
              <div className="space-y-3">
                {availableAccessories.map((acc: any) => {
                  const existing = accessories.find((a) => a.itemId === acc.id);
                  return (
                    <AccessoryCard
                      key={acc.id}
                      name={acc.name}
                      dailyPrice={acc.dailyPrice}
                      availableQuantity={acc.availableQuantity ?? acc.totalQuantity ?? 0}
                      totalQuantity={acc.totalQuantity ?? 0}
                      mainImage={acc.mainImage}
                      quantity={existing?.quantity ?? 0}
                      onAdd={() => handleAddAccessory(acc)}
                      onIncrement={() => handleIncrement(acc)}
                      onDecrement={() => handleDecrement(acc)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-2xl border border-emerald-900/10 bg-white py-12 text-center">
                <PackageOpen className="h-10 w-10 text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">Нет доступного оборудования на выбранные даты</p>
              </div>
            )}
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
              actionButton={
                <Button
                  onClick={() => navigate(ROUTES.ORDER_CONTACTS)}
                  className="h-12 w-full rounded-2xl bg-emerald-700 hover:bg-emerald-800"
                >
                  Продолжить
                </Button>
              }
            />
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">Итого</p>
            <p className="text-lg font-bold text-slate-900">{total.toLocaleString()} ₸</p>
          </div>
          <Button
            onClick={() => navigate(ROUTES.ORDER_CONTACTS)}
            className="h-11 rounded-2xl bg-emerald-700 px-6 hover:bg-emerald-800"
          >
            Продолжить
          </Button>
        </div>
      </div>

      {/* Safe area spacer for mobile footer */}
      <div className="md:hidden h-20" />
    </OrderLayout>
  );
};
