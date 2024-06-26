import React from 'react';
import { useForm } from 'react-hook-form';

import { PartialUpdateChecklistItemData } from 'services/api/endpoints/checklist-items';

import { useUpdateCheckListItem } from './hooks/useUpdateChecklistItem';
import type { TaskCheckListItem } from '../../../../../../types/TaskChecklist';
import {
  CheckListItemTitle,
  CheckListItemTitleWrapper,
  CheckListItemWrapper,
} from './styles';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Checkbox, Grid, IconButton, Typography } from '@mui/material';

interface CheckListItemProps {
  item: TaskCheckListItem;
  checklistId: number;
  taskId: number;
  isReadOnly?: boolean;
}

export function CheckListItem({
  item,
  taskId,
  checklistId,
  isReadOnly = false,
}: CheckListItemProps) {
  const { register, handleSubmit, getValues } =
    useForm<PartialUpdateChecklistItemData>({
      mode: 'onChange',
      values: {
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
    <CheckListItemWrapper item key={item.id} container wrap="nowrap">
      <Grid item component="form" onChange={handleSubmit(onSubmit)}>
        <Checkbox
          checked={getValues('isCompleted')}
          {...register('isCompleted')}
          disabled={isReadOnly}
          sx={{
            padding: '9px 9px 9px 0',
          }}
        />
      </Grid>
      <CheckListItemTitleWrapper
        item
        container
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <CheckListItemTitle variant="body2" checked={item.isCompleted}>
            {item.name}
          </CheckListItemTitle>
        </Grid>
        <Grid
          item
          className="check-list-item-icons-block"
          sx={{
            display: 'none',
          }}
        >
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
      </CheckListItemTitleWrapper>
    </CheckListItemWrapper>
  );
}
