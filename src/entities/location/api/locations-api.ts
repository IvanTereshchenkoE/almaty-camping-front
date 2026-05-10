import { api } from '@/shared/api';
import type { Location } from '@/shared/types';

export const locationsApi = {
  getAll: async (): Promise<Location[]> => {
    const { data } = await api.get<Location[]>('/locations');
    return data;
  },
  getById: async (id: string): Promise<Location> => {
    const { data } = await api.get<Location>(`/locations/${id}`);
    return data;
  },
};
