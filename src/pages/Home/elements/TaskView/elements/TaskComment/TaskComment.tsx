import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authApi, commentsApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';
import { ITask } from 'types/Task';

import { formatDate } from '../../../../../../utils/formatDate';
import type { TaskComment } from '../../../../../../types/TaskComment';
import {
  CommentActionButton,
  CommentAvatar,
  CommentBody,
  CommentDateTypography,
  CommentWrapper,
} from './styles';

import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import { CircularProgress, Grid, IconButton, Typography } from '@mui/material';

interface TaskCommentProps {
  comment: TaskComment;
  isHighlighted?: boolean;
}

export function TaskComment({
  comment,
  isHighlighted = false,
}: TaskCommentProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { hash, pathname } = useLocation();

  const { data: profile } = useQuery({
    queryKey: [QueryKey.ME],
    queryFn: authApi.getProfile,
  });

  const { mutate: deleteComment, isPending: isPendingDelete } = useMutation({
    mutationFn: () => commentsApi.deleteById(comment.taskId, comment.id),
    onSuccess: () => {
      if (hash === `#comment-${comment.id}`) {
        navigate(pathname);
      }

      queryClient.setQueryData<ITask>(
        [QueryKey.TASKS, comment.taskId],
        (oldTask) => {
          if (!oldTask) return oldTask;

          return {
            ...oldTask,
            comments: oldTask.comments?.filter((c) => c.id !== comment.id),
          };
        },
      );
    },
  });

  const handleOnClickDate = () => {
    const commentId = parseInt(hash.replace('#comment-', ''));

    if (commentId === comment.id) {
      navigate(pathname);
      return;
    }

    navigate(`#comment-${comment.id}`);
  };

  const handleDeleteComment = () => {
    deleteComment();
  };

  return (
    <CommentWrapper
      container
      wrap="nowrap"
      className={isHighlighted ? 'highlighted' : ''}
      gap={1}
    >
      <Grid item>
        <CommentAvatar src={comment.author.photo?.path}>
          {comment.author.firstName[0] + comment.author.lastName[0]}
        </CommentAvatar>
      </Grid>
      <Grid item container direction="column">
        <Grid item>
          <Typography variant="subtitle1" component="span">
            {comment.author.firstName + ' ' + comment.author.lastName}
          </Typography>
          <CommentDateTypography
            variant="body2"
            component="span"
            sx={{ marginLeft: '4px' }}
            onClick={handleOnClickDate}
          >
            {formatDate(new Date(comment.createdAt), 'StandardWithHours')}
          </CommentDateTypography>
        </Grid>
        <CommentBody item>
          <Typography variant="body2">{comment.message}</Typography>
        </CommentBody>
        <Grid item>
          <IconButton size="small">
            <AddReactionOutlinedIcon />
          </IconButton>

          {profile?.id === comment.authorId && (
            <>
              <CommentActionButton
                size="small"
                variant="text"
                disabled={isPendingDelete}
              >
                Edit
              </CommentActionButton>
              <CommentActionButton
                size="small"
                variant="text"
                onClick={handleDeleteComment}
                disabled={isPendingDelete}
                startIcon={isPendingDelete && <CircularProgress size={8} />}
              >
                Delete
              </CommentActionButton>
            </>
          )}
        </Grid>
      </Grid>
    </CommentWrapper>
  );
}
