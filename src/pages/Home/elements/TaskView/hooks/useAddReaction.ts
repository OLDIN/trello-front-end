import {
  DefaultError,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { commentReactionsApi } from 'services/api';
import { IAddCommentReactionPayload } from 'services/api/endpoints/comment-reactions';
import { QueryKey } from 'enums/QueryKey.enum';
import { IReaction } from 'types/Reaction';
import { ITask } from 'types/Task';
import { IUser } from 'types/User';

interface IUseAddReactionProps {
  taskId: number;
  commentId: number;
  profile?: Pick<IUser, 'id' | 'firstName' | 'lastName'>;
  onSuccess?: (
    data: IReaction,
    variables: IAddCommentReactionPayload,
    context: void,
  ) => Promise<unknown> | unknown;
}

export const useAddReaction = ({
  taskId,
  commentId,
  profile,
  onSuccess,
}: IUseAddReactionProps) => {
  const queryClient = useQueryClient();

  return useMutation<IReaction, DefaultError, IAddCommentReactionPayload>({
    mutationFn: (data: IAddCommentReactionPayload) =>
      commentReactionsApi.add(commentId, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData<ITask>(
        [QueryKey.GET_TASK_BY_ID, taskId],
        (oldTask) => {
          if (!oldTask) return oldTask;

          return {
            ...oldTask,
            comments: oldTask.comments?.map((c) => {
              if (c.id === commentId) {
                const hasReaction = c.reactions?.find(
                  (reaction) => reaction.reaction === response.reaction,
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
                        ...response,
                        users: [
                          ...(response.users ?? []),
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
                      if (reaction.reaction !== response.reaction) {
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
        },
      );

      onSuccess?.(response, variables);
    },
  });
};
