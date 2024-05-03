import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { taskListsApi } from 'services/api';
import { ICreateTaskListPayload } from 'services/api/endpoints/task-lists';
import { QueryKey } from 'enums/QueryKey.enum';
import { useBoardStore } from 'store/boards/board.store';

import { AddAnotherListButton, AddAnotherListWrapper } from './styles';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export function AddAnotherListBlock() {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<'view' | 'add'>('view');
  const { selectedBoard } = useBoardStore();

  const { register, handleSubmit, reset } = useForm<ICreateTaskListPayload>({
    values: {
      boardId: selectedBoard?.id ?? 0,
      name: '',
    },
  });
  const { mutate: createTaskList, isPending } = useMutation({
    mutationFn: (data: ICreateTaskListPayload) => taskListsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TASK_LISTS] });
      handleClose();
    },
  });

  const onSubmit = (data: ICreateTaskListPayload) => {
    createTaskList(data);
  };

  const handleClose = () => {
    setMode('view');
    reset({ name: '' });
  };

  return (
    <AddAnotherListWrapper mode={mode}>
      {mode === 'view' ? (
        <AddAnotherListButton
          startIcon={<AddIcon />}
          onClick={() => setMode('add')}
        >
          Add another list
        </AddAnotherListButton>
      ) : (
        <Grid
          container
          component="form"
          direction="column"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                size="small"
                {...register('name')}
                placeholder="Enter list title..."
                autoFocus
                disabled={isPending}
              />
            </FormControl>
          </Grid>
          <Grid item>
            <Button
              type="submit"
              disabled={isPending}
              startIcon={isPending && <CircularProgress size={16} />}
            >
              Add list
            </Button>
            <IconButton disabled={isPending} onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      )}
    </AddAnotherListWrapper>
  );
}
