import React from 'react';
import {
  Badge,
  BadgeProps,
  Box,
  IconButton as IconButtonBase,
  ListItem,
  styled,
  Typography,
} from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import Avatar from '@mui/material/Avatar';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import AttachFile from '@mui/icons-material/AttachFile';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import { useTaskStore } from '../../../../../store/boards/tasks/task.store';
import type { Task } from '../../../../../types/Task';
import { TaskCover } from './elements/TaskCover';

interface TaskCardProps {
  task: Task;
  index: number;
}

const Task = styled(ListItem)(({ theme }) => ({
  padding: 0,
  backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#ffffff',
  borderRadius: '8px',
  boxShadow: '0px 1px 1px #091e4240, 0px 0px 1px #091e424f',
  minHeight: '36px',
  cursor: 'pointer',
  color: '#172b4d',
  overflow: 'hidden',
}));

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -5,
    top: 8,
    border: 'none',
    padding: '0 4px',
  },
}));

const IconButton = styled(IconButtonBase)`
  &:hover {
    background-color: transparent;
  }
`;

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
              width: '100%',
            }}
          >
            {task.cover && (
              <Box>
                <TaskCover src={task.cover.path} alt="Task cover" />
              </Box>
            )}
            <Box
              sx={{
                padding: '8px 16px',
              }}
            >
              <Typography variant="body2">{task.name}</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                padding: '8px 16px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  columnGap: '4px',
                }}
              >
                {!!task.assignee?.id && (
                  <IconButton size="small">
                    <RemoveRedEye sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
                {!!task.comments?.length && (
                  <IconButton size="small">
                    <StyledBadge
                      badgeContent={task.comments.length}
                      color="default"
                    >
                      <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
                    </StyledBadge>
                  </IconButton>
                )}
                {!!task.attachments?.length && (
                  <IconButton size="small">
                    <StyledBadge
                      badgeContent={task.attachments.length}
                      color="default"
                    >
                      <AttachFile sx={{ fontSize: 16 }} />
                    </StyledBadge>
                  </IconButton>
                )}
              </Box>
              {!!task.assignee?.id && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    alt={
                      task.assignee?.firstName + ' ' + task.assignee?.lastName
                    }
                    src={task.assignee?.photo?.path}
                    sx={{ width: 24, height: 24, fontSize: 14 }}
                    title={`${task.assignee?.firstName} ${task.assignee?.lastName} (${task.assignee?.email})`}
                  >
                    {task.assignee?.firstName[0] + task.assignee?.lastName[0]}
                  </Avatar>
                </Box>
              )}
            </Box>
          </Box>
        </Task>
      )}
    </Draggable>
  );
}
