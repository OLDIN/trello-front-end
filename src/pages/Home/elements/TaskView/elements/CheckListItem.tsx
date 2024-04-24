import React, { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { checklistItemsApi } from 'services/api';
import { PartialUpdateChecklistItemData } from 'services/api/endpoints/checklist-items';
import { QueryKey } from 'enums/QueryKey.enum';
import { ITask } from 'types/Task';

import type { TaskCheckListItem } from '../../../../../types/TaskChecklist';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Checkbox, Grid, IconButton, styled, Typography } from '@mui/material';

interface CheckListItemProps {
  item: TaskCheckListItem;
  checklistId: number;
  taskId: number;
}

const CheckListItemWrapper = styled(Grid)`
  border-radius: 12px;
  box-sizing: border-box;
  clear: both;
  padding-left: 40px;
  position: relative;
  transform-origin: left bottom;
  transition-duration: 0.15s;
  transition-property: transform, opacity, height, padding, margin,
    background-color;
  transition-timing-function: ease-in;
`;

export function CheckListItem({
  item,
  taskId,
  checklistId,
}: CheckListItemProps) {
  const [isHover, setIsHover] = useState(false);
  const { register, handleSubmit, getValues } =
    useForm<PartialUpdateChecklistItemData>({
      mode: 'onChange',
      defaultValues: {
        isCompleted: item.isCompleted,
      },
    });
  const queryClient = useQueryClient();

  const { mutate: update } = useMutation({
    mutationFn: (data: PartialUpdateChecklistItemData) =>
      checklistItemsApi.partialUpdate(taskId, checklistId, item.id, data),
    onSuccess: (data) => {
      // queryClient.setQueryData<ITask>(
      //   [QueryKey.TASKS, taskId],
      //   (oldTask) => {
      //     if (!oldTask) return oldTask;
      //     return {
      //       ...oldTask,
      //       checklists: oldTask.checklists.map((checklist) => {
      //         if (checklist.id === checklistId) {
      //           return {
      //             ...checklist,
      //             items: checklist.items.map((i) => {
      //               if (i.id === item.id) {
      //                 return data;
      //               }
      //               return i;
      //             }),
      //           };
      //         }
      //         return checklist;
      //       }),
      //     };
      //   },
      //   {
      //     exact: true,
      //   },
      // );
    },
  });

  const onSubmit = (data: PartialUpdateChecklistItemData) => {
    update(data);
  };

  return (
    <CheckListItemWrapper
      item
      key={item.id}
      container
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      wrap="nowrap"
    >
      <Grid item component="form" onChange={handleSubmit(onSubmit)}>
        <Checkbox
          checked={getValues('isCompleted')}
          {...register('isCompleted')}
        />
      </Grid>
      <Grid item container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="body2">{item.name}</Typography>
        </Grid>
        {isHover && (
          <Grid item>
            <IconButton size="small">
              <AccessTimeIcon />
            </IconButton>
            <IconButton size="small">
              <PersonAddAltIcon />
            </IconButton>
            <IconButton size="small">
              <MoreHorizIcon />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </CheckListItemWrapper>
  );
}
