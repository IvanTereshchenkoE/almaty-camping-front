import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tentTypesApi } from '@/entities/tent-type/api/tent-types-api';

export const useTentTypes = () => {
  return useQuery({ queryKey: ['tent-types'], queryFn: () => tentTypesApi.getAll() });
};

export const useCreateTentType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { name: string }) => tentTypesApi.create(dto),
    onSuccess: () => {
      toast.success('Тип добавлен');
      qc.invalidateQueries({ queryKey: ['tent-types'] });
    },
    onError: () => {
      toast.error('Не удалось добавить тип');
    },
  });
};

export const useUpdateTentType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: { name: string } }) => tentTypesApi.update(id, dto),
    onSuccess: () => {
      toast.success('Тип обновлен');
      qc.invalidateQueries({ queryKey: ['tent-types'] });
    },
    onError: () => {
      toast.error('Не удалось обновить тип');
    },
  });
};

export const useDeleteTentType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tentTypesApi.delete(id),
    onSuccess: () => {
      toast.success('Тип удален');
      qc.invalidateQueries({ queryKey: ['tent-types'] });
    },
    onError: () => {
      toast.error('Не удалось удалить тип');
    },
  });
};
