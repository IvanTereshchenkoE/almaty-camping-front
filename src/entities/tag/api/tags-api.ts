import { api } from '@/shared/api';

export interface Tag {
  id: string;
  name: string;
}

export const tagsApi = {
  getAll: async (): Promise<Tag[]> => {
    const { data } = await api.get('/admin/tags');
    return data;
  },
};
