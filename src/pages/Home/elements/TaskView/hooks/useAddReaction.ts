import { useMutation, useQueryClient } from '@tanstack/react-query';

import { commentReactionsApi } from 'services/api';
import { IAddCommentReactionPayload } from 'services/api/endpoints/comment-reactions';
import { QueryKey } from 'enums/QueryKey.enum';
import { IReaction } from 'types/Reaction';
import { ITask } from 'types/Task';
import { IUser } from 'types/User';

export const useAddReaction = (
  taskId: number,
  commentId: number,
  profile?: Pick<IUser, 'id' | 'firstName' | 'lastName'>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IAddCommentReactionPayload) =>
      commentReactionsApi.add(commentId, data),
    onSuccess: (data: IReaction) => {
      queryClient.setQueryData<ITask>([QueryKey.TASKS, taskId], (oldTask) => {
        if (!oldTask) return oldTask;

        return {
          ...oldTask,
          comments: oldTask.comments?.map((c) => {
            if (c.id === commentId) {
              const hasReaction = c.reactions?.find(
                (reaction) => reaction.reaction === data.reaction,
              );

              if (!hasReaction) {
                if (!profile) {
                  return c;
                }

                return {
                  ...c,
                  reactions: [
                    ...(c.reactions ?? []),
                    {
                      ...data,
                      users: [
                        ...(data.users ?? []),
                        {
                          id: profile?.id,
                          firstName: profile?.firstName,
                          lastName: profile?.lastName,
                        },
                      ],
                    },
                  ],
                };
              }

              if (!profile) {
                return c;
              }

              return {
                ...c,
                reactions: [
                  ...(c.reactions || []).map((reaction) => {
                    if (reaction.reaction !== data.reaction) {
                      return reaction;
                    }

                    return {
                      ...reaction,
                      qty: reaction.qty + 1,
                      users: [
                        ...(reaction.users ?? []),
                        {
                          id: profile?.id,
                          firstName: profile?.firstName,
                          lastName: profile?.lastName,
                        },
                      ],
                    };
                  }),
                ],
              };
            }

            return c;
          }),
        };
      });
    },
  });
};
