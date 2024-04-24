import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { checklistApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';
import { ITask } from 'types/Task';

import { Button } from 'components/Button';

import { TaskCheckList } from '../../../../../types/TaskChecklist';

import styled from '@emotion/styled';
import { Grid, LinearProgress, Typography } from '@mui/material';

import { AddAnChecklistItemBlock } from './AddAnChecklistItemBlock/AddAnChecklistItemBlock';
import { CheckListItem } from './CheckListItem/CheckListItem';

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
  const [items, setItems] = useState(checkList.items ?? []);
  const [itemsMode, setItemsMode] = useState<'all' | 'homeCompleted'>('all');

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

  useEffect(() => {
    setItems(checkList.items ?? []);
  }, [checkList.items]);

  useEffect(() => {
    if (itemsMode === 'homeCompleted') {
      setItems((prev) => prev.filter((i) => !i.isCompleted));
    } else {
      setItems(checkList.items ?? []);
    }
  }, [itemsMode, checkList.items]);

  const handleDeleteOnClick = () => {
    deleteCheckList();
  };

  const handleToggleCheckedItems = () => {
    setItemsMode((prev) => (prev === 'all' ? 'homeCompleted' : 'all'));
  };

  const completedLength = useMemo(
    () => checkList.items?.filter((i) => i.isCompleted).length ?? 0,
    [checkList.items],
  );

  const completedInPercent = useMemo(() => {
    return (
      ((checkList?.items ?? []).filter((i) => i.isCompleted).length /
        (checkList?.items?.length ?? 0)) *
      100
    );
  }, [checkList.items]);

  const isShowFilterButton = useMemo(() => {
    return checkList.items?.some((i) => i.isCompleted);
  }, [checkList.items]);

  return (
    <Grid item key={checkList.id}>
      <Grid item container justifyContent="space-between">
        <Grid item>
          <Typography variant="subtitle2" gutterBottom>
            {checkList.name}
          </Typography>
        </Grid>
        <Grid item>
          {isShowFilterButton && (
            <Button onClick={handleToggleCheckedItems}>
              {itemsMode === 'all'
                ? 'Hide checked items'
                : `Show checked items (${completedLength})`}
            </Button>
          )}
          <Button onClick={handleDeleteOnClick} disabled={isPendingDelete}>
            Delete
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <StyledLinearProgress
          variant="determinate"
          value={completedInPercent}
        />
      </Grid>
      <Grid item container direction="column">
        {items?.map((item) => (
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
