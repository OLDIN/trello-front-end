import React, { useMemo } from 'react';

import { IReaction } from 'types/Reaction';
import { IUser } from 'types/User';

import { useAddReaction } from '../../hooks/useAddReaction';
import { useRemoveReaction } from '../../hooks/useRemoveReaction';
import { ReactionWrapper } from './styles';

import { Icon } from '@mui/material';
import { Emoji } from 'emoji-picker-react';

interface CommentReactionProps {
  reaction: IReaction;
  userId: number;
  taskId: number;
  commentId: number;
  user?: Pick<IUser, 'id' | 'firstName' | 'lastName'>;
}

export function CommentReaction({
  reaction,
  userId,
  taskId,
  commentId,
  user,
}: CommentReactionProps) {
  const isMyReaction = useMemo(() => {
    return (reaction?.users ?? []).some((user) => user.id === userId);
  }, [userId, reaction?.users]);

  const { mutate: deleteReaction } = useRemoveReaction(
    userId,
    taskId,
    commentId,
  );
  const { mutate: AddReaction } = useAddReaction(taskId, commentId, user);

  const handleCLick = () => {
    console.log('handleCLick');

    if (isMyReaction) {
      deleteReaction(reaction.id);
    } else {
      AddReaction({ reaction: reaction.reaction });
    }
  };

  return (
    <ReactionWrapper
      badgeContent={reaction.qty}
      className={isMyReaction ? 'my-reaction' : ''}
      onClick={handleCLick}
    >
      <Icon>
        <Emoji unified={reaction.reaction} size={16} />
      </Icon>
    </ReactionWrapper>
  );
}
