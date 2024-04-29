import React from 'react';

import { getTooltipTitle } from 'utils/helpers';

import { type TaskLabel } from '../../../../../../types/TaskLabel';
import { StyledLabel } from './styles';

import { Grid, Tooltip } from '@mui/material';

interface TaskLabelProps {
  label: TaskLabel;
}

export function TaskLabel({ label }: TaskLabelProps) {
  return (
    <Grid item key={label.id}>
      <Tooltip
        title={getTooltipTitle(label.color, label.name)}
        disableInteractive
      >
        <StyledLabel
          noWrap
          className={label.color ? `label-color-pattern-${label.color}` : ''}
        >
          {label.name}
        </StyledLabel>
      </Tooltip>
    </Grid>
  );
}
