import { api } from '@/shared/api';

export interface AccessorySeason {
  id: string;
  name: string;
}

export const accessorySeasonsApi = {
  getAll: async (): Promise<AccessorySeason[]> => {
    const { data } = await api.get('/admin/accessory-seasons');
    return data;
  },
  create: async (dto: { name: string }): Promise<AccessorySeason> => {
    const { data } = await api.post('/admin/accessory-seasons', dto);
    return data;
  },
  update: async (id: string, dto: { name: string }): Promise<AccessorySeason> => {
    const { data } = await api.patch(`/admin/accessory-seasons/${id}`, dto);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/accessory-seasons/${id}`);
  },
};
