import { Button, Grid, Typography } from '@mui/material';
import React from 'react';
import type { TaskComment } from '../../../../../types/TaskComment';
import { formatDate } from '../../../../../utils/formatDate';

interface TaskCommentProps {
  comment: TaskComment;
}

export function TaskComment({ comment }: TaskCommentProps) {
  return (
    <Grid item key={comment.id} container direction="column">
      <Grid item>
        <span>{comment.author.firstName + ' ' + comment.author.lastName}</span>
        <span>
          {formatDate(new Date(comment.createdAt), 'StandardWithHours')}
        </span>
      </Grid>
      <Grid item>
        <Typography variant="body2">{comment.message}</Typography>
      </Grid>
      <Grid item>
        {/* emoji */}
        <Button size="small">Edit</Button>
        <Button size="small">Delete</Button>
      </Grid>
    </Grid>
  );
}
