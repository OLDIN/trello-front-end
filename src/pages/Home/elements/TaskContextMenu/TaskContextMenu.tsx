import React, { useState } from 'react';

import { ITask } from 'types/Task';

import { MenuButton, MenuButtonsWrapper, StyledDialog } from './styles';

import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EastIcon from '@mui/icons-material/East';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Button, DialogContent, Grid } from '@mui/material';

import { LabelsPopover } from '../LabelsPopover';
import { TaskCard } from '../TaskListItem/TaskCard';

interface TaskContextMenuProps {
  task: ITask;
  open: boolean;
  left: number;
  top: number;
  onClose: () => void;
}

type PopoverName =
  | 'labels'
  | 'members'
  | 'checklist'
  | 'dates'
  | 'attachment'
  | 'cover';

export function TaskContextMenu({
  task,
  open,
  left,
  top,
  onClose,
}: TaskContextMenuProps) {
  const [popoverSettings, setPopoverSettings] = useState<{
    open: boolean;
    anchorEl: HTMLElement | null;
    component: PopoverName | null;
  }>({
    open: false,
    anchorEl: null,
    component: null,
  });

  const openPopover = (
    anchorEl: EventTarget & HTMLElement,
    component: PopoverName,
  ) => {
    setPopoverSettings({
      anchorEl: anchorEl?.parentElement?.parentElement
        ?.childNodes[0] as HTMLElement,
      open: true,
      component,
    });
  };

  const closePopover = () => {
    setPopoverSettings({
      anchorEl: null,
      open: false,
      component: null,
    });
  };

  return (
    <>
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
            <MenuButtonsWrapper item container direction="column" gap="5px">
              <MenuButton startIcon={<ArchiveOutlinedIcon />}>
                Open task
              </MenuButton>
              <MenuButton
                startIcon={<LabelOutlinedIcon />}
                onClick={(e) => openPopover(e.currentTarget, 'labels')}
              >
                Edit labels
              </MenuButton>
              <MenuButton startIcon={<Person2OutlinedIcon />}>
                Change members
              </MenuButton>
              <MenuButton startIcon={<CreditCardIcon />}>
                Change cover
              </MenuButton>
              <MenuButton startIcon={<ScheduleIcon />}>Edit dates</MenuButton>
              <MenuButton startIcon={<EastIcon />}>Move</MenuButton>
              <MenuButton startIcon={<ContentCopyIcon />}>Copy</MenuButton>
              <MenuButton startIcon={<ArchiveOutlinedIcon />}>
                Archive
              </MenuButton>
            </MenuButtonsWrapper>
          </Grid>
        </DialogContent>
      </StyledDialog>
      <LabelsPopover
        boardId={task.boardId}
        taskId={task.id}
        open={popoverSettings.open}
        anchorEl={popoverSettings.anchorEl}
        onClose={closePopover}
      />
    </>
  );
}
