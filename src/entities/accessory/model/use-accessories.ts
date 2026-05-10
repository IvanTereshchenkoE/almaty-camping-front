import { useQuery } from '@tanstack/react-query';
import { accessoriesApi } from '@/entities/accessory/api/accessories-api';

export const useAvailableAccessories = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['accessories', startDate, endDate],
    queryFn: () => accessoriesApi.getAvailable(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};
