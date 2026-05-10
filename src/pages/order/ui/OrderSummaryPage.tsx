import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '@/entities/order/model';
import { useCreateOrder } from '@/entities/order/model/use-order';
import { addMyOrder } from '@/entities/order/lib/my-orders-storage';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ROUTES } from '@/shared/config';
import { Loader2 } from 'lucide-react';

export const OrderSummaryPage = () => {
  const navigate = useNavigate();
  const { tentItem, accessories, clientName, phone, telegram, whatsapp, email, comment, startDate, endDate, rentalDays, getTotal, clear } = useOrderStore();
  const createOrder = useCreateOrder();

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

    // Save to localStorage for "My Orders"
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
    navigate(ROUTES.ORDER_SUCCESS);
  };

  if (!tentItem) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Сначала выберите палатку</h2>
        <Button onClick={() => navigate(ROUTES.CATALOG)}>В каталог</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 md:px-6">
      <h2 className="text-3xl font-bold tracking-tight mb-8">Подтверждение заказа</h2>
      <Card>
        <CardHeader>
          <CardTitle>Сводка</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">{startDate} — {endDate} ({rentalDays} сут)</div>
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
            <span>{getTotal().toLocaleString()} ₸</span>
          </div>
          <div className="border-t pt-4 space-y-1 text-sm">
            <p><span className="text-muted-foreground">Имя:</span> {clientName}</p>
            <p><span className="text-muted-foreground">Телефон:</span> {phone}</p>
            {telegram && <p><span className="text-muted-foreground">Telegram:</span> {telegram}</p>}
            {whatsapp && <p><span className="text-muted-foreground">WhatsApp:</span> {whatsapp}</p>}
            {email && <p><span className="text-muted-foreground">Email:</span> {email}</p>}
            {comment && <p><span className="text-muted-foreground">Комментарий:</span> {comment}</p>}
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => navigate(ROUTES.ORDER_CONTACTS)}>Назад</Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={createOrder.isPending}>
              {createOrder.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Отправить заявку'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
