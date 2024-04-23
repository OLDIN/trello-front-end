import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { filesApi, tasksApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';
import { IFile } from 'types/File';
import { ITask } from 'types/Task';
import { formatDate } from 'utils/formatDate';

import { AttachmentDescription, AttachmentPreview } from './styles';

import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Button, Grid, IconButton, Popover, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { AttachmentBtn } from '../AttachmentBtn';

interface AttachmentProps {
  attachment: IFile;
  taskId: number;
  taskCoverId?: string;
}

export function Attachment({
  attachment,
  taskId,
  taskCoverId,
}: AttachmentProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const queryClient = useQueryClient();

  const { mutate: deleteAttachment, isPending: isPendingDelete } = useMutation({
    mutationFn: () => filesApi.delete(attachment.id),
    onSuccess: () => {
      setAnchorEl(null);
      queryClient.setQueryData([QueryKey.TASKS, taskId], (oldTask: ITask) => ({
        ...oldTask,
        attachments: (oldTask?.attachments ?? []).filter(
          (oldAttachment) => oldAttachment.id !== attachment.id,
        ),
      }));
    },
  });

  const { mutate: toggleCover } = useMutation({
    mutationFn: () =>
      tasksApi.partialUpdate(taskId, {
        fileCoverId: attachment.id === taskCoverId ? null : attachment.id,
      }),
    onSuccess: () => {
      queryClient.setQueryData([QueryKey.TASKS, taskId], (oldTask: ITask) => ({
        ...oldTask,
        cover: attachment.id === taskCoverId ? null : attachment,
      }));
      queryClient.invalidateQueries({
        queryKey: [QueryKey.TASKS],
        refetchType: 'active',
      });
    },
  });

  const handleConfirmDelete = () => {
    deleteAttachment();
  };

  const handleToggleCoverClick = () => {
    toggleCover();
  };

  const openPopover = Boolean(anchorEl);

  return (
    <>
      <Grid
        item
        container
        wrap="nowrap"
        sx={{
          '&:hover': {
            backgroundColor: '#091e420f',
          },
        }}
      >
        <Grid item>
          <AttachmentPreview backgroundImagePath={attachment.path} />
        </Grid>
        <AttachmentDescription item container direction="column">
          <Grid item>
            <Typography variant="body2">{attachment.name}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption">
              <span>
                Added{' '}
                <span>
                  {formatDate(
                    new Date(attachment.createdAt),
                    'StandardWithHours',
                  )}
                </span>
              </span>
              <span>
                <AttachmentBtn>Comment</AttachmentBtn>
              </span>
              <span>
                <AttachmentBtn>Download</AttachmentBtn>
              </span>
              <span>
                <AttachmentBtn onClick={(e) => setAnchorEl(e.currentTarget)}>
                  Delete
                </AttachmentBtn>
              </span>
              <span>
                <AttachmentBtn>Edit</AttachmentBtn>
              </span>
            </Typography>
          </Grid>
          <Grid item>
            <Button
              size="small"
              startIcon={<CreditCardIcon />}
              sx={{
                textDecoration: 'underline',
              }}
              onClick={handleToggleCoverClick}
            >
              {attachment.id === taskCoverId ? 'Remove cover' : 'Make cover'}
            </Button>
          </Grid>
        </AttachmentDescription>
      </Grid>
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
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
          <Grid item container direction="column">
            <Typography sx={{ padding: '8px 16px' }}>
              Delete attachment?
            </Typography>
            <Typography variant="caption" sx={{ padding: '8px 16px' }}>
              Deleting an attachment is permanent. There is no undo.
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setAnchorEl(null)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="error"
              sx={{ width: '100%' }}
              onClick={handleConfirmDelete}
              startIcon={
                isPendingDelete ? <CircularProgress size={16} /> : null
              }
              disabled={isPendingDelete}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
}
