import { useQuery } from '@tanstack/react-query';
import { characteristicsApi } from '@/entities/characteristic/api/characteristics-api';

export const useCharacteristics = () => {
  return useQuery({
    queryKey: ['characteristics'],
    queryFn: () => characteristicsApi.getAll(),
  });
};
