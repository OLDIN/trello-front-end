import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { filesApi, tasksApi } from 'services/api';
import { IPartialUpdateTask } from 'services/api/endpoints/tasks';
import { QueryKey } from 'enums/QueryKey.enum';
import { ITask } from 'types/Task';

import { VisuallyHiddenInput } from './styles';

import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { Button, Grid, IconButton, Popover, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

interface AddAttachmentPopoverProps {
  openPopover: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  task: ITask;
}

export function AddAttachmentPopover({
  openPopover,
  anchorEl,
  onClose,
  task,
}: AddAttachmentPopoverProps) {
  const { register, handleSubmit, reset } = useForm<{
    file: FileList;
  }>({
    mode: 'onChange',
  });
  const queryClient = useQueryClient();

  const { mutate: updateTask, isPending: isPendingUpdateTask } = useMutation({
    mutationFn: (data: IPartialUpdateTask) =>
      tasksApi.partialUpdate(task.id, data, {
        join: [
          {
            field: 'attachments',
          },
        ],
      }),
    onSuccess: (data) => {
      queryClient.setQueryData([QueryKey.TASKS, task.id], (oldTask: ITask) => ({
        ...oldTask,
        attachments: data.attachments,
      }));
      reset();
      onClose();
    },
  });

  const { mutate: uploadAttachment, isPending: isPendingUploadFile } =
    useMutation({
      mutationFn: (data: FormData) => filesApi.upload(data),
      onSuccess: ({ file: { id } }) => {
        const attachmentsIds = (task?.attachments ?? []).map(
          (attachment) => attachment.id,
        );
        updateTask({
          attachmentsIds: [...attachmentsIds, id],
        });
      },
      onError: () => {
        reset();
      },
    });

  const onSubmit = (data: { file: FileList }) => {
    if (!data.file.length) {
      return;
    }

    const formData = new FormData();
    formData.set('file', data.file[0]);
    uploadAttachment(formData);
  };

  const handleOnClose = () => {
    if (isPendingUploadFile || isPendingUpdateTask) {
      return;
    }

    reset();
    onClose();
  };

  return (
    <Popover
      open={openPopover}
      anchorEl={anchorEl}
      onClose={handleOnClose}
      id="add-attachment-popover"
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
    >
      <Grid
        container
        direction="column"
        sx={{
          width: '304px',
          padding: '8px 16px',
        }}
      >
        <Grid item container justifyContent="space-between" alignItems="center">
          <Grid item>
            <InfoIcon />
          </Grid>
          <Grid item>
            <Typography>Attach</Typography>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="close"
              onClick={handleOnClose}
              sx={{
                position: 'absolute',
                right: 5,
                top: 5,
                color: (theme) => theme.palette.grey[500],
              }}
              disabled={isPendingUploadFile || isPendingUpdateTask}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item sx={{ padding: '8px 16px' }}>
          <Typography variant="caption">
            Attach a file from your computer
          </Typography>
        </Grid>
        <Grid item component="form" onChange={handleSubmit(onSubmit)}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            color="primary"
            sx={{ width: '100%' }}
            tabIndex={-1}
            disabled={isPendingUploadFile || isPendingUpdateTask}
            startIcon={
              isPendingUploadFile || isPendingUpdateTask ? (
                <CircularProgress size={16} />
              ) : null
            }
          >
            Choose a file
            <VisuallyHiddenInput
              type="file"
              {...register('file', { required: true })}
            />
          </Button>
        </Grid>
      </Grid>
    </Popover>
  );
}
