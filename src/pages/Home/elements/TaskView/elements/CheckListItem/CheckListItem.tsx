import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { PartialUpdateChecklistItemData } from 'services/api/endpoints/checklist-items';

import { useUpdateCheckListItem } from './hooks/useUpdateChecklistItem';
import type { TaskCheckListItem } from '../../../../../../types/TaskChecklist';

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

  const { mutate: update } = useUpdateCheckListItem({
    taskId,
    checklistId,
    item,
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
