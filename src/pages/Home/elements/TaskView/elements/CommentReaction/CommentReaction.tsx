import React, { useMemo } from 'react';

import { IReaction } from 'types/Reaction';
import { IUser } from 'types/User';

import { useAddReaction } from '../../hooks/useAddReaction';
import { useRemoveReaction } from '../../hooks/useRemoveReaction';
import { ReactionWrapper } from './styles';

import { Icon, Tooltip } from '@mui/material';
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

  const { mutate: deleteReaction } = useRemoveReaction({
    userId,
    taskId,
    commentId,
  });
  const { mutate: AddReaction } = useAddReaction({
    taskId,
    commentId,
    profile: user,
  });

  const handleCLick = () => {
    if (isMyReaction) {
      deleteReaction(reaction.id);
    } else {
      AddReaction({ reaction: reaction.reaction });
    }
  };

  const tooltipTitle = useMemo(() => {
    const hasMe = reaction.users?.some((u) => u.id === userId);
    const users = reaction.users
      ?.filter((u) => u.id !== userId)
      .map((u) => `${u.firstName} ${u.lastName}`)
      .join(', ');

    if (hasMe && users?.length) {
      return `You and ${users} reacted with ${reaction.reaction}`;
    }

    if (hasMe && !users?.length) {
      return `You reacted with ${reaction.reaction}`;
    }

    return `${users} reacted with ${reaction.reaction}`;
  }, [reaction.reaction, reaction.users, userId]);

  return (
    <ReactionWrapper
      badgeContent={reaction.qty}
      className={isMyReaction ? 'my-reaction' : ''}
      onClick={handleCLick}
    >
      <Tooltip title={tooltipTitle}>
        <Icon>
          <Emoji unified={reaction.reaction} size={16} lazyLoad />
        </Icon>
      </Tooltip>
    </ReactionWrapper>
  );
}
