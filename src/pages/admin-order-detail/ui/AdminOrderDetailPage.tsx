import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { statusColors, transitions, allStatuses } from '@/shared/config/order-status';
import { Loader2, ArrowLeft, Clock, Settings } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/lib/cn';

export const AdminOrderDetailPage = () => {
  const { t } = useTranslation('admin');
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
        <h2 className="text-2xl font-bold mb-4">{t('orderDetail.notFound')}</h2>
        <Button onClick={() => navigate(-1)}>{t('orderDetail.back')}</Button>
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
        {t('orderDetail.back')}
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">{order.orderNumber}</h2>
        <div className="flex items-center gap-2">
          {(order as any).isArchived && (
            <Badge variant="secondary">{t('orderDetail.archiveBadge')}</Badge>
          )}
          <Badge className={cn('text-white', statusColors[order.status] || 'bg-gray-500')}>
            {t(`orders.status.${order.status}`) || order.status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('orderDetail.client')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">{t('orderDetail.name')}</span> {order.clientName}</p>
            <p><span className="text-muted-foreground">{t('orderDetail.phone')}</span> {order.phone}</p>
            {order.telegram && <p><span className="text-muted-foreground">{t('orderDetail.telegram')}</span> {order.telegram}</p>}
            {order.whatsapp && <p><span className="text-muted-foreground">{t('orderDetail.whatsapp')}</span> {order.whatsapp}</p>}
            {order.email && <p><span className="text-muted-foreground">{t('orderDetail.email')}</span> {order.email}</p>}
            {order.comment && <p><span className="text-muted-foreground">{t('orderDetail.comment')}</span> {order.comment}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('orderDetail.rental')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">{t('orderDetail.dates')}</span> {new Date(order.startDate).toLocaleDateString()} — {new Date(order.endDate).toLocaleDateString()}</p>
            <p><span className="text-muted-foreground">{t('orderDetail.days')}</span> {order.rentalDays}</p>
            <p><span className="text-muted-foreground">{t('orderDetail.sum')}</span> <span className="font-medium">{order.totalAmount.toLocaleString()} ₸</span></p>
            <p><span className="text-muted-foreground">{t('orderDetail.prepayment')}</span> <span className="font-medium">{order.prepaymentAmount.toLocaleString()} ₸</span></p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('orderDetail.items')}</CardTitle>
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
            <span>{t('orderDetail.total')}</span>
            <span>{order.totalAmount.toLocaleString()} ₸</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('orderDetail.statusControl')}</CardTitle>
          <Button variant="ghost" size="icon" onClick={openManualModal} title={t('orderDetail.manualChange')}>
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
                  {t(`orders.status.${s}`) || s}
                </Button>
              ))}
            </div>
          )}

          {order.status === 'CONFIRMED' && (
            <div className="flex flex-wrap items-end gap-2">
              <div className="space-y-2">
                <Label htmlFor="prepay">{t('orderDetail.prepaymentAmount')}</Label>
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
                {t('orderDetail.recordPrepayment')}
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
                {t('orderDetail.toArchive')}
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
            {t('orderDetail.statusHistory')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : !statusHistory || statusHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('orderDetail.historyEmpty')}</p>
          ) : (
            <div className="space-y-3">
              {statusHistory.map((h) => (
                <div key={h.id} className="flex flex-col gap-1 border-l-2 border-primary pl-3 py-1">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Badge className={cn('text-white text-xs', statusColors[h.fromStatus] || 'bg-gray-500')}>
                      {t(`orders.status.${h.fromStatus}`) || h.fromStatus}
                    </Badge>
                    <span className="text-muted-foreground">→</span>
                    <Badge className={cn('text-white text-xs', statusColors[h.toStatus] || 'bg-gray-500')}>
                      {t(`orders.status.${h.toStatus}`) || h.toStatus}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(h.createdAt).toLocaleString()}
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
            <DialogTitle>{t('orderDetail.modal.changeStatus')}</DialogTitle>
            <DialogDescription>
              {t('orderDetail.modal.changeStatusDesc', {
                from: t(`orders.status.${order.status}`),
                to: t(`orders.status.${confirmStatus}`),
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="comment">{t('orderDetail.modal.commentOptional')}</Label>
            <Textarea
              id="comment"
              value={confirmComment}
              onChange={(e) => setConfirmComment(e.target.value)}
              placeholder={t('orderDetail.modal.reasonPlaceholder')}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>
              {t('orderDetail.modal.cancel')}
            </Button>
            <Button onClick={confirmStatusChange} disabled={updateStatus.isPending}>
              {updateStatus.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              {t('orderDetail.modal.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual status change modal (gear icon) */}
      <Dialog open={manualModalOpen} onOpenChange={setManualModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('orderDetail.modal.manualChangeTitle')}</DialogTitle>
            <DialogDescription>
              {t('orderDetail.modal.manualChangeDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('orderDetail.modal.status')}</Label>
              <Select value={manualStatus} onValueChange={setManualStatus}>
                <SelectTrigger>
                  <SelectValue placeholder={t('orderDetail.modal.selectStatus')} />
                </SelectTrigger>
                <SelectContent>
                  {allStatuses
                    .filter((s) => s !== 'ARCHIVED' && s !== order.status)
                    .map((s) => (
                      <SelectItem key={s} value={s}>
                        {t(`orders.status.${s}`) || s}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="manual-comment">{t('orderDetail.modal.commentOptional')}</Label>
              <Textarea
                id="manual-comment"
                value={manualComment}
                onChange={(e) => setManualComment(e.target.value)}
                placeholder={t('orderDetail.modal.reasonPlaceholder')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManualModalOpen(false)}>
              {t('orderDetail.modal.cancel')}
            </Button>
            <Button
              onClick={confirmManualChange}
              disabled={updateStatus.isPending || !manualStatus}
              variant="destructive"
            >
              {updateStatus.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              {t('orderDetail.modal.changeStatusBtn')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive confirmation modal */}
      <Dialog open={archiveModalOpen} onOpenChange={setArchiveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('orderDetail.modal.archiveTitle')}</DialogTitle>
            <DialogDescription>
              {t('orderDetail.modal.archiveDesc', { number: order.orderNumber })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveModalOpen(false)}>
              {t('orderDetail.modal.cancel')}
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
              {t('orderDetail.modal.archiveBtn')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
