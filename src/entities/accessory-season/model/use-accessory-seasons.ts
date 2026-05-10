import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { accessorySeasonsApi } from '@/entities/accessory-season/api/accessory-seasons-api';

export const useAccessorySeasons = () => {
  return useQuery({ queryKey: ['accessory-seasons'], queryFn: () => accessorySeasonsApi.getAll() });
};

export const useCreateAccessorySeason = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { name: string }) => accessorySeasonsApi.create(dto),
    onSuccess: () => {
      toast.success('Сезон добавлен');
      qc.invalidateQueries({ queryKey: ['accessory-seasons'] });
    },
    onError: () => {
      toast.error('Не удалось добавить сезон');
    },
  });
};

export const useUpdateAccessorySeason = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: { name: string } }) => accessorySeasonsApi.update(id, dto),
    onSuccess: () => {
      toast.success('Сезон обновлен');
      qc.invalidateQueries({ queryKey: ['accessory-seasons'] });
    },
    onError: () => {
      toast.error('Не удалось обновить сезон');
    },
  });
};

export const useDeleteAccessorySeason = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accessorySeasonsApi.delete(id),
    onSuccess: () => {
      toast.success('Сезон удален');
      qc.invalidateQueries({ queryKey: ['accessory-seasons'] });
    },
    onError: () => {
      toast.error('Не удалось удалить сезон');
    },
  });
};
