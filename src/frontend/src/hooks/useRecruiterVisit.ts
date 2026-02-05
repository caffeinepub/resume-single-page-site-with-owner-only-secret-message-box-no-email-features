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

export function useGetRecruiterVisits(password: string) {
  const { actor, isFetching } = useActor();

  return useQuery<RecruiterVisit[]>({
    queryKey: ['recruiterVisits', password],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRecruiterVisits(password);
    },
    enabled: !!actor && !isFetching && !!password,
    retry: false,
  });
}

export function useClearRecruiterVisits() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearRecruiterVisits(password);
    },
    onSuccess: () => {
      // Invalidate all recruiter visit queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['recruiterVisits'] });
    },
  });
}
