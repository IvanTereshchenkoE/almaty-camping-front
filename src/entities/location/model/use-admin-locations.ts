import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminLocationsApi } from '../api/admin-locations-api';

export const useAdminLocations = () => {
  return useQuery({
    queryKey: ['admin-locations'],
    queryFn: () => adminLocationsApi.getAll(),
  });
};

export const useAdminLocation = (id: string) => {
  return useQuery({
    queryKey: ['admin-location', id],
    queryFn: () => adminLocationsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: any) => adminLocationsApi.create(dto),
    onSuccess: () => {
      toast.success('Локация создана');
      qc.invalidateQueries({ queryKey: ['locations'] });
      qc.invalidateQueries({ queryKey: ['admin-locations'] });
    },
    onError: () => {
      toast.error('Не удалось создать локацию');
    },
  });
};

export const useUpdateLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => adminLocationsApi.update(id, dto),
    onSuccess: (_, vars) => {
      toast.success('Локация обновлена');
      qc.invalidateQueries({ queryKey: ['locations'] });
      qc.invalidateQueries({ queryKey: ['admin-locations'] });
      qc.invalidateQueries({ queryKey: ['admin-location', vars.id] });
    },
    onError: () => {
      toast.error('Не удалось обновить локацию');
    },
  });
};

export const useDeleteLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminLocationsApi.delete(id),
    onSuccess: () => {
      toast.success('Локация удалена');
      qc.invalidateQueries({ queryKey: ['locations'] });
      qc.invalidateQueries({ queryKey: ['admin-locations'] });
    },
    onError: () => {
      toast.error('Не удалось удалить локацию');
    },
  });
};
