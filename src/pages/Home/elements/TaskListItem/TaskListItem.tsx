import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useQuery } from '@tanstack/react-query';

import tasksApi from '../../../../services/api/endpoints/tasks';

import { Task } from '../../../../types/Task';
import { TaskList } from '../../../../types/TaskList';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Box,
  Button,
  IconButton,
  List,
  Paper,
  styled,
  Typography,
} from '@mui/material';

import { TaskCard } from './TaskCard';

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

const ItemName = styled(Typography)`
  display: block;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  margin: 0;
  padding: 6px 8px 6px 12px;
  background-color: transparent;
  overflow: hidden;
  overflow-wrap: anywhere;
  white-space: normal;
  cursor: pointer;
`;

interface TaskListItemProps {
  taskListItem: TaskList;
  tasks: Task[];
}

export function TaskListItem({ taskListItem: list, tasks }: TaskListItemProps) {
  return (
    <Droppable key={list.id} droppableId={list.id.toString()}>
      {(provided, snapshot) => (
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
            <IconButton>
              <MoreHorizIcon />
            </IconButton>
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
