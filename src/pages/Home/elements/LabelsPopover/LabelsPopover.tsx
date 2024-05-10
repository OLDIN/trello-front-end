import React from 'react';

import { Popover } from 'components/Popover';

import { LabelsPopoverContent } from '../TaskView/elements/LabelsPopoverContent/LabelsPopoverContent';

import { PopoverProps } from '@mui/material';

interface LabelsPopoverProps extends Pick<PopoverProps, 'anchorEl' | 'open'> {
  boardId: number;
  taskId: number;
  onClose: () => void;
}

export function LabelsPopover({
  boardId,
  taskId,
  open,
  anchorEl,
  onClose,
}: LabelsPopoverProps) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      title="Labels"
      sx={{
        marginLeft: '5px',
        marginTop: '0px',
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={() => onClose()}
    >
      <LabelsPopoverContent boardId={boardId} taskId={taskId} />
    </Popover>
  );
}
