import { api } from '@/shared/api';

export interface TentTypeDict {
  id: string;
  name: string;
}

export const tentTypesApi = {
  getAll: async (): Promise<TentTypeDict[]> => {
    const { data } = await api.get('/tent-types');
    return data;
  },
  create: async (dto: { name: string }): Promise<TentTypeDict> => {
    const { data } = await api.post('/admin/tent-types', dto);
    return data;
  },
  update: async (id: string, dto: { name: string }): Promise<TentTypeDict> => {
    const { data } = await api.patch(`/admin/tent-types/${id}`, dto);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/tent-types/${id}`);
  },
};
