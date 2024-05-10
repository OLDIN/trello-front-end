import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import tasksApi, { IPartialUpdateTask } from 'services/api/endpoints/tasks';
import { QueryKey } from 'enums/QueryKey.enum';
import { ITask } from 'types/Task';
import { useBoardStore } from 'store/boards/board.store';
import { useTaskStore } from 'store/boards/tasks/task.store';

import { useBoards, useTaskLists } from './hooks';
import { useTasks } from './hooks/useTasks';
import { useUsers } from './hooks/useUsers';
import { AddAnotherListBlock } from './elements/AddAnotherListBlock/AddAnotherListBlock';
import { LeftMenu } from './elements/LeftMenu';
import { TaskListItem } from './elements/TaskListItem';
import { TaskView } from './elements/TaskView';
import {
  AppBar,
  Main,
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from './styles';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

import './Home.scss';

export default function Home() {
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
        QueryKey.GET_TASKS,
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
      <LeftMenu boards={boards} onClose={() => setOpen(false)} open={open} />
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
