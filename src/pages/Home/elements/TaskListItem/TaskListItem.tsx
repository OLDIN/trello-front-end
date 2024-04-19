import React from 'react';
import { Button, List, Paper, styled, Typography } from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';
import { useQuery } from '@tanstack/react-query';

import { TaskList } from '../../../../types/TaskList';
import { TaskCard } from './TaskCard';
import tasksApi from '../../../../services/api/endpoints/tasks';
import { Task } from '../../../../types/Task';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#ebecf0',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  minWidth: '272px',
  height: '100%',

  borderRadius: '12px',
  color: '#44546f',
}));

interface TaskListItemProps {
  taskListItem: TaskList;
  tasks: Task[];
}

export function TaskListItem({ taskListItem: list, tasks }: TaskListItemProps) {
  return (
    <Droppable key={list.id} droppableId={list.id.toString()}>
      {(provided, snapshot) => (
        <Item elevation={4} ref={provided.innerRef}>
          <Typography variant="h6" gutterBottom>
            {list.name}
          </Typography>

          <List
            style={{
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

          <Button>+ Add a task</Button>
        </Item>
      )}
    </Droppable>
  );
}
