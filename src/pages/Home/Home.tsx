import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import tasksApi, { IPartialUpdateTask } from 'services/api/endpoints/tasks';
import { QueryKey } from 'enums/QueryKey.enum';
import { Board } from 'types/Board';
import { ITask } from 'types/Task';
import { useBoardStore } from 'store/boards/board.store';
import { useTaskStore } from 'store/boards/tasks/task.store';

import { useBoards, useTaskLists } from './hooks';
import { useTasks } from './hooks/useTasks';
import { useUsers } from './hooks/useUsers';
import { drawerWidth } from './constants/drawer.constants';
import { AddAnotherListBlock } from './elements/AddAnotherListBlock/AddAnotherListBlock';
import { TaskListItem } from './elements/TaskListItem';
import { TaskView } from './elements/TaskView';
import {
  AppBar,
  Divider,
  DrawerHeader,
  DrawerListItemButton,
  Main,
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from './styles';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardCustomize from '@mui/icons-material/DashboardCustomize';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar,
  AvatarGroup,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';

import './Home.scss';

export default function Home() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { boardId, taskId } = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<
    number | undefined
  >(undefined);

  const { taskModalSettings, setTaskModalSettings } = useTaskStore();
  const {
    setSelectedBoardBackgroundImagePath,
    setSelectedBoard,
    selectedBoard,
  } = useBoardStore();

  const { data: boards = [] } = useBoards();
  const { data: taskLists = [] } = useTaskLists({
    boardId: selectedBoard?.id ?? 0,
  });
  const { data: users = [] } = useUsers({
    boardId: selectedBoard?.id ?? 0,
  });
  const { data: tasks = [] } = useTasks({
    boardId: selectedBoard?.id ?? 0,
    assigneeId: selectedAssigneeId,
  });
  const { mutate: taskUpdateMutate } = useMutation({
    mutationFn: ({ id, ...data }: IPartialUpdateTask & { id: number }) =>
      tasksApi.partialUpdate(id, data),
  });

  const tasksByTaskListIdMap = useMemo(() => {
    const map = new Map<number, ITask[]>();

    tasks?.forEach((task) => {
      if (map.has(task.taskListId)) {
        map.get(task.taskListId)?.push(task);
      } else {
        map.set(task.taskListId, [task]);
      }
    });

    return map;
  }, [tasks]);

  useEffect(() => {
    if (boards.length) {
      setSelectedBoard(boards[0]);

      setSelectedBoardBackgroundImagePath(
        boards[0].backgroundImage?.path ?? null,
      );
    }
  }, [boards, setSelectedBoard, setSelectedBoardBackgroundImagePath]);

  useEffect(() => {
    if (boards.length && boardId) {
      const board = boards.find((b) => b.id === parseInt(boardId));

      if (board) {
        setSelectedBoard(board);
        setSelectedBoardBackgroundImagePath(
          board.backgroundImage?.path ?? null,
        );
        document.title = `${board.name} | Trello`;
      }
    } else if (boards.length && !boardId) {
      setSelectedBoard(boards[0]);
      setSelectedBoardBackgroundImagePath(
        boards[0].backgroundImage?.path ?? null,
      );
      navigate(`/boards/${boards[0].id}`);
      document.title = `${boards[0].name} | Trello`;
    }
  }, [
    boardId,
    boards,
    navigate,
    setSelectedBoard,
    setSelectedBoardBackgroundImagePath,
  ]);

  useEffect(() => {
    if (taskId) {
      setTaskModalSettings({
        isOpen: true,
        taskId: parseInt(taskId),
      });
    }
  }, [setTaskModalSettings, taskId]);

  useEffect(() => {
    if (taskId) {
      const task = tasks.find((t) => t.id === parseInt(taskId));

      if (task && selectedBoard) {
        document.title = `${task?.name} on ${selectedBoard?.name} | Trello`;
      } else if (selectedBoard?.name) {
        document.title = `${selectedBoard?.name} | Trello`;
      }
    }
  }, [selectedBoard, taskId, tasks]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleBoardClick = (board: Board) => {
    setSelectedBoard(board);
    setSelectedBoardBackgroundImagePath(board.backgroundImage?.path ?? null);
    navigate(`/boards/${board.id}`);
  };

  const toggleSelectedAssigneeId = (id: number) => {
    setSelectedAssigneeId((prev) => (prev === id ? undefined : id));
  };

  const onDragEnd = ({ destination, draggableId }: DropResult) => {
    // dropped outside the list
    if (!destination) {
      return;
    }

    const task = tasks.find((task) => task.id === +draggableId);

    if (!task) {
      return;
    }

    taskUpdateMutate({
      id: task.id,
      taskListId: Number(destination.droppableId),
    });

    queryClient.setQueryData(
      [
        QueryKey.GET_TASKS_LIST,
        { boardId: selectedBoard?.id, assigneeId: selectedAssigneeId },
      ],
      (oldData: ITask[]) => {
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

  const handleTaskViewClose = () => {
    setTaskModalSettings({
      isOpen: false,
      taskId: null,
    });
    navigate(`/boards/${boardId}`);
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
            backgroundColor: 'hsla(52,6.8%,34.6%,0.9)',
            color: '#FFFFFF',
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
              <DrawerListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </DrawerListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider textAlign="left">Your Boards</Divider>
        <List>
          {boards.map((board) => (
            <ListItem key={board.id} disablePadding>
              <DrawerListItemButton
                selected={selectedBoard?.id === board.id}
                onClick={() => handleBoardClick(board)}
              >
                <ListItemIcon>
                  <DashboardCustomize />
                </ListItemIcon>
                <ListItemText primary={board.name} />
              </DrawerListItemButton>
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
          <AddAnotherListBlock />
        </Stack>
      </Main>
      {taskModalSettings.taskId && (
        <TaskView
          open={taskModalSettings.isOpen}
          taskId={taskModalSettings.taskId}
          onClose={() => handleTaskViewClose()}
          boardId={selectedBoard?.id ?? 0}
        />
      )}
      {/* </Container> */}
    </Box>
  );
}
