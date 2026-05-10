import { api } from '@/shared/api';

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get('/admin/users');
    return data;
  },
};
