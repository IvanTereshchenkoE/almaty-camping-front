import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { accessoryBrandsApi } from '@/entities/accessory-brand/api/accessory-brands-api';

export const useAccessoryBrands = () => {
  return useQuery({ queryKey: ['accessory-brands'], queryFn: () => accessoryBrandsApi.getAll() });
};

export const useCreateAccessoryBrand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { name: string }) => accessoryBrandsApi.create(dto),
    onSuccess: () => {
      toast.success('Бренд добавлен');
      qc.invalidateQueries({ queryKey: ['accessory-brands'] });
    },
    onError: () => {
      toast.error('Не удалось добавить бренд');
    },
  });
};

export const useUpdateAccessoryBrand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: { name: string } }) => accessoryBrandsApi.update(id, dto),
    onSuccess: () => {
      toast.success('Бренд обновлен');
      qc.invalidateQueries({ queryKey: ['accessory-brands'] });
    },
    onError: () => {
      toast.error('Не удалось обновить бренд');
    },
  });
};

export const useDeleteAccessoryBrand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accessoryBrandsApi.delete(id),
    onSuccess: () => {
      toast.success('Бренд удален');
      qc.invalidateQueries({ queryKey: ['accessory-brands'] });
    },
    onError: () => {
      toast.error('Не удалось удалить бренд');
    },
  });
};
