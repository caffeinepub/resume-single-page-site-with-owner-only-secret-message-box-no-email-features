import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { VisitorMessage } from '../backend';

export function useSubmitVisitorMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, email, message }: { name: string; email: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitVisitorMessage(name, email, message);
    },
    onSuccess: () => {
      // Invalidate all visitor message queries including password-scoped ones
      queryClient.invalidateQueries({ queryKey: ['visitorMessages'] });
    },
  });
}

export function useGetVisitorMessages(password: string) {
  const { actor, isFetching } = useActor();

  return useQuery<VisitorMessage[]>({
    queryKey: ['visitorMessages', password],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getVisitorMessages(password);
    },
    enabled: !!actor && !isFetching && !!password,
    retry: false,
  });
}

export function useClearVisitorMessages() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearVisitorMessages(password);
    },
    onSuccess: () => {
      // Invalidate all visitor message queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['visitorMessages'] });
    },
  });
}
