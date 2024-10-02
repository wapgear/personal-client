import { useQuery } from '@tanstack/react-query';
import { getWalletFn } from '../api';

export const useGetOrFetchComment = (walletId: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['wallet', walletId],
    queryFn: getWalletFn,
    retry: (failureCount, error) => {
      if ((error as any).status === 404 || !('status' in error)) return false;
      return failureCount < 3;
    },
  });
  const comments = data?.comments || [];

  return {
    comments,
    error,
    isLoading,
  };
};
