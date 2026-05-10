import { useQuery } from '@tanstack/react-query';
import { locationsApi } from '../api';

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: () => locationsApi.getAll(),
  });
};
