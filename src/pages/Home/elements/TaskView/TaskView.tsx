import { Box, Modal, styled, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import tasksApi from '../../../../services/api/endpoints/tasks';

interface TaskViewProps {
  open: boolean;
  onClose: () => void;
  taskId: number;
}

const TaskBody = styled(Box)(() => ({
  // position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '768px',
  // bgcolor: 'background.paper',
  borderRadius: '12px',
  // boxShadow: 24,
  // p: 4,
  backgroundColor: '#ffffff',
  boxSizing: 'border-box',
  overflow: 'hidden',
  position: 'relative',
}));

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
      <TaskBody>
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
      </TaskBody>
    </Modal>
  );
}
