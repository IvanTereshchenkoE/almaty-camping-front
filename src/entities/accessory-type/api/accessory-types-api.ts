import { api } from '@/shared/api';

export interface AccessoryTypeDict {
  id: string;
  name: string;
}

export const accessoryTypesApi = {
  getAll: async (): Promise<AccessoryTypeDict[]> => {
    const { data } = await api.get('/admin/accessory-types');
    return data;
  },
  create: async (dto: { name: string }): Promise<AccessoryTypeDict> => {
    const { data } = await api.post('/admin/accessory-types', dto);
    return data;
  },
  update: async (id: string, dto: { name: string }): Promise<AccessoryTypeDict> => {
    const { data } = await api.patch(`/admin/accessory-types/${id}`, dto);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/accessory-types/${id}`);
  },
};
