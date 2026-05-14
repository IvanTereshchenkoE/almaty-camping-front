import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders, removeMyOrder, type MyOrderMeta } from '@/entities/order/lib/my-orders-storage';
import { useOrderById } from '@/entities/order/model/use-order';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Loader2, PackageOpen, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

function OrderCard({ meta, onRemove }: { meta: MyOrderMeta; onRemove: () => void }) {
  const { t, i18n } = useTranslation('myOrders');
  const { data: order, isLoading } = useOrderById(meta.id);
  const display = order || meta;
  const locale = i18n.language === 'kk' ? 'kk-KZ' : i18n.language === 'en' ? 'en-US' : 'ru-KZ';

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
            <Badge className={cn('text-white', getStatusColor(display.status))}>
              {t(`status.${display.status}`, { defaultValue: display.status })}
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
                  <span className="text-muted-foreground">{t('dates')}:</span>{' '}
                  {new Date(order.startDate).toLocaleDateString(locale)} — {new Date(order.endDate).toLocaleDateString(locale)}
                </p>
                <p>
                  <span className="text-muted-foreground">{t('items')}:</span> {order.items.length}
                </p>
              </>
            )}
            <p>
              <span className="text-muted-foreground">{t('total')}:</span>{' '}
              <span className="font-medium">{(order?.totalAmount ?? display.totalAmount).toLocaleString()} ₸</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {t('created')}: {new Date(display.createdAt).toLocaleString(locale)}
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

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
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
  return colors[status] || 'bg-gray-500';
}

export const MyOrdersPage = () => {
  const { t } = useTranslation(['myOrders', 'seo']);
  const [orders, setOrders] = useState<MyOrderMeta[]>([]);

  useEffect(() => {
    setOrders(getMyOrders());
  }, []);

  const handleRemove = (id: string) => {
    removeMyOrder(id);
    setOrders(getMyOrders());
  };

  return (
    <>
      <Helmet>
        <title>{t('seo:myOrders.title')}</title>
        <meta name="description" content={t('seo:myOrders.description')} />
      </Helmet>
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight mb-8">{t('myOrders:title')}</h2>

        {orders.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <PackageOpen className="h-12 w-12 mx-auto mb-4" />
            <p className="mb-2">{t('myOrders:empty')}</p>
            <Link to="/catalog">
              <Button variant="outline">{t('myOrders:goToCatalog')}</Button>
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
    </>
  );
};
