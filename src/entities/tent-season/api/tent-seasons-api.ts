import { api } from '@/shared/api';

export interface TentSeason {
  id: string;
  name: string;
}

export const tentSeasonsApi = {
  getAll: async (): Promise<TentSeason[]> => {
    const { data } = await api.get('/tent-seasons');
    return data;
  },
  create: async (dto: { name: string }): Promise<TentSeason> => {
    const { data } = await api.post('/admin/tent-seasons', dto);
    return data;
  },
  update: async (id: string, dto: { name: string }): Promise<TentSeason> => {
    const { data } = await api.patch(`/admin/tent-seasons/${id}`, dto);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/tent-seasons/${id}`);
  },
};
