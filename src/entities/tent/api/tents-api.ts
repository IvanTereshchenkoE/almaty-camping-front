import { api } from '@/shared/api';
import type { Tent } from '@/shared/types';

export interface TentsFilters {
  minPrice?: number;
  maxPrice?: number;
  capacity?: number[];
  season?: string[];
  type?: string[];
  maxWeight?: number;
  brand?: string[];
  startDate?: string;
  endDate?: string;
}

export const tentsApi = {
  getAll: async (filters?: TentsFilters): Promise<Tent[]> => {
    const params = new URLSearchParams();
    if (filters?.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
    if (filters?.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));
    filters?.capacity?.forEach((v) => params.append('capacity', String(v)));
    filters?.season?.forEach((v) => params.append('season', v));
    filters?.type?.forEach((v) => params.append('type', v));
    if (filters?.maxWeight !== undefined) params.append('maxWeight', String(filters.maxWeight));
    filters?.brand?.forEach((v) => params.append('brand', v));
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const { data } = await api.get<Tent[]>(`/tents?${params.toString()}`);
    return data;
  },
  getById: async (id: string): Promise<Tent> => {
    const { data } = await api.get<Tent>(`/tents/${id}`);
    return data;
  },
};
