import { api } from '@/shared/api';

export interface CharacteristicDefinition {
  id: string;
  name: string;
  key: string;
  valueType: string;
  unit?: string;
  entityType: string;
}

export const characteristicsApi = {
  getAll: async (): Promise<CharacteristicDefinition[]> => {
    const { data } = await api.get('/admin/characteristics');
    return data;
  },
};
