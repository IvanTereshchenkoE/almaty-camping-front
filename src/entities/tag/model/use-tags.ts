import { useQuery } from '@tanstack/react-query';
import { tagsApi } from '@/entities/tag/api/tags-api';

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.getAll(),
  });
};
