import { api } from '@/shared/api';

export interface AdminAccessory {
  id: string;
  name: string;
  categoryId: string;
  dailyPrice: number;
  description: string;
  shortDescription: string;
  mainImage: string;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  units: { id: string; inventoryCode: string; status: string; conditionComment?: string }[];
  tags: { tagId: string; tag: { id: string; name: string } }[];
  category?: { id: string; name: string };
}

export const adminAccessoriesApi = {
  getAll: async (): Promise<AdminAccessory[]> => {
    const { data } = await api.get('/admin/accessories');
    return data;
  },
  getById: async (id: string): Promise<AdminAccessory> => {
    const { data } = await api.get(`/admin/accessories/${id}`);
    return data;
  },
  create: async (dto: any): Promise<AdminAccessory> => {
    const { data } = await api.post('/admin/accessories', dto);
    return data;
  },
  update: async (id: string, dto: any): Promise<AdminAccessory> => {
    const { data } = await api.patch(`/admin/accessories/${id}`, dto);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/accessories/${id}`);
  },
};
