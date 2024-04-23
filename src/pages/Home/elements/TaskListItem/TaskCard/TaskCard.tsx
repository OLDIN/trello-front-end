import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useNavigate, useParams } from 'react-router-dom';

import { useTaskStore } from '../../../../../store/boards/tasks/task.store';

import type { ITask } from '../../../../../types/Task';
import { TaskCover } from './elements/TaskCover';
import {
  IconButton,
  Label,
  StyledBadge,
  Task,
  TaskBody,
  TaskEditButton,
} from './styles';

import AttachFile from '@mui/icons-material/AttachFile';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import { Box, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';

interface TaskCardProps {
  task: ITask;
  index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
  const { setTaskModalSettings } = useTaskStore();
  const { boardId } = useParams();
  const navigate = useNavigate();

  const handleTaskClick = (taskId: number) => {
    setTaskModalSettings({
      isOpen: true,
      taskId,
    });
    navigate(`/boards/${boardId}/tasks/${taskId}`);
  };

  return (
    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <Task
          ref={provided.innerRef}
          key={task.id}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => handleTaskClick(task.id)}
        >
          <Box
            sx={{
              width: '100%',
            }}
          >
            {task.cover && (
              <Box>
                <TaskCover src={task.cover.path} />
                <TaskEditButton size="small">
                  <EditIcon />
                </TaskEditButton>
              </Box>
            )}
            <TaskBody>
              {task.labels && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: '4px',
                    marginBottom: '4px',
                  }}
                >
                  {task.labels.map((label) => (
                    <Label
                      key={label.id}
                      className={`task-label-color-${label.color}`}
                    >
                      {label.name}
                    </Label>
                  ))}
                </Box>
              )}
              <Box
                sx={{
                  marginBottom: '4px',
                }}
              >
                <Typography variant="body1">{task.name}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: '4px',
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
            </TaskBody>
          </Box>
        </Task>
      )}
    </Draggable>
  );
}
