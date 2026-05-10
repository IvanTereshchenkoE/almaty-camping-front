import { useParams, useNavigate } from 'react-router-dom';
import {
  useAdminOrder,
  useUpdateOrderStatus,
  useUpdateOrderPrepayment,
  useOrderStatusHistory,
  useArchiveOrder,
} from '@/entities/order/model/use-admin-orders';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { statusLabels, statusColors, transitions, allStatuses } from '@/shared/config/order-status';
import { Loader2, ArrowLeft, Clock, Settings } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/lib/cn';

export const AdminOrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading } = useAdminOrder(orderId || '');
  const { data: statusHistory, isLoading: historyLoading } = useOrderStatusHistory(orderId || '');
  const updateStatus = useUpdateOrderStatus();
  const updatePrepayment = useUpdateOrderPrepayment();
  const archiveOrder = useArchiveOrder();
  const [prepayAmount, setPrepayAmount] = useState('');

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState('');
  const [confirmComment, setConfirmComment] = useState('');

  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualStatus, setManualStatus] = useState('');
  const [manualComment, setManualComment] = useState('');

  const [archiveModalOpen, setArchiveModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Заказ не найден</h2>
        <Button onClick={() => navigate(-1)}>Назад</Button>
      </div>
    );
  }

  const availableTransitions = transitions[order.status] || [];

  const openConfirmModal = (status: string) => {
    setConfirmStatus(status);
    setConfirmComment('');
    setConfirmModalOpen(true);
  };

  const confirmStatusChange = () => {
    updateStatus.mutate(
      { id: order.id, status: confirmStatus, comment: confirmComment },
      { onSuccess: () => setConfirmModalOpen(false) }
    );
  };

  const openManualModal = () => {
    setManualStatus('');
    setManualComment('');
    setManualModalOpen(true);
  };

  const confirmManualChange = () => {
    if (!manualStatus || manualStatus === order.status) {
      setManualModalOpen(false);
      return;
    }
    updateStatus.mutate(
      { id: order.id, status: manualStatus, comment: manualComment, resetHistory: true },
      { onSuccess: () => setManualModalOpen(false) }
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Назад
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">{order.orderNumber}</h2>
        <div className="flex items-center gap-2">
          {(order as any).isArchived && (
            <Badge variant="secondary">Архив</Badge>
          )}
          <Badge className={cn('text-white', statusColors[order.status] || 'bg-gray-500')}>
            {statusLabels[order.status] || order.status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Клиент</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Имя:</span> {order.clientName}</p>
            <p><span className="text-muted-foreground">Телефон:</span> {order.phone}</p>
            {order.telegram && <p><span className="text-muted-foreground">Telegram:</span> {order.telegram}</p>}
            {order.whatsapp && <p><span className="text-muted-foreground">WhatsApp:</span> {order.whatsapp}</p>}
            {order.email && <p><span className="text-muted-foreground">Email:</span> {order.email}</p>}
            {order.comment && <p><span className="text-muted-foreground">Комментарий:</span> {order.comment}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Аренда</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Даты:</span> {new Date(order.startDate).toLocaleDateString('ru-KZ')} — {new Date(order.endDate).toLocaleDateString('ru-KZ')}</p>
            <p><span className="text-muted-foreground">Суток:</span> {order.rentalDays}</p>
            <p><span className="text-muted-foreground">Сумма:</span> <span className="font-medium">{order.totalAmount.toLocaleString()} ₸</span></p>
            <p><span className="text-muted-foreground">Предоплата:</span> <span className="font-medium">{order.prepaymentAmount.toLocaleString()} ₸</span></p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Позиции заказа</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex justify-between text-sm">
                <div>
                  <span className="font-medium">{item.nameSnapshot}</span>
                  <span className="text-muted-foreground ml-2">× {item.quantity}</span>
                </div>
                <span>{item.totalPrice.toLocaleString()} ₸</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>Итого</span>
            <span>{order.totalAmount.toLocaleString()} ₸</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Управление статусом</CardTitle>
          <Button variant="ghost" size="icon" onClick={openManualModal} title="Ручная смена статуса">
            <Settings className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableTransitions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {availableTransitions.map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  size="sm"
                  onClick={() => openConfirmModal(s)}
                  disabled={updateStatus.isPending}
                >
                  {statusLabels[s] || s}
                </Button>
              ))}
            </div>
          )}

          {order.status === 'CONFIRMED' && (
            <div className="flex flex-wrap items-end gap-2">
              <div className="space-y-2">
                <Label htmlFor="prepay">Сумма предоплаты</Label>
                <Input
                  id="prepay"
                  type="number"
                  value={prepayAmount}
                  onChange={(e) => setPrepayAmount(e.target.value)}
                  placeholder="10000"
                />
              </div>
              <Button
                onClick={() => {
                  const amount = Number(prepayAmount);
                  if (amount > 0) {
                    updatePrepayment.mutate({ id: order.id, amount });
                  }
                }}
                disabled={updatePrepayment.isPending || !prepayAmount}
              >
                Зафиксировать предоплату
              </Button>
            </div>
          )}

          {!(order as any).isArchived && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setArchiveModalOpen(true)}
                disabled={archiveOrder.isPending}
              >
                {archiveOrder.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                В архив
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status History */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            История статусов
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : !statusHistory || statusHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">История пуста</p>
          ) : (
            <div className="space-y-3">
              {statusHistory.map((h) => (
                <div key={h.id} className="flex flex-col gap-1 border-l-2 border-primary pl-3 py-1">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Badge className={cn('text-white text-xs', statusColors[h.fromStatus] || 'bg-gray-500')}>
                      {statusLabels[h.fromStatus] || h.fromStatus}
                    </Badge>
                    <span className="text-muted-foreground">→</span>
                    <Badge className={cn('text-white text-xs', statusColors[h.toStatus] || 'bg-gray-500')}>
                      {statusLabels[h.toStatus] || h.toStatus}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(h.createdAt).toLocaleString('ru-KZ')}
                    </span>
                  </div>
                  {h.comment && (
                    <p className="text-sm text-muted-foreground italic">{h.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm status change modal (for flow buttons) */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Смена статуса</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите изменить статус заказа с «{statusLabels[order.status]}» на «{statusLabels[confirmStatus]}»?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="comment">Комментарий (необязательно)</Label>
            <Textarea
              id="comment"
              value={confirmComment}
              onChange={(e) => setConfirmComment(e.target.value)}
              placeholder="Причина смены статуса..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={confirmStatusChange} disabled={updateStatus.isPending}>
              {updateStatus.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              Подтвердить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual status change modal (gear icon) */}
      <Dialog open={manualModalOpen} onOpenChange={setManualModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ручная смена статуса</DialogTitle>
            <DialogDescription>
              Выбор любого статуса сбросит историю изменений.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Статус</Label>
              <Select value={manualStatus} onValueChange={setManualStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  {allStatuses
                    .filter((s) => s !== 'ARCHIVED' && s !== order.status)
                    .map((s) => (
                      <SelectItem key={s} value={s}>
                        {statusLabels[s] || s}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="manual-comment">Комментарий (необязательно)</Label>
              <Textarea
                id="manual-comment"
                value={manualComment}
                onChange={(e) => setManualComment(e.target.value)}
                placeholder="Причина смены статуса..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManualModalOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={confirmManualChange}
              disabled={updateStatus.isPending || !manualStatus}
              variant="destructive"
            >
              {updateStatus.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              Сменить статус
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive confirmation modal */}
      <Dialog open={archiveModalOpen} onOpenChange={setArchiveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Архивирование заказа</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите переместить заказ {order.orderNumber} в архив?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveModalOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={() => {
                archiveOrder.mutate(order.id, {
                  onSuccess: () => setArchiveModalOpen(false),
                });
              }}
              disabled={archiveOrder.isPending}
              variant="secondary"
            >
              {archiveOrder.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              В архив
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
