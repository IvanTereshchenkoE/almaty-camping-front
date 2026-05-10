import { useQuery } from '@tanstack/react-query';
import { tentsApi, type TentsFilters } from '../api';

export const useTents = (filters?: TentsFilters) => {
  return useQuery({
    queryKey: ['tents', filters],
    queryFn: () => tentsApi.getAll(filters),
  });
};

export const useTent = (id: string) => {
  return useQuery({
    queryKey: ['tent', id],
    queryFn: () => tentsApi.getById(id),
    enabled: !!id,
  });
};
