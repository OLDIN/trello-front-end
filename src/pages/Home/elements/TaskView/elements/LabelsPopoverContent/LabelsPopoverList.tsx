import React, { useEffect } from 'react';

import { TaskLabel } from 'types/TaskLabel';

import { Button } from 'components/Button';

import { FormControl, Grid, TextField, Typography } from '@mui/material';

import { LabelItem } from './LabelItem';

interface LabelsPopoverListProps {
  taskLabels: TaskLabel[];
  onClickAddNewLabel: () => void;
  onClickEditLabel: (labelId: number) => void;
}

export function LabelsPopoverList({
  taskLabels,
  onClickAddNewLabel,
  onClickEditLabel,
}: LabelsPopoverListProps) {
  return (
    <Grid container gap={2}>
      <Grid item container>
        <FormControl fullWidth>
          <TextField size="small" placeholder="Search labels..." />
        </FormControl>
      </Grid>
      <Grid item container>
        <Typography variant="subtitle2">Labels</Typography>
        <Grid container direction="column" gap={'4px'}>
          {taskLabels.map((label) => (
            <LabelItem
              key={label.id}
              label={label}
              onClickEditLabel={onClickEditLabel}
            />
          ))}
        </Grid>
      </Grid>
      <Grid item container justifyContent="center">
        <Button
          variant="contained"
          sx={{ width: '100%', justifyContent: 'center' }}
          onClick={onClickAddNewLabel}
        >
          Create a new label
        </Button>
      </Grid>
    </Grid>
  );
}
