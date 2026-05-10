import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { accessoryCategoriesApi } from '@/entities/accessory-category/api/accessory-categories-api';

export const useAccessoryCategories = () => {
  return useQuery({
    queryKey: ['accessory-categories'],
    queryFn: () => accessoryCategoriesApi.getAll(),
  });
};

export const useCreateAccessoryCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { name: string; slug: string; description?: string }) => accessoryCategoriesApi.create(dto),
    onSuccess: () => {
      toast.success('Категория добавлена');
      qc.invalidateQueries({ queryKey: ['accessory-categories'] });
    },
    onError: () => {
      toast.error('Не удалось добавить категорию');
    },
  });
};

export const useDeleteAccessoryCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accessoryCategoriesApi.delete(id),
    onSuccess: () => {
      toast.success('Категория удалена');
      qc.invalidateQueries({ queryKey: ['accessory-categories'] });
    },
    onError: () => {
      toast.error('Не удалось удалить категорию');
    },
  });
};
