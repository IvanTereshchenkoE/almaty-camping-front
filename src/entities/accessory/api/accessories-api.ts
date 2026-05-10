import { api } from '@/shared/api';

export const accessoriesApi = {
  getAvailable: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const { data } = await api.get(`/accessories/available?${params.toString()}`);
    return data;
  },
};
