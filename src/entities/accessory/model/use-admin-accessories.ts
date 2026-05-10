import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminAccessoriesApi } from '@/entities/accessory/api/admin-accessories-api';

export const useAdminAccessories = () => {
  return useQuery({
    queryKey: ['admin-accessories'],
    queryFn: () => adminAccessoriesApi.getAll(),
  });
};

export const useAdminAccessory = (id: string) => {
  return useQuery({
    queryKey: ['admin-accessory', id],
    queryFn: () => adminAccessoriesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateAccessory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: any) => adminAccessoriesApi.create(dto),
    onSuccess: () => {
      toast.success('Аксессуар добавлен');
      qc.invalidateQueries({ queryKey: ['admin-accessories'] });
    },
    onError: () => {
      toast.error('Не удалось добавить аксессуар');
    },
  });
};

export const useUpdateAccessory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => adminAccessoriesApi.update(id, dto),
    onSuccess: (_, vars) => {
      toast.success('Аксессуар обновлен');
      qc.invalidateQueries({ queryKey: ['admin-accessories'] });
      qc.invalidateQueries({ queryKey: ['admin-accessory', vars.id] });
    },
    onError: () => {
      toast.error('Не удалось обновить аксессуар');
    },
  });
};

export const useDeleteAccessory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminAccessoriesApi.delete(id),
    onSuccess: () => {
      toast.success('Аксессуар удален');
      qc.invalidateQueries({ queryKey: ['admin-accessories'] });
    },
    onError: () => {
      toast.error('Не удалось удалить аксессуар');
    },
  });
};
