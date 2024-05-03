import React from 'react';

import { ITask } from 'types/Task';

import { StyledDialog } from './styles';

import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EastIcon from '@mui/icons-material/East';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Button, DialogContent, Grid } from '@mui/material';

import { TaskCard } from '../TaskListItem/TaskCard';

interface TaskContextMenuProps {
  task: ITask;
  open: boolean;
  left: number;
  top: number;
  onClose: () => void;
}

export function TaskContextMenu({
  task,
  open,
  left,
  top,
  onClose,
}: TaskContextMenuProps) {
  return (
    <StyledDialog open={open} left={left} top={top} onClose={onClose}>
      <DialogContent>
        <Grid container wrap="nowrap" gap="5px">
          <Grid
            item
            container
            direction="column"
            wrap="nowrap"
            gap="8px"
            sx={{
              width: '256px',
            }}
          >
            <Grid item>
              <TaskCard
                task={task}
                disableEditBtn={true}
                disableDetailedView={true}
              />
            </Grid>
            <Grid item>
              <Button>Save</Button>
            </Grid>
          </Grid>
          <Grid item container direction="column" gap="5px" width="auto">
            <Button startIcon={<ArchiveOutlinedIcon />}>Open task</Button>
            <Button startIcon={<LabelOutlinedIcon />}>Edit labels</Button>
            <Button startIcon={<Person2OutlinedIcon />}>Change members</Button>
            <Button startIcon={<CreditCardIcon />}>Change cover</Button>
            <Button startIcon={<ScheduleIcon />}>Edit dates</Button>
            <Button startIcon={<EastIcon />}>Move</Button>
            <Button startIcon={<ContentCopyIcon />}>Copy</Button>
            <Button startIcon={<ArchiveOutlinedIcon />}>Archive</Button>
          </Grid>
        </Grid>
      </DialogContent>
    </StyledDialog>
  );
}
