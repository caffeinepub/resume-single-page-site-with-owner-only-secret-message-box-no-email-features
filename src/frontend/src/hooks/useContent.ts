import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Content } from '../backend';

export function useGetContent() {
  const { actor, isFetching } = useActor();

  return useQuery<Content>({
    queryKey: ['content'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: Content) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}
