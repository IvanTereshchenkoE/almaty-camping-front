import { api } from '@/shared/api';

export interface TentBrand {
  id: string;
  name: string;
}

export const tentBrandsApi = {
  getAll: async (): Promise<TentBrand[]> => {
    const { data } = await api.get('/tent-brands');
    return data;
  },
  create: async (dto: { name: string }): Promise<TentBrand> => {
    const { data } = await api.post('/admin/tent-brands', dto);
    return data;
  },
  update: async (id: string, dto: { name: string }): Promise<TentBrand> => {
    const { data } = await api.patch(`/admin/tent-brands/${id}`, dto);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/tent-brands/${id}`);
  },
};
