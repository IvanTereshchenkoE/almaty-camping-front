import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tentBrandsApi } from '@/entities/tent-brand/api/tent-brands-api';

export const useTentBrands = () => {
  return useQuery({ queryKey: ['tent-brands'], queryFn: () => tentBrandsApi.getAll() });
};

export const useCreateTentBrand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { name: string }) => tentBrandsApi.create(dto),
    onSuccess: () => {
      toast.success('Бренд добавлен');
      qc.invalidateQueries({ queryKey: ['tent-brands'] });
    },
    onError: () => {
      toast.error('Не удалось добавить бренд');
    },
  });
};

export const useUpdateTentBrand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: { name: string } }) => tentBrandsApi.update(id, dto),
    onSuccess: () => {
      toast.success('Бренд обновлен');
      qc.invalidateQueries({ queryKey: ['tent-brands'] });
    },
    onError: () => {
      toast.error('Не удалось обновить бренд');
    },
  });
};

export const useDeleteTentBrand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tentBrandsApi.delete(id),
    onSuccess: () => {
      toast.success('Бренд удален');
      qc.invalidateQueries({ queryKey: ['tent-brands'] });
    },
    onError: () => {
      toast.error('Не удалось удалить бренд');
    },
  });
};
