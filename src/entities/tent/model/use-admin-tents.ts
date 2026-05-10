import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminTentsApi } from '@/entities/tent/api/admin-tents-api';

export const useAdminTents = () => {
  return useQuery({
    queryKey: ['admin-tents'],
    queryFn: () => adminTentsApi.getAll(),
  });
};

export const useAdminTent = (id: string) => {
  return useQuery({
    queryKey: ['admin-tent', id],
    queryFn: () => adminTentsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateTent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: any) => adminTentsApi.create(dto),
    onSuccess: () => {
      toast.success('Палатка добавлена');
      qc.invalidateQueries({ queryKey: ['admin-tents'] });
    },
    onError: () => {
      toast.error('Не удалось добавить палатку');
    },
  });
};

export const useUpdateTent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => adminTentsApi.update(id, dto),
    onSuccess: (_, vars) => {
      toast.success('Палатка обновлена');
      qc.invalidateQueries({ queryKey: ['admin-tents'] });
      qc.invalidateQueries({ queryKey: ['admin-tent', vars.id] });
    },
    onError: () => {
      toast.error('Не удалось обновить палатку');
    },
  });
};

export const useDeleteTent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminTentsApi.delete(id),
    onSuccess: () => {
      toast.success('Палатка удалена');
      qc.invalidateQueries({ queryKey: ['admin-tents'] });
    },
    onError: () => {
      toast.error('Не удалось удалить палатку');
    },
  });
};
