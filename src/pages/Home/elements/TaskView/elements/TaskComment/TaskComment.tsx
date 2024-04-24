import React from 'react';

import { formatDate } from '../../../../../../utils/formatDate';
import type { TaskComment } from '../../../../../../types/TaskComment';
import { CommentActionButton, CommentBody } from './styles';

import { Avatar, Button, Grid, Typography } from '@mui/material';

interface TaskCommentProps {
  comment: TaskComment;
}

export function TaskComment({ comment }: TaskCommentProps) {
  return (
    <Grid container wrap="nowrap">
      <Grid item>
        <Avatar
          src={comment.author.photo?.path}
          sx={{ width: '32px', height: '32px' }}
        />
      </Grid>
      <Grid item container direction="column">
        <Grid item>
          <Typography variant="subtitle1" component="span">
            {comment.author.firstName + ' ' + comment.author.lastName}
          </Typography>
          <Typography
            variant="subtitle2"
            component="span"
            sx={{ marginLeft: '4px' }}
          >
            {formatDate(new Date(comment.createdAt), 'StandardWithHours')}
          </Typography>
        </Grid>
        <CommentBody item>
          <Typography variant="body2">{comment.message}</Typography>
        </CommentBody>
        <Grid item>
          {/* emoji */}
          <CommentActionButton size="small" variant="text">
            Edit
          </CommentActionButton>
          <CommentActionButton size="small" variant="text">
            Delete
          </CommentActionButton>
        </Grid>
      </Grid>
    </Grid>
  );
}
