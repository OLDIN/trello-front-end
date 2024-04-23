import React from 'react';

import { type TaskLabel } from '../../../../../types/TaskLabel';

import { Grid, styled, Typography } from '@mui/material';

const Label = styled(Typography)`
  display: inline-block;
  position: relative;
  margin-bottom: 0;
  border-radius: 3px;
  padding: 0 12px;
  max-width: 100%;
  min-width: 48px;
  height: 32px;
  box-sizing: border-box;
  background-color: #091e420f;
  line-height: 32px;
  color: #172b4d;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.task-label-color-red {
    background-color: #f44336;
    color: #fff;
  }

  &.task-label-color-yellow {
    background-color: #ffeb3b;
    color: #172b4d;
  }

  &.task-label-color-purple {
    background-color: #9c27b0;
    color: #fff;
  }
`;

interface TaskLabelProps {
  label: TaskLabel;
}

export function TaskLabel({ label }: TaskLabelProps) {
  return (
    <Grid item key={label.id}>
      <Label noWrap className={`task-label-color-${label.color}`}>
        {label.name}
      </Label>
    </Grid>
  );
}
