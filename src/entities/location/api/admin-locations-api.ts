import { api } from '@/shared/api';
import type { Location } from '@/shared/types';

export interface AdminLocation extends Location {}

export const adminLocationsApi = {
  getAll: async (): Promise<AdminLocation[]> => {
    const { data } = await api.get('/admin/locations');
    return data;
  },
  getById: async (id: string): Promise<AdminLocation> => {
    const { data } = await api.get(`/admin/locations/${id}`);
    return data;
  },
  create: async (dto: any): Promise<AdminLocation> => {
    const { data } = await api.post('/admin/locations', dto);
    return data;
  },
  update: async (id: string, dto: any): Promise<AdminLocation> => {
    const { data } = await api.patch(`/admin/locations/${id}`, dto);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/locations/${id}`);
  },
};
