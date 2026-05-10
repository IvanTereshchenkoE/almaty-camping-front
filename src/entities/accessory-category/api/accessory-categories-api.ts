import { api } from '@/shared/api';

export interface AccessoryCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export const accessoryCategoriesApi = {
  getAll: async (): Promise<AccessoryCategory[]> => {
    const { data } = await api.get('/admin/accessory-categories');
    return data;
  },
  create: async (dto: { name: string; slug: string; description?: string }): Promise<AccessoryCategory> => {
    const { data } = await api.post('/admin/accessory-categories', dto);
    return data;
  },
  update: async (id: string, dto: Partial<AccessoryCategory>): Promise<AccessoryCategory> => {
    const { data } = await api.patch(`/admin/accessory-categories/${id}`, dto);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/accessory-categories/${id}`);
  },
};
