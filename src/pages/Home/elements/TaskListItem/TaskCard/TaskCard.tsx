import { Box, ListItem, styled, Typography } from '@mui/material';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Avatar from '@mui/material/Avatar';

import { useTaskStore } from '../../../../../store/boards/tasks/task.store';
import type { Task } from '../../../../../types/Task';

interface TaskCardProps {
  task: Task;
  index: number;
}

const Task = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#ffffff',
  borderRadius: '8px',
  boxShadow: '0px 1px 1px #091e4240, 0px 0px 1px #091e424f',
  minHeight: '36px',
  cursor: 'pointer',
  color: '#172b4d',
}));

export function TaskCard({ task, index }: TaskCardProps) {
  const { setTaskModalSettings } = useTaskStore();

  return (
    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Task
          ref={provided.innerRef}
          key={task.id}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() =>
            setTaskModalSettings({
              isOpen: true,
              taskId: task.id,
            })
          }
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Typography variant="body2">{task.name}</Typography>
            {task.assignee && (
              <Avatar
                alt={task.assignee?.firstName + ' ' + task.assignee?.lastName}
                src={task.assignee?.photo?.path}
                sx={{ width: 24, height: 24 }}
              >
                {task.assignee?.firstName[0] + task.assignee?.lastName[0]}
              </Avatar>
            )}
          </Box>
        </Task>
      )}
    </Draggable>
  );
}
