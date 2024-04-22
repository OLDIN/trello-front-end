import React from 'react';

import { TaskCheckList } from '../../../../../types/TaskChecklist';

import styled from '@emotion/styled';
import AddIcon from '@mui/icons-material/Add';
import { Button, Grid, LinearProgress, Typography } from '@mui/material';

import { CheckListItem } from './CheckListItem';

interface CheckListProps {
  checkList: TaskCheckList;
}

const StyledLinearProgress = styled(LinearProgress)`
  /* &&::before {
    content: ${({ value }) => `${value}%`};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 12px;
  } */
`;

export function CheckList({ checkList }: CheckListProps) {
  return (
    <Grid item key={checkList.id}>
      <Grid item container justifyContent="space-between">
        <Grid item>
          <Typography variant="subtitle2" gutterBottom>
            {checkList.name}
          </Typography>
        </Grid>
        <Grid item>
          <Button size="small">Hide checked items</Button>
          <Button size="small">Delete</Button>
        </Grid>
      </Grid>
      <Grid item>
        <StyledLinearProgress
          variant="determinate"
          value={
            (checkList.items.filter((i) => i.checked).length /
              checkList.items.length) *
            100
          }
        />
      </Grid>
      <Grid item container direction="column">
        {checkList.items.map((item) => (
          <CheckListItem key={item.id} item={item} />
        ))}
      </Grid>
      <Grid item>
        <Button size="small" startIcon={<AddIcon />}>
          Add an item
        </Button>
      </Grid>
    </Grid>
  );
}
