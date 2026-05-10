import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tentSeasonsApi } from '@/entities/tent-season/api/tent-seasons-api';

export const useTentSeasons = () => {
  return useQuery({ queryKey: ['tent-seasons'], queryFn: () => tentSeasonsApi.getAll() });
};

export const useCreateTentSeason = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { name: string }) => tentSeasonsApi.create(dto),
    onSuccess: () => {
      toast.success('Сезон добавлен');
      qc.invalidateQueries({ queryKey: ['tent-seasons'] });
    },
    onError: () => {
      toast.error('Не удалось добавить сезон');
    },
  });
};

export const useUpdateTentSeason = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: { name: string } }) => tentSeasonsApi.update(id, dto),
    onSuccess: () => {
      toast.success('Сезон обновлен');
      qc.invalidateQueries({ queryKey: ['tent-seasons'] });
    },
    onError: () => {
      toast.error('Не удалось обновить сезон');
    },
  });
};

export const useDeleteTentSeason = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tentSeasonsApi.delete(id),
    onSuccess: () => {
      toast.success('Сезон удален');
      qc.invalidateQueries({ queryKey: ['tent-seasons'] });
    },
    onError: () => {
      toast.error('Не удалось удалить сезон');
    },
  });
};
