import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Question, QuestionUpdateArgs, QuestionType } from '../backend';

export function useQuestions() {
  const { actor, isFetching } = useActor();

  return useQuery<Question[]>({
    queryKey: ['questions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllQuestions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useQuestionsByChapter(chapter: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Question[]>({
    queryKey: ['questions', 'chapter', chapter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuestionsByChapter(BigInt(chapter));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useQuestionsByType(qType: QuestionType) {
  const { actor, isFetching } = useActor();

  return useQuery<Question[]>({
    queryKey: ['questions', 'type', qType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuestionsByType(qType);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: QuestionUpdateArgs) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addQuestion(args);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useUpdateQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, args }: { id: string; args: QuestionUpdateArgs }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateQuestion(id, args);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useDeleteQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteQuestion(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}
