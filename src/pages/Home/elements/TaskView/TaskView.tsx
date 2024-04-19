import { Box, Modal, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import tasksApi from '../../../../services/api/endpoints/tasks';

interface TaskViewProps {
  open: boolean;
  onClose: () => void;
  taskId: number;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 768,
  bgcolor: '#091e420f',
  // border: '2px solid #000',
  borderRadius: 3,
  minHeight: 600,
  boxShadow: 24,
  boxSizing: 'border-box',
  overflow: 'hidden',
  p: 4,
};

export default function TaskView({ open, onClose, taskId }: TaskViewProps) {
  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => tasksApi.getById(taskId),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          ...style,
          bgcolor: '#ffffff',
        }}
      >
        <Box sx={style}>
          {isLoading ? (
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Loading...
            </Typography>
          ) : (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                name: {task?.name}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                description: {task?.description}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
