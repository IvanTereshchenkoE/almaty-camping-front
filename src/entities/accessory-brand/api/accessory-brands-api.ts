import { api } from '@/shared/api';

export interface AccessoryBrand {
  id: string;
  name: string;
}

export const accessoryBrandsApi = {
  getAll: async (): Promise<AccessoryBrand[]> => {
    const { data } = await api.get('/admin/accessory-brands');
    return data;
  },
  create: async (dto: { name: string }): Promise<AccessoryBrand> => {
    const { data } = await api.post('/admin/accessory-brands', dto);
    return data;
  },
  update: async (id: string, dto: { name: string }): Promise<AccessoryBrand> => {
    const { data } = await api.patch(`/admin/accessory-brands/${id}`, dto);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/accessory-brands/${id}`);
  },
};
