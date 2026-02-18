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
      queryClient.invalidateQueries({ queryKey: ['visitorMessages'] });
    },
  });
}

export function useGetVisitorMessages(ownerPassword: string) {
  const { actor, isFetching } = useActor();

  return useQuery<VisitorMessage[]>({
    queryKey: ['visitorMessages', ownerPassword],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getVisitorMessagesWithPassword(ownerPassword);
    },
    enabled: !!actor && !isFetching && !!ownerPassword,
    retry: false,
  });
}

export function useClearVisitorMessages(ownerPassword: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearVisitorMessagesWithPassword(ownerPassword);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitorMessages'] });
    },
  });
}
