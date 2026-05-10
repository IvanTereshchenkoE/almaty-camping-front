import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders, removeMyOrder, type MyOrderMeta } from '@/entities/order/lib/my-orders-storage';
import { useOrderById } from '@/entities/order/model/use-order';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Loader2, PackageOpen, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

const statusLabels: Record<string, string> = {
  NEW: 'Новая заявка',
  VIEWED: 'Просмотрена',
  CONFIRMED: 'Подтверждена',
  PREPAID: 'Предоплата внесена',
  ISSUED: 'Выдано клиенту',
  RETURNED: 'Возвращено',
  COMPLETED: 'Завершена',
  CANCELLED: 'Отменена',
  DAMAGED: 'Есть повреждения',
};

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-500',
  VIEWED: 'bg-slate-500',
  CONFIRMED: 'bg-yellow-500',
  PREPAID: 'bg-emerald-500',
  ISSUED: 'bg-purple-500',
  RETURNED: 'bg-orange-500',
  COMPLETED: 'bg-green-500',
  CANCELLED: 'bg-gray-500',
  DAMAGED: 'bg-red-500',
};

function OrderCard({ meta, onRemove }: { meta: MyOrderMeta; onRemove: () => void }) {
  const { data: order, isLoading } = useOrderById(meta.id);

  const display = order || meta;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base">{display.orderNumber}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {display.clientName} · {display.phone}
            </p>
          </div>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Badge className={cn('text-white', statusColors[display.status] || 'bg-gray-500')}>
              {statusLabels[display.status] || display.status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm space-y-1">
            {order && (
              <>
                <p>
                  <span className="text-muted-foreground">Даты:</span>{' '}
                  {new Date(order.startDate).toLocaleDateString('ru-KZ')} — {new Date(order.endDate).toLocaleDateString('ru-KZ')}
                </p>
                <p>
                  <span className="text-muted-foreground">Позиций:</span> {order.items.length}
                </p>
              </>
            )}
            <p>
              <span className="text-muted-foreground">Сумма:</span>{' '}
              <span className="font-medium">{(order?.totalAmount ?? display.totalAmount).toLocaleString()} ₸</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Создан: {new Date(display.createdAt).toLocaleString('ru-KZ')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={onRemove}>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const MyOrdersPage = () => {
  const [orders, setOrders] = useState<MyOrderMeta[]>([]);

  useEffect(() => {
    setOrders(getMyOrders());
  }, []);

  const handleRemove = (id: string) => {
    removeMyOrder(id);
    setOrders(getMyOrders());
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <h2 className="text-3xl font-bold tracking-tight mb-8">Мои заказы</h2>

      {orders.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <PackageOpen className="h-12 w-12 mx-auto mb-4" />
          <p className="mb-2">У вас пока нет заказов</p>
          <Link to="/catalog">
            <Button variant="outline">Перейти в каталог</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((meta) => (
            <OrderCard key={meta.id} meta={meta} onRemove={() => handleRemove(meta.id)} />
          ))}
        </div>
      )}
    </div>
  );
};
