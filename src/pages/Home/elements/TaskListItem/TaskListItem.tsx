import React, { useMemo } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';

import useProfile from 'hooks/useProfile/useProfile';

import { usePartialUpdateTaskList } from 'pages/Home/hooks/usePartialUpdateTaskList';
import { ITask } from '../../../../types/Task';
import { TaskList } from '../../../../types/TaskList';
import { Item, StyledEditableInput, TaskListItemOptionsBtn } from './styles';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import { Box, Icon, IconButton, List, Typography } from '@mui/material';

import { AddTaskBlock } from '../AddTaskBlock/AddTaskBlock';
import { TaskCardDraggable } from './TaskCard/TaskCardDraggable';

interface TaskListItemProps {
  taskListItem: TaskList;
  tasks: ITask[];
}

export function TaskListItem({ taskListItem: list, tasks }: TaskListItemProps) {
  const { register, getValues } = useForm({
    values: {
      name: list.name,
    },
  });

  const { data: profile } = useProfile();
  const { mutate: partialUpdateTaskList } = usePartialUpdateTaskList({
    taskListId: list.id,
    boardId: list.boardId,
  });

  const handleOnPressEnterName = () => {
    partialUpdateTaskList({
      name: getValues('name'),
    });
  };

  const isWatched = useMemo(
    () => list.watchers.some((w) => w.id === profile?.id),
    [list.watchers, profile?.id],
  );

  return (
    <Droppable key={list.id} droppableId={list.id.toString()}>
      {(provided) => (
        <Item elevation={4} ref={provided.innerRef}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <StyledEditableInput
              variant="subtitle1"
              fontWeight={(theme) => theme.typography.fontWeightBold}
              value={list.name}
              onPressEnter={handleOnPressEnterName}
              {...register('name')}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {isWatched && (
                <Icon sx={{ fontSize: 16 }}>
                  <RemoveRedEye sx={{ fontSize: 16 }} />
                </Icon>
              )}
              <TaskListItemOptionsBtn>
                <MoreHorizIcon />
              </TaskListItemOptionsBtn>
            </Box>
          </Box>

          <List
            sx={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: '8px',
            }}
          >
            {tasks.length ? (
              tasks.map((task, index) => (
                <TaskCardDraggable key={task.id} task={task} index={index} />
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No tasks
              </Typography>
            )}
            {provided.placeholder}
            <AddTaskBlock taskListId={list.id} />
          </List>
        </Item>
      )}
    </Droppable>
  );
}
