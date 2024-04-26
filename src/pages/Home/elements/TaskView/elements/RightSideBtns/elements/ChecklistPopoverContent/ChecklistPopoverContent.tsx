import React, { useMemo } from 'react';
import groupBy from 'lodash.groupby';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { checklistApi } from 'services/api';
import { ICreateChecklistPayload } from 'services/api/endpoints/checklist';
import { QueryKey } from 'enums/QueryKey.enum';

import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

interface ChecklistPopoverContentProps {
  taskId: number;
  onSuccessfulSubmit?: () => void;
}

interface FormValues extends Pick<ICreateChecklistPayload, 'name'> {
  checklistId?: number;
}

export function ChecklistPopoverContent({
  taskId,
  onSuccessfulSubmit,
}: ChecklistPopoverContentProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      checklistId: -1,
    },
  });

  const { data: checklists = [] } = useQuery({
    queryKey: [QueryKey.CHECKLISTS, { taskId }],
    queryFn: () =>
      checklistApi.fetchAll({
        join: [
          {
            field: 'task',
            select: ['id', 'name'],
          },

          {
            field: 'items',
            select: ['id', 'name'],
          },
        ],
      }),
  });

  const groupedChecklists = useMemo(() => {
    const groupedRaw = groupBy(checklists, (checklist) => checklist.task?.id);

    return Object.entries(groupedRaw).map(([taskId, checklists]) => {
      const task = checklists[0].task;

      return {
        task,
        checklists: checklists.map((checklist) => ({
          id: checklist.id,
          name: checklist.name,
          items: checklist.items,
        })),
      };
    });
  }, [checklists]);

  const { mutate: createChecklist, isPending } = useMutation({
    mutationFn: (data: ICreateChecklistPayload) =>
      checklistApi.create(taskId, data, {
        join: [{ field: 'items' }],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.CHECKLISTS, { taskId }],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.TASKS, taskId],
      });
      onSuccessfulSubmit?.();
    },
  });

  const onSubmit = (data: FormValues) => {
    const items =
      checklists
        .find((checklist) => checklist.id === data.checklistId)
        ?.items?.map((item) => ({
          name: item.name,
          isCompleted: false,
        })) ?? [];
    createChecklist({
      name: data.name,
      items,
    });
  };

  return (
    <Grid
      container
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      direction="column"
      gap={1}
    >
      <Grid item>
        <FormControl fullWidth>
          <FormLabel>Name</FormLabel>
          <TextField size="small" {...register('name')} disabled={isPending} />
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl fullWidth>
          <FormLabel>Copy items from…</FormLabel>
          <Select
            size="small"
            defaultValue={-1}
            {...register('checklistId')}
            disabled={isPending}
          >
            {groupedChecklists.map((group) => [
              <MenuItem key={-1} value={-1}>
                (None)
              </MenuItem>,
              <ListSubheader key={'task-' + group.task?.id}>
                {group.task?.name}
              </ListSubheader>,
              ...group.checklists.map((checklist) => (
                <MenuItem
                  key={'checklist-' + checklist.id}
                  value={checklist.id}
                >
                  {checklist.name}
                </MenuItem>
              )),
            ])}
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isPending}
          startIcon={isPending && <CircularProgress size={16} />}
        >
          Add
        </Button>
      </Grid>
    </Grid>
  );
}
