import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { ITask } from '../../../../types/Task';
import { TaskList } from '../../../../types/TaskList';
import { Item, ItemName, TaskListItemOptionsBtn } from './styles';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, List, Typography } from '@mui/material';

import { AddTaskBlock } from '../AddTaskBlock/AddTaskBlock';
import { TaskCardDraggable } from './TaskCard/TaskCardDraggable';

interface TaskListItemProps {
  taskListItem: TaskList;
  tasks: ITask[];
}

export function TaskListItem({ taskListItem: list, tasks }: TaskListItemProps) {
  return (
    <Droppable key={list.id} droppableId={list.id.toString()}>
      {(provided) => (
        <Item elevation={4} ref={provided.innerRef}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <ItemName variant="subtitle1" gutterBottom>
              {list.name}
            </ItemName>
            <TaskListItemOptionsBtn>
              <MoreHorizIcon />
            </TaskListItemOptionsBtn>
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
