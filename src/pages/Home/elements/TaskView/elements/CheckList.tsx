import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { checklistApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';
import { ITask } from 'types/Task';

import { TaskCheckList } from '../../../../../types/TaskChecklist';

import styled from '@emotion/styled';
import { Button, Grid, LinearProgress, Typography } from '@mui/material';

import { AddAnChecklistItemBlock } from './AddAnChecklistItemBlock/AddAnChecklistItemBlock';
import { CheckListItem } from './CheckListItem';

interface CheckListProps {
  checkList: TaskCheckList;
  taskId: number;
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

export function CheckList({ checkList, taskId }: CheckListProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteCheckList, isPending: isPendingDelete } = useMutation({
    mutationFn: () => checklistApi.deleteById(taskId, checkList.id),
    onSuccess: () => {
      queryClient.setQueryData<ITask>([QueryKey.TASKS, taskId], (oldTask) => {
        if (!oldTask) return oldTask;

        return {
          ...oldTask,
          checklists: oldTask?.checklists?.filter((c) => c.id !== checkList.id),
        };
      });
    },
  });

  const handleDeleteOnClick = () => {
    deleteCheckList();
  };

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
          <Button
            size="small"
            onClick={handleDeleteOnClick}
            disabled={isPendingDelete}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <StyledLinearProgress
          variant="determinate"
          value={
            ((checkList?.items ?? []).filter((i) => i.isCompleted).length /
              (checkList?.items?.length ?? 0)) *
            100
          }
        />
      </Grid>
      <Grid item container direction="column">
        {checkList.items?.map((item) => (
          <CheckListItem
            key={item.id}
            item={item}
            taskId={taskId}
            checklistId={checkList.id}
          />
        ))}
      </Grid>
      <Grid item>
        <AddAnChecklistItemBlock taskId={taskId} checkListId={checkList.id} />
      </Grid>
    </Grid>
  );
}
