import { api } from '@/shared/api';
import type { Tent } from '@/shared/types';

export interface AdminTent extends Tent {}

export const adminTentsApi = {
  getAll: async (): Promise<AdminTent[]> => {
    const { data } = await api.get('/admin/tents');
    return data;
  },
  getById: async (id: string): Promise<AdminTent> => {
    const { data } = await api.get(`/admin/tents/${id}`);
    return data;
  },
  create: async (dto: any): Promise<AdminTent> => {
    const { data } = await api.post('/admin/tents', dto);
    return data;
  },
  update: async (id: string, dto: any): Promise<AdminTent> => {
    const { data } = await api.patch(`/admin/tents/${id}`, dto);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/tents/${id}`);
  },
};
