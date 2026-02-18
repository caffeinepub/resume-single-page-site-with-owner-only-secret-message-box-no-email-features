import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { RecruiterVisit } from '../backend';

export function useLogRecruiterVisit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ isRecruiter, companyName }: { isRecruiter: boolean; companyName: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logRecruiterVisit(isRecruiter, companyName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiterVisits'] });
    },
  });
}

export function useGetRecruiterVisits(ownerPassword: string) {
  const { actor, isFetching } = useActor();

  return useQuery<RecruiterVisit[]>({
    queryKey: ['recruiterVisits', ownerPassword],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRecruiterVisitsWithPassword(ownerPassword);
    },
    enabled: !!actor && !isFetching && !!ownerPassword,
    retry: false,
  });
}

export function useClearRecruiterVisits(ownerPassword: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearRecruiterVisitsWithPassword(ownerPassword);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiterVisits'] });
    },
  });
}
