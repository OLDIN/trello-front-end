import React, { useEffect, useMemo, useState } from 'react';
import {
  alpha,
  Avatar,
  AvatarGroup,
  Box,
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
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';

import './Home.scss';
import TaskView from './elements/TaskView/TaskView';
import boardsApi from '../../services/api/endpoints/boards';
import taskListsApi from '../../services/api/endpoints/task-lists';
import tasksApi from '../../services/api/endpoints/tasks';
import { TaskListItem } from './elements/TaskListItem';
import { useTaskStore } from '../../store/boards/tasks/task.store';
import { IUser } from '../../types/User';
import usersApi from '../../services/api/endpoints/users';
import { Task } from '../../types/Task';
import { Board } from '../../types/Board';
import { useBoardStore } from '../../store/boards/board.store';

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
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Home() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const queryClient = useQueryClient();
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<
    number | undefined
  >(undefined);

  const { taskModalSettings, setTaskModalSettings } = useTaskStore();
  const { setSelectedBoardBackgroundImagePath } = useBoardStore();

  const { data: boards = [] } = useQuery({
    queryKey: ['boards'],
    queryFn: () =>
      boardsApi.getBoards({
        join: [
          {
            field: 'backgroundImage',
          },
        ],
      }),
  });

  const { data: taskLists = [] } = useQuery({
    queryKey: ['taskLists', { boardId: selectedBoard?.id }],
    // FIXME: drop [as number]
    queryFn: () => taskListsApi.getAll(selectedBoard?.id ?? 0),
    enabled: !!selectedBoard?.id,
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
    // FIXME: drop [as number]
    queryKey: ['users', { boardId: selectedBoard?.id ?? 0 }],
    queryFn: () =>
      usersApi.listSimple({
        filter: {
          field: 'tasks.taskList.boardId',
          operator: 'eq',
          value: selectedBoard?.id,
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
    enabled: !!selectedBoard?.id,
  });
  const { data: tasks = [] } = useQuery({
    queryKey: [
      'tasks',
      { boardId: selectedBoard?.id, assigneeId: selectedAssigneeId },
    ],
    queryFn: () =>
      tasksApi.list({
        filter: [
          {
            field: 'boardId',
            operator: 'eq',
            value: selectedBoard?.id,
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
          {
            field: 'cover',
          },
          {
            field: 'attachments',
          },
          {
            field: 'comments',
          },
        ],
      }),
    enabled: !!selectedBoard?.id,
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
    mutationKey: ['taskLists', { boardId: selectedBoard?.id }],
    mutationFn: tasksApi.partialUpdate,
  });

  useEffect(() => {
    if (boards.length) {
      setSelectedBoard(boards[0]);

      setSelectedBoardBackgroundImagePath(
        boards[0].backgroundImage?.path ?? null,
      );
    }
  }, [boards]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleBoardClick = (board: Board) => {
    setSelectedBoard(board);
    setSelectedBoardBackgroundImagePath(board.backgroundImage?.path ?? null);
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
      ['tasks', { boardId: selectedBoard?.id, assigneeId: selectedAssigneeId }],
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
    <Box>
      <AppBar open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
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
              {selectedBoard?.name ?? 'Select a board'}
            </Typography>
            <AvatarGroup
              total={users.length}
              max={4}
              slotProps={{
                additionalAvatar: {
                  sx: { width: 36, height: 36 },
                },
              }}
              sx={{ marginLeft: 3 }}
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
          </Box>
          <Box>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '68.5px',
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
          {boards.map((board) => (
            <ListItem key={board.id} disablePadding>
              <ListItemButton
                selected={selectedBoard?.id === board.id}
                onClick={() => handleBoardClick(board)}
              >
                <ListItemIcon>
                  <DashboardCustomize />
                </ListItemIcon>
                <ListItemText primary={board.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      {/* <Container maxWidth={false} style={{ marginTop: 20 }}> */}
      <Main open={open} sx={{ marginLeft: open ? '240px' : 0 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ paddingBottom: '8px' }}
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
          {/* <Paper>+ Add another list</Paper> */}
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
      {/* </Container> */}
    </Box>
  );
}
