import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { checklistApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';
import { ITask } from 'types/Task';

import { Button } from 'components/Button';

import { TaskCheckList } from '../../../../../../types/TaskChecklist';
import { StyledLinearProgress } from './styles';

import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { Grid, Icon, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { AddAnChecklistItemBlock } from '../AddAnChecklistItemBlock/AddAnChecklistItemBlock';
import { CheckListItem } from '../CheckListItem/CheckListItem';

interface CheckListProps {
  checkList: TaskCheckList;
  taskId: number;
}

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
    return Math.round(
      ((checkList?.items ?? []).filter((i) => i.isCompleted).length /
        (checkList?.items?.length ?? 0)) *
        100,
    );
  }, [checkList.items]);

  const isShowFilterButton = useMemo(() => {
    return checkList.items?.some((i) => i.isCompleted);
  }, [checkList.items]);

  return (
    <Grid item key={checkList.id}>
      <Grid item container justifyContent="space-between" gap={2}>
        <Icon>
          <CheckBoxOutlinedIcon />
        </Icon>
        <Grid flex={1}>
          <Typography
            variant="subtitle1"
            whiteSpace="nowrap"
            fontWeight={(theme) => theme.typography.fontWeightBold}
          >
            {checkList.name}
          </Typography>
        </Grid>
        {isShowFilterButton && (
          <Button onClick={handleToggleCheckedItems}>
            {itemsMode === 'all'
              ? 'Hide checked items'
              : `Show checked items (${completedLength})`}
          </Button>
        )}
        <Button
          onClick={handleDeleteOnClick}
          disabled={isPendingDelete}
          startIcon={isPendingDelete && <CircularProgress size={16} />}
        >
          Delete
        </Button>
      </Grid>
      <Grid item container alignItems="center" wrap="nowrap">
        <Grid sx={{ minWidth: 40 }}>
          <Typography
            variant="body2"
            color="text.secondary"
          >{`${completedInPercent}%`}</Typography>
        </Grid>
        <Grid item sx={{ width: '100%' }}>
          <StyledLinearProgress
            variant="determinate"
            value={completedInPercent}
          />
        </Grid>
      </Grid>
      <Grid item container direction="column">
        {completedInPercent < 100 ? (
          items?.map((item) => (
            <CheckListItem
              key={item.id}
              item={item}
              taskId={taskId}
              checklistId={checkList.id}
              isReadOnly={isPendingDelete}
            />
          ))
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Everything in this checklist is complete!
          </Typography>
        )}
      </Grid>
      <Grid item>
        <AddAnChecklistItemBlock taskId={taskId} checkListId={checkList.id} />
      </Grid>
    </Grid>
  );
}
