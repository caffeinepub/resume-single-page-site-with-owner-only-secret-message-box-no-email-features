import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Note: Secret message functionality is currently not available in the backend
// These hooks return empty data until backend support is restored

export function useSecretMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['secretMessages'],
    queryFn: async () => {
      // Backend doesn't currently support secret messages
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSecretMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, author }: { content: string; author: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't currently support secret messages
      throw new Error('Secret message feature is temporarily unavailable');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secretMessages'] });
    },
  });
}

// Skills management hooks
export function useGetSkills() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['skills'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSkills();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSkill(ownerPassword: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skill: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSkillWithPassword(ownerPassword, skill);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

export function useRemoveSkill(ownerPassword: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skill: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeSkillWithPassword(ownerPassword, skill);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

export function useClearSkills(ownerPassword: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearSkillsWithPassword(ownerPassword);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}
