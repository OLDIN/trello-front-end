import { useMutation, useQueryClient } from '@tanstack/react-query';

import { commentReactionsApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';
import { ITask } from 'types/Task';

export const useRemoveReaction = (
  userId: number,
  taskId: number,
  commentId: number,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reactionId: number) =>
      commentReactionsApi.delete(commentId, reactionId),
    onSuccess: (_, reactionId) => {
      queryClient.setQueryData<ITask>([QueryKey.TASKS, taskId], (oldTask) => {
        if (!oldTask) return oldTask;

        return {
          ...oldTask,
          comments: (oldTask?.comments ?? []).map((c) => {
            if (c.id === commentId) {
              const reaction = c.reactions?.find(
                (reaction) => reaction.id === reactionId,
              );

              if (!reaction) return c;

              const isLastUser = reaction.users?.length === 1;

              if (isLastUser) {
                return {
                  ...c,
                  reactions: c.reactions?.filter((r) => r.id !== reactionId),
                };
              }

              return {
                ...c,
                reactions: c.reactions?.map((r) => {
                  if (r.id === reactionId) {
                    return {
                      ...r,
                      qty: r.qty - 1,
                      users: r.users?.filter((u) => u.id !== userId),
                    };
                  }

                  return r;
                }),
              };
            }

            return c;
          }),
        };
      });
    },
  });
};
