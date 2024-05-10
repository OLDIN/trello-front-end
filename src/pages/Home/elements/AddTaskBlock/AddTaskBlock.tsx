import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { tasksApi } from 'services/api';
import { CreateTaskPayload } from 'services/api/endpoints/tasks';
import { QueryKey } from 'enums/QueryKey.enum';
import { ITask } from 'types/Task';
import { useBoardStore } from 'store/boards/board.store';

import {
  CreateFromTemplateIconButton,
  CreateTaskInputWrapper,
  IconButtonClose,
  StyledButton,
  StyledTextareaAutosize,
} from './styles';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import { Button, FormControl, Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

interface AddTaskBlockProps {
  taskListId: number;
}

export function AddTaskBlock({ taskListId }: AddTaskBlockProps) {
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<'view' | 'add'>('view');
  const { selectedBoard } = useBoardStore();

  const { register, handleSubmit, reset } = useForm<CreateTaskPayload>({
    defaultValues: {
      boardId: selectedBoard?.id ?? 0,
      taskListId,
    },
    values: {
      boardId: selectedBoard?.id ?? 0,
      taskListId,
      name: '',
    },
  });

  const { mutate: createTask, isPending } = useMutation({
    mutationFn: (data: CreateTaskPayload) =>
      tasksApi.create(data, {
        join: [
          {
            field: 'assignees',
          },
          {
            field: 'assignees.photo',
          },
          {
            field: 'cover',
          },
          {
            field: 'attachments',
          },
          {
            field: 'comments',
          },
          {
            field: 'labels',
          },
        ],
      }),
    onSuccess: (task) => {
      queryClient.setQueryData<ITask[]>(
        [QueryKey.GET_TASKS, { boardId: selectedBoard?.id }],
        (oldTasks) => {
          if (!oldTasks) return oldTasks;

          return [...oldTasks, task];
        },
      );
      handleClose();
    },
  });

  const onSubmit = (data: CreateTaskPayload) => {
    createTask(data);
  };

  const handleClose = () => {
    setMode('view');
    reset({ name: '', boardId: selectedBoard?.id, taskListId });
  };

  return (
    <Grid container component="li">
      {mode === 'view' ? (
        <>
          <StyledButton startIcon={<AddIcon />} onClick={() => setMode('add')}>
            + Add a task
          </StyledButton>
          <CreateFromTemplateIconButton>
            <DashboardCustomizeOutlinedIcon />
          </CreateFromTemplateIconButton>
        </>
      ) : (
        <Grid
          item
          container
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          gap={1}
        >
          <CreateTaskInputWrapper item>
            <FormControl fullWidth>
              <StyledTextareaAutosize
                autoFocus
                {...register('name', { required: true })}
                placeholder="Add a title for this task..."
                disabled={isPending}
              />
            </FormControl>
          </CreateTaskInputWrapper>

          <Grid item container gap={1}>
            <Button
              type="submit"
              disabled={isPending}
              startIcon={isPending && <CircularProgress size={16} />}
            >
              Add Task
            </Button>
            <IconButtonClose disabled={isPending} onClick={handleClose}>
              <CloseIcon />
            </IconButtonClose>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
