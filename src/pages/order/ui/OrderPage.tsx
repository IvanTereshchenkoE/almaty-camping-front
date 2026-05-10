import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '@/entities/order/model';
import { useAvailableAccessories } from '@/entities/accessory/model/use-accessories';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ROUTES } from '@/shared/config';
import { Loader2, Minus, Plus, Trash2 } from 'lucide-react';

export const OrderPage = () => {
  const navigate = useNavigate();
  const { tentItem, accessories, startDate, endDate, rentalDays, addAccessory, removeAccessory, setTent } = useOrderStore();
  const { data: availableAccessories, isLoading } = useAvailableAccessories(startDate, endDate);

  if (!tentItem) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Сначала выберите палатку</h2>
        <Button onClick={() => navigate(ROUTES.CATALOG)}>В каталог</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <h2 className="text-3xl font-bold tracking-tight mb-8">Конфигурация заказа</h2>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Выбранная палатка</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{tentItem.nameSnapshot}</p>
                  <p className="text-sm text-muted-foreground">
                    {tentItem.dailyPriceSnapshot.toLocaleString()} ₸ × {rentalDays} сут = {tentItem.totalPrice.toLocaleString()} ₸
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setTent(null)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Дополнительное оборудование</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <div className="space-y-3">
                  {(availableAccessories || []).map((acc: any) => {
                    const existing = accessories.find((a) => a.itemId === acc.id);
                    const maxQty = acc.availableQuantity || acc.totalQuantity || 0;
                    return (
                      <div key={acc.id} className="flex items-center justify-between border rounded-md p-3">
                        <div>
                          <p className="font-medium">{acc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {acc.dailyPrice.toLocaleString()} ₸/сут · Доступно: {maxQty}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {existing ? (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  if (existing.quantity <= 1) removeAccessory(acc.id);
                                  else {
                                    addAccessory({
                                      ...existing,
                                      quantity: existing.quantity - 1,
                                      totalPrice: (existing.quantity - 1) * existing.dailyPriceSnapshot * rentalDays,
                                    });
                                  }
                                }}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center text-sm">{existing.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                disabled={existing.quantity >= maxQty}
                                onClick={() => {
                                  addAccessory({
                                    ...existing,
                                    quantity: existing.quantity + 1,
                                    totalPrice: (existing.quantity + 1) * existing.dailyPriceSnapshot * rentalDays,
                                  });
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() =>
                                addAccessory({
                                  itemType: 'accessory',
                                  itemId: acc.id,
                                  nameSnapshot: acc.name,
                                  quantity: 1,
                                  dailyPriceSnapshot: acc.dailyPrice,
                                  totalPrice: acc.dailyPrice * rentalDays,
                                })
                              }
                              disabled={maxQty <= 0}
                            >
                              Добавить
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Ваш заказ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {startDate} — {endDate} ({rentalDays} сут)
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{tentItem.nameSnapshot}</span>
                  <span>{tentItem.totalPrice.toLocaleString()} ₸</span>
                </div>
                {accessories.map((a) => (
                  <div key={a.itemId} className="flex justify-between text-sm">
                    <span>{a.nameSnapshot} × {a.quantity}</span>
                    <span>{a.totalPrice.toLocaleString()} ₸</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Итого</span>
                <span>{useOrderStore.getState().getTotal().toLocaleString()} ₸</span>
              </div>
              <Button className="w-full" onClick={() => navigate(ROUTES.ORDER_CONTACTS)}>
                Продолжить
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
