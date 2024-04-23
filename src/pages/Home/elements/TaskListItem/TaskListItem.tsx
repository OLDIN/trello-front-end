import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { ITask } from '../../../../types/Task';
import { TaskList } from '../../../../types/TaskList';
import { Item, ItemName, TaskListItemOptionsBtn } from './styles';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, Button, List, Typography } from '@mui/material';

import { TaskCard } from './TaskCard';

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
                <TaskCard key={task.id} task={task} index={index} />
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No tasks
              </Typography>
            )}
            {provided.placeholder}
          </List>

          <Button
            sx={{
              width: '100%',
              backgroundColor: 'transparent',
              borderRadius: '8px',
              color: '#44546f',
              textTransform: 'none',
              padding: '6px 12px 6px 8px',
              textDecoration: 'none',
              userSelect: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexGrow: 1,
              margin: 0,
              '&:hover': {
                backgroundColor: '#091e4224',
                color: '#172b4d',
              },
            }}
          >
            + Add a task
          </Button>
        </Item>
      )}
    </Droppable>
  );
}
