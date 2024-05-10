import React, { type MouseEvent, useMemo } from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { QueryKey } from 'enums/QueryKey.enum';
import useProfile from 'hooks/useProfile/useProfile';
import { findParentElementByClassName } from 'utils/helpers';
import { useTaskStore } from '../../../../../store/boards/tasks/task.store';

import { useUpdateTask } from '../../../hooks/useUpdateTask';
import { ITask, TaskLabelsViewModeEnum } from '../../../../../types/Task';
import { TaskCover } from './elements/TaskCover';
import {
  IconButton,
  Label,
  StyledBadge,
  Task,
  TaskBody,
  TaskEditButton,
  TaskTemplateLabel,
} from './styles';

import AttachFile from '@mui/icons-material/AttachFile';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EditIcon from '@mui/icons-material/Edit';
import FormatAlignLeftOutlinedIcon from '@mui/icons-material/FormatAlignLeftOutlined';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import { Box, Icon, Tooltip, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';

interface TaskCardPosition {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface TaskCardProps {
  task: ITask;
  draggableProvided?: DraggableProvided;
  onEditClick?: (
    e: MouseEvent<HTMLElement>,
    position: TaskCardPosition,
  ) => void;
  disableEditBtn?: boolean;
  disableDetailedView?: boolean;
}

export function TaskCard({
  task,
  draggableProvided: provided,
  onEditClick,
  disableEditBtn = false,
  disableDetailedView = false,
}: TaskCardProps) {
  const queryClient = useQueryClient();
  const { setTaskModalSettings } = useTaskStore();
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { mutate: updateTask } = useUpdateTask({
    taskId: task.id,
    onSuccess: (data) => {
      queryClient.setQueryData(
        [QueryKey.GET_TASKS, { boardId: Number(boardId) }],
        (oldTasks: ITask[]) => {
          if (!oldTasks) return;

          return [
            ...oldTasks.map((t) =>
              t.id === data.id
                ? {
                    ...t,
                    ...data,
                  }
                : t,
            ),
          ];
        },
      );
    },
  });

  const { all: allChecklistItems, completed: completedChecklistItems } =
    useMemo(
      () =>
        (task.checklists ?? []).reduce(
          (acc, checkList) => {
            if (!checkList.items) return acc;

            acc.all += checkList.items.length;
            acc.completed += checkList.items.filter(
              (i) => i.isCompleted,
            ).length;
            return acc;
          },
          {
            all: 0,
            completed: 0,
          },
        ),
      [task.checklists],
    );

  const isWatched = useMemo(
    () => task.watchers?.some((w) => w.id === profile?.id),
    [profile?.id, task.watchers],
  );

  const handleTaskClick = (taskId: number) => {
    if (disableDetailedView) return;

    setTaskModalSettings({
      isOpen: true,
      taskId,
    });
    navigate(`/boards/${boardId}/tasks/${taskId}`);
  };

  const handleEditTaskClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const taskEl = findParentElementByClassName(
      e.target as HTMLElement,
      'MuiListItem-root',
    );
    const domRect = taskEl?.getBoundingClientRect();

    onEditClick?.(e, {
      left: domRect?.left ?? 0,
      top: domRect?.top ?? 0,
      width: domRect?.width ?? 0,
      height: domRect?.height ?? 0,
    });
  };

  const handleLabelClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    updateTask({
      labelsViewMode:
        task.labelsViewMode === TaskLabelsViewModeEnum.COLOR_AND_NAME
          ? TaskLabelsViewModeEnum.ONLY_COLOR
          : TaskLabelsViewModeEnum.COLOR_AND_NAME,
    });
  };

  return (
    <Task
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      onClick={() => handleTaskClick(task.id)}
      onContextMenu={handleEditTaskClick}
    >
      <Box
        sx={{
          width: '100%',
        }}
      >
        {task.cover && <TaskCover src={task.cover.path} />}
        {!disableEditBtn && (
          <TaskEditButton size="small" onClick={handleEditTaskClick}>
            <EditIcon />
          </TaskEditButton>
        )}
        <TaskBody>
          {task.labels && (
            <Box
              sx={{
                display: 'flex',
                gap: '4px',
                marginBottom: '4px',
                flexWrap: 'wrap',
              }}
            >
              {task.labels.map((label) => (
                <Label
                  key={label.id}
                  className={`label-color-pattern-${label.color ?? 'without'} `}
                  labelViewMode={task.labelsViewMode}
                  onClick={handleLabelClick}
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
                flexWrap: 'wrap',
                rowGap: '4px',
              }}
            >
              {task.isTemplate && (
                <Tooltip title="This task is a template." disableInteractive>
                  <TaskTemplateLabel
                    variant="body2"
                    component="span"
                    color="text.secondary"
                  >
                    <Icon fontSize="small">
                      <CreditCardIcon fontSize="small" />
                    </Icon>
                    <span>This task is a template.</span>
                  </TaskTemplateLabel>
                </Tooltip>
              )}
              {isWatched && (
                <Tooltip title="You are watching this task." disableInteractive>
                  <IconButton size="small">
                    <RemoveRedEye sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
              {!!task.description && (
                <Tooltip title="This task has a description" disableInteractive>
                  <IconButton size="small">
                    <FormatAlignLeftOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
              {!!task.comments?.length && (
                <Tooltip title="Comments" disableInteractive>
                  <IconButton size="small">
                    <StyledBadge
                      badgeContent={task.comments.length}
                      color="default"
                    >
                      <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              )}
              {!!task.attachments?.length && (
                <Tooltip title="Attachments" disableInteractive>
                  <IconButton size="small">
                    <StyledBadge
                      badgeContent={task.attachments.length}
                      color="default"
                    >
                      <AttachFile
                        sx={{ fontSize: 16, transform: 'rotate(45deg)' }}
                      />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              )}
              {!!allChecklistItems && (
                <Tooltip title="Checklist items" disableInteractive>
                  <IconButton size="small">
                    <StyledBadge
                      badgeContent={`${completedChecklistItems}/${allChecklistItems}`}
                      color="default"
                    >
                      <CheckBoxOutlinedIcon sx={{ fontSize: 16 }} />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
          {!!task.assignees?.length && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '4px',
                marginBottom: '4px',
              }}
            >
              {task.assignees.map((assignee) => (
                <Avatar
                  key={assignee.id}
                  alt={assignee?.firstName + ' ' + assignee?.lastName}
                  src={assignee?.photo?.path}
                  sx={{ width: 24, height: 24, fontSize: 14 }}
                  title={`${assignee?.firstName} ${assignee?.lastName} (${assignee?.email})`}
                >
                  {assignee?.firstName[0] + assignee?.lastName[0]}
                </Avatar>
              ))}
            </Box>
          )}
        </TaskBody>
      </Box>
    </Task>
  );
}
