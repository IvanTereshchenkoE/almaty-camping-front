import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ordersApi, type CreateOrderPayload } from '@/entities/order/api/orders-api';

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (data: CreateOrderPayload) => ordersApi.create(data),
    onSuccess: () => {
      toast.success('Заказ успешно создан');
    },
    onError: () => {
      toast.error('Не удалось создать заказ');
    },
  });
};

export const useOrderById = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
};
