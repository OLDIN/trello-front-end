import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Divider,
  Drawer,
  Grid,
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
import { useQuery } from '@tanstack/react-query';

import './Home.scss';
import TaskView from './TaskView/TaskView';
import boardsApi from '../../services/api/endpoints/boards';
import taskListsApi from '../../services/api/endpoints/task-lists';

const drawerWidth = 240;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#ebecf0',
  ...theme.typography.body2,
  // display: 'flex',
  // flexDirection: 'column',
  // rowGap: '8px',
  padding: theme.spacing(1),
  textAlign: 'center',
  // color: theme.palette.text.secondary,
  minWidth: '272px',
  height: '100%',

  // background-color: var(--accent-background, var(--tr-background-list, #ebecf0));
  borderRadius: '12px',
  // box-shadow: var(--ds-shadow-raised, 0px 1px 1px #091e4240, 0px 0px 1px #091e424f);
  color: '#44546f',
  // display: flex;
  // justify-content: space-between;
  // max-height: 100%;
  // flex-direction: column;
  // flex-grow: 0;
  // flex-shrink: 0;
  // flex-basis: 272px;
  // align-self: start;
  // padding-bottom: 8px;
  // position: relative;
  // scroll-margin: 8px;
  // white-space: normal;
  // width: 272px;
  // box-sizing: border-box;
  // vertical-align: top;
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
            {taskLists.map((list) => (
              <Item key={list.id} elevation={4}>
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
                    list.tasks.map((task) => (
                      <Task
                        key={task.id}
                        onClick={() =>
                          setTaskModalSettings({
                            open: true,
                            taskId: task.id,
                          })
                        }
                      >
                        {task.name}
                      </Task>
                    ))}
                </List>

                <Button>+ Add a task</Button>
              </Item>
            ))}
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
