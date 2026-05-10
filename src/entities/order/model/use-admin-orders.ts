import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminOrdersApi } from '@/entities/order/api/admin-orders-api';

export const useAdminOrders = (status?: string) => {
  return useQuery({
    queryKey: ['admin-orders', status],
    queryFn: () => adminOrdersApi.getAll(status),
  });
};

export const useAdminOrder = (id: string) => {
  return useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => adminOrdersApi.getById(id),
    enabled: !!id,
  });
};

export const useOrderStatusHistory = (id: string) => {
  return useQuery({
    queryKey: ['order-status-history', id],
    queryFn: () => adminOrdersApi.getStatusHistory(id),
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, comment, resetHistory }: { id: string; status: string; comment?: string; resetHistory?: boolean }) =>
      adminOrdersApi.updateStatus(id, status, comment, resetHistory),
    onSuccess: (_, vars) => {
      toast.success('Статус заказа обновлен');
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      qc.invalidateQueries({ queryKey: ['admin-order', vars.id] });
      qc.invalidateQueries({ queryKey: ['order-status-history', vars.id] });
    },
    onError: () => {
      toast.error('Не удалось обновить статус заказа');
    },
  });
};

export const useUpdateOrderPrepayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) => adminOrdersApi.updatePrepayment(id, amount),
    onSuccess: (_, vars) => {
      toast.success('Предоплата зафиксирована');
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      qc.invalidateQueries({ queryKey: ['admin-order', vars.id] });
    },
    onError: () => {
      toast.error('Не удалось зафиксировать предоплату');
    },
  });
};

export const useArchiveOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminOrdersApi.archiveOrder(id),
    onSuccess: (_, id) => {
      toast.success('Заказ перемещен в архив');
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      qc.invalidateQueries({ queryKey: ['admin-order', id] });
    },
    onError: () => {
      toast.error('Не удалось переместить заказ в архив');
    },
  });
};

export const useArchiveOldOrders = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => adminOrdersApi.archiveOld(),
    onSuccess: () => {
      toast.success('Старые заказы архивированы');
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: () => {
      toast.error('Не удалось архивировать старые заказы');
    },
  });
};

export const useAnalytics = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['analytics', startDate, endDate],
    queryFn: () => adminOrdersApi.getAnalytics(startDate, endDate),
    enabled: true,
  });
};
