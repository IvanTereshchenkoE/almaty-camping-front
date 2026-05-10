import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/entities/user/api/users-api';

export const useUsers = () => {
  return useQuery({ queryKey: ['users'], queryFn: () => usersApi.getAll() });
};
