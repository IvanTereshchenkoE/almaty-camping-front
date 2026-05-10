import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { accessoryTypesApi } from '@/entities/accessory-type/api/accessory-types-api';

export const useAccessoryTypes = () => {
  return useQuery({ queryKey: ['accessory-types'], queryFn: () => accessoryTypesApi.getAll() });
};

export const useCreateAccessoryType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { name: string }) => accessoryTypesApi.create(dto),
    onSuccess: () => {
      toast.success('Тип добавлен');
      qc.invalidateQueries({ queryKey: ['accessory-types'] });
    },
    onError: () => {
      toast.error('Не удалось добавить тип');
    },
  });
};

export const useUpdateAccessoryType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: { name: string } }) => accessoryTypesApi.update(id, dto),
    onSuccess: () => {
      toast.success('Тип обновлен');
      qc.invalidateQueries({ queryKey: ['accessory-types'] });
    },
    onError: () => {
      toast.error('Не удалось обновить тип');
    },
  });
};

export const useDeleteAccessoryType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accessoryTypesApi.delete(id),
    onSuccess: () => {
      toast.success('Тип удален');
      qc.invalidateQueries({ queryKey: ['accessory-types'] });
    },
    onError: () => {
      toast.error('Не удалось удалить тип');
    },
  });
};
