import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  styled,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import DashboardCustomize from '@mui/icons-material/DashboardCustomize';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Droppable,
  Draggable,
  DragDropContext,
  DropResult,
} from 'react-beautiful-dnd';

import './Home.scss';
import TaskView from './TaskView/TaskView';
import boardsApi from '../../services/api/endpoints/boards';
import taskListsApi from '../../services/api/endpoints/task-lists';
import tasksApi from '../../services/api/endpoints/tasks';
import { TaskList } from '../../types/TaskList';
import { type Task } from '../../types/Task';

const drawerWidth = 240;

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

const Task = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#ffffff',
  borderRadius: '8px',
  boxShadow: '0px 1px 1px #091e4240, 0px 0px 1px #091e424f',
  minHeight: '36px',
  cursor: 'pointer',
  color: '#172b4d',
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  position: 'relative',
  marginTop: '68px',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
  marginTop: '68px',
}));

export default function Home() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [selectedBoardId, setSelectedBoardId] = useState<number>(0);
  const queryClient = useQueryClient();

  const [taskModalSettings, setTaskModalSettings] = useState<
    | {
        open: false;
        taskId: null;
      }
    | {
        open: true;
        taskId: number;
      }
  >({
    open: false,
    taskId: null,
  });

  const { data: boards = [] } = useQuery({
    queryKey: ['boards'],
    queryFn: () => boardsApi.getBoards(),
  });

  const { data: taskLists = [] } = useQuery({
    queryKey: ['taskLists', selectedBoardId],
    queryFn: () => taskListsApi.getAll(selectedBoardId),
    enabled: !!selectedBoardId,
  });

  const { mutate: taskUpdateMutate } = useMutation({
    mutationKey: ['taskLists', selectedBoardId],
    mutationFn: tasksApi.partialUpdate,
  });

  useEffect(() => {
    if (boards.length) {
      setSelectedBoardId(boards[0].id);
    }
  }, [boards]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    const task = taskLists.find(
      (list) => list.id === Number(source.droppableId),
    )?.tasks?.[source.index];

    console.log('drag end result = ', result, { task });

    if (!task) {
      return;
    }

    taskUpdateMutate({
      id: task.id,
      taskListId: Number(destination.droppableId),
    });

    queryClient.setQueryData(
      ['taskLists', selectedBoardId],
      (oldData: TaskList[]) => {
        const newTaskLists = [...oldData];
        const sourceList = newTaskLists.find(
          (list) => list.id === +source.droppableId,
        );
        const destinationList = newTaskLists.find(
          (list) => list.id === +destination.droppableId,
        );

        const [removed] = sourceList?.tasks?.splice(source.index, 1) ?? [];
        destinationList?.tasks.splice(destination.index, 0, removed);

        return newTaskLists;
      },
    );
  };

  return (
    <>
      <AppBar open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Persistent drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider textAlign="left">Your Boards</Divider>
        <List>
          {boards.map(({ id, name }) => (
            <ListItem key={id} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <DashboardCustomize />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Container maxWidth="lg" style={{ marginTop: 20 }}>
        <Main open={open}>
          <Stack
            direction="row"
            spacing={2}
            style={{ overflow: 'scroll', minHeight: '100vh' }}
          >
            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
              {taskLists.map((list) => (
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
                        {list.tasks &&
                          list.tasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <Task
                                  ref={provided.innerRef}
                                  key={task.id}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() =>
                                    setTaskModalSettings({
                                      open: true,
                                      taskId: task.id,
                                    })
                                  }
                                >
                                  {task.name}
                                </Task>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </List>

                      <Button>+ Add a task</Button>
                    </Item>
                  )}
                </Droppable>
              ))}
            </DragDropContext>
          </Stack>
        </Main>
        {taskModalSettings.taskId && (
          <TaskView
            open={taskModalSettings.open}
            taskId={taskModalSettings.taskId}
            onClose={() =>
              setTaskModalSettings({
                open: false,
                taskId: null,
              })
            }
          />
        )}
      </Container>
    </>
  );
}
