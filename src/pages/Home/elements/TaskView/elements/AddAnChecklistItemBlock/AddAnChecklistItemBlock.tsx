import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { checklistItemsApi } from 'services/api';
import { ICreateChecklistPayload } from 'services/api/endpoints/checklist';
import { CreateChecklistItemData } from 'services/api/endpoints/checklist-items';
import { QueryKey } from 'enums/QueryKey.enum';
import { ITask } from 'types/Task';

import { Button } from 'components/Button';

import { TextareaAutosize, Wrapper } from './styles';

import AddIcon from '@mui/icons-material/Add';
import { Button as ButtonBase, Grid } from '@mui/material';

interface AddAnChecklistItemBlockProps {
  taskId: number;
  checkListId: number;
}

export function AddAnChecklistItemBlock({
  taskId,
  checkListId,
}: AddAnChecklistItemBlockProps) {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const { register, handleSubmit, reset } = useForm<ICreateChecklistPayload>();

  const { mutate: createCheckList, isPending: isPendingCreate } = useMutation({
    mutationFn: (data: CreateChecklistItemData) =>
      checklistItemsApi.create(taskId, checkListId, data),
    onSuccess: (data) => {
      queryClient.setQueryData<ITask>(
        [QueryKey.GET_TASK_BY_ID, taskId],
        (oldTask) => {
          if (!oldTask) return oldTask;

          const checkList = oldTask.checklists?.find(
            (c) => c.id === checkListId,
          );

          if (!checkList) return oldTask;

          return {
            ...oldTask,
            checklists: oldTask.checklists?.map((c) =>
              c.id === checkListId
                ? {
                    ...c,
                    items: [...(c.items ?? []), data],
                  }
                : c,
            ),
          };
        },
      );
      setMode('view');
      reset();
    },
  });

  const onSubmit = (data: ICreateChecklistPayload) => {
    createCheckList(data);
  };

  return (
    <Wrapper>
      {mode === 'view' ? (
        <ButtonBase
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setMode('edit')}
        >
          Add an item
        </ButtonBase>
      ) : (
        <Grid container component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid item sx={{ width: '100%' }}>
            <TextareaAutosize
              minRows={2}
              placeholder="Add an item"
              {...register('name')}
              disabled={isPendingCreate}
            />
          </Grid>
          <Grid item container>
            <Grid item gap={2} container>
              <Button
                variant="contained"
                type="submit"
                disabled={isPendingCreate}
              >
                Add
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  setMode('view');
                }}
                disabled={isPendingCreate}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>{/* assign, dueDate, mentions, emoji */}</Grid>
          </Grid>
        </Grid>
      )}
    </Wrapper>
  );
}
