import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import {
  DefaultError,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import './Home.scss';
import TaskView from './elements/TaskView/TaskView';
import boardsApi from '../../services/api/endpoints/boards';
import taskListsApi from '../../services/api/endpoints/task-lists';
import tasksApi from '../../services/api/endpoints/tasks';
import { TaskList } from '../../types/TaskList';
import { TaskListItem } from './elements/TaskListItem';
import { useTaskStore } from '../../store/boards/tasks/task.store';
import { IUser } from '../../types/User';
import usersApi, { IUserResponse } from '../../services/api/endpoints/users';
import { Task } from '../../types/Task';

const drawerWidth = 240;

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
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<
    number | undefined
  >(undefined);

  const { taskModalSettings, setTaskModalSettings } = useTaskStore();

  const { data: boards = [] } = useQuery({
    queryKey: ['boards'],
    queryFn: () => boardsApi.getBoards(),
  });

  const { data: taskLists = [] } = useQuery({
    queryKey: ['taskLists', { selectedBoardId }],
    queryFn: () => taskListsApi.getAll(selectedBoardId),
    enabled: selectedBoardId > 0,
  });

  const { data: users = [] } = useQuery<
    IUser[],
    DefaultError,
    IUser[],
    [
      'users',
      {
        boardId: number;
      },
    ]
  >({
    queryKey: ['users', { boardId: selectedBoardId }],
    queryFn: () =>
      usersApi.listSimple({
        filter: {
          field: 'tasks.taskList.boardId',
          operator: 'eq',
          value: selectedBoardId,
        },
        join: [
          {
            field: 'tasks',
            select: ['id'],
          },
          {
            field: 'tasks.taskList',
            select: ['id'],
          },
          {
            field: 'photo',
          },
        ],
        sort: [
          {
            field: 'firstName',
            order: 'ASC',
          },
          {
            field: 'lastName',
            order: 'ASC',
          },
        ],
      }),
    enabled: selectedBoardId > 0,
  });
  const { data: tasks = [] } = useQuery({
    queryKey: [
      'tasks',
      { boardId: selectedBoardId, assigneeId: selectedAssigneeId },
    ],
    queryFn: () =>
      tasksApi.list({
        filter: [
          {
            field: 'boardId',
            operator: 'eq',
            value: selectedBoardId,
          },
          ...(selectedAssigneeId
            ? [
                {
                  field: 'assigneeId',
                  operator: 'eq',
                  value: selectedAssigneeId,
                },
              ]
            : []),
        ],
        join: [
          {
            field: 'assignee',
          },
          {
            field: 'assignee.photo',
          },
        ],
      }),
    enabled: selectedBoardId > 0,
  });

  const tasksByTaskListIdMap = useMemo(() => {
    const map = new Map<number, Task[]>();

    tasks?.forEach((task) => {
      if (map.has(task.taskListId)) {
        map.get(task.taskListId)?.push(task);
      } else {
        map.set(task.taskListId, [task]);
      }
    });

    return map;
  }, [tasks]);

  const { mutate: taskUpdateMutate } = useMutation({
    mutationKey: ['taskLists', { selectedBoardId }],
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

  const handleBoardClick = (id: number) => {
    setSelectedBoardId(id);
  };

  const toggleSelectedAssigneeId = (id: number) => {
    setSelectedAssigneeId((prev) => (prev === id ? undefined : id));
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    const task = tasks.find((task) => task.id === +result.draggableId);

    if (!task) {
      return;
    }

    taskUpdateMutate({
      id: task.id,
      taskListId: Number(destination.droppableId),
    });

    queryClient.setQueryData(
      ['tasks', { boardId: selectedBoardId, assigneeId: selectedAssigneeId }],
      (oldData: Task[]) => {
        const newTaskLists = [...oldData];
        const taskIndex = newTaskLists.findIndex((t) => t.id === task.id);
        newTaskLists[taskIndex] = {
          ...task,
          taskListId: Number(destination.droppableId),
        };

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
          <AvatarGroup
            total={users.length}
            max={4}
            slotProps={{
              additionalAvatar: {
                sx: { width: 36, height: 36 },
              },
            }}
          >
            {users.map((assignee) => (
              <Avatar
                key={assignee.id}
                sx={{
                  width: 36,
                  height: 36,
                  cursor: 'pointer',
                  ':hover': { opacity: 0.8 },
                  opacity:
                    selectedAssigneeId && selectedAssigneeId !== assignee.id
                      ? 0.8
                      : 1,
                }}
                onClick={() => toggleSelectedAssigneeId(assignee.id)}
                alt={assignee.firstName + ' ' + assignee.lastName}
                src={assignee.photo?.path}
              >
                {assignee.firstName[0] + assignee.lastName[0]}
              </Avatar>
            ))}
          </AvatarGroup>
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
              <ListItemButton
                selected={selectedBoardId === id}
                onClick={() => handleBoardClick(id)}
              >
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
              {taskLists.map((taskListItem) => (
                <TaskListItem
                  key={taskListItem.id}
                  taskListItem={taskListItem}
                  tasks={tasksByTaskListIdMap.get(taskListItem.id) ?? []}
                />
              ))}
            </DragDropContext>
          </Stack>
        </Main>
        {taskModalSettings.taskId && (
          <TaskView
            open={taskModalSettings.isOpen}
            taskId={taskModalSettings.taskId}
            onClose={() =>
              setTaskModalSettings({
                isOpen: false,
                taskId: null,
              })
            }
          />
        )}
      </Container>
    </>
  );
}
