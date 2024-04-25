import React from 'react';

import { type TaskLabel } from '../../../../../../types/TaskLabel';
import { StyledLabel } from './styles';

import { Grid } from '@mui/material';

interface TaskLabelProps {
  label: TaskLabel;
}

export function TaskLabel({ label }: TaskLabelProps) {
  return (
    <Grid item key={label.id}>
      <StyledLabel noWrap className={`task-label-color-${label.color}`}>
        {label.name}
      </StyledLabel>
    </Grid>
  );
}
