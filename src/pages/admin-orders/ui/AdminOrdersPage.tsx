import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdminOrders, useArchiveOldOrders } from '@/entities/order/model/use-admin-orders';
import { ROUTES } from '@/shared/config';
import { statusColors, allStatuses } from '@/shared/config/order-status';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { Loader2, PackageCheck, Archive, BarChart3 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export const AdminOrdersPage = () => {
  const { t } = useTranslation('admin');
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [search, setSearch] = useState('');
  const { data: orders, isLoading } = useAdminOrders(statusFilter || undefined);
  const archiveOld = useArchiveOldOrders();

  const filtered = orders?.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.clientName.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.orderNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">{t('orders.title')}</h2>
        <div className="flex flex-wrap gap-2">
          <Link to={ROUTES.ADMIN_ANALYTICS}>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-1" />
              {t('orders.analytics')}
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => archiveOld.mutate()}
            disabled={archiveOld.isPending}
          >
            <Archive className="h-4 w-4 mr-1" />
            {t('orders.archiveOld')}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant={statusFilter === 'ACTIVE' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('ACTIVE')}>
          {t('orders.active')}
        </Button>
        <Button variant={statusFilter === 'ARCHIVED' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('ARCHIVED')}>
          {t('orders.archive')}
        </Button>
        {allStatuses.map((key) => (
          <Button
            key={key}
            variant={statusFilter === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(key)}
          >
            {t(`orders.status.${key}`)}
          </Button>
        ))}
      </div>

      <div className="mb-6">
        <Input
          placeholder={t('orders.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered && filtered.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <PackageCheck className="h-12 w-12 mx-auto mb-4" />
          <p>{t('orders.notFound')}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered?.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="text-base">
                      {order.orderNumber} — {order.clientName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {order.phone} · {new Date(order.startDate).toLocaleDateString()} — {new Date(order.endDate).toLocaleDateString()} · {order.rentalDays} {t('orders.rentalDays')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(order as any).isArchived && (
                      <Badge variant="secondary">{t('orders.archive')}</Badge>
                    )}
                    <Badge className={cn('text-white', statusColors[order.status] || 'bg-gray-500')}>
                      {t(`orders.status.${order.status}`) || order.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">{t('orders.sum')}</span>{' '}
                    <span className="font-medium">{order.totalAmount.toLocaleString()} ₸</span>
                    {order.prepaymentAmount > 0 && (
                      <span className="text-muted-foreground ml-2">
                        ({t('orders.prepayment')} {order.prepaymentAmount.toLocaleString()} ₸)
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link to={`${ROUTES.ADMIN_ORDERS}/${order.id}`}>
                      <Button size="sm" variant="outline">
                        {t('orders.open')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
