import React from 'react';
import { useForm } from 'react-hook-form';

import { ICreateChecklistPayload } from 'services/api/endpoints/checklist';

import { useCreateChecklist } from 'pages/Home/elements/TaskView/hooks/useCreateChecklist';
import { useGetChecklists } from 'pages/Home/elements/TaskView/hooks/useGetChecklists';

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
  const { register, handleSubmit } = useForm<FormValues>({
    values: {
      name: '',
      checklistId: 0,
    },
  });

  const { checklists = [], groupedChecklists } = useGetChecklists(taskId);
  const { mutate: createChecklist, isPending } = useCreateChecklist({
    taskId,
    onSuccess: () => {
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
            defaultValue={''}
            {...register('checklistId')}
            disabled={isPending}
          >
            {groupedChecklists.map((group) => [
              <MenuItem key={''} value={''}>
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
