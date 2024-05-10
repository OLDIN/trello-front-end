import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Board } from 'types/Board';
import { useBoardStore } from 'store/boards/board.store';

import { drawerWidth } from '../../constants/drawer.constants';
import { CreateBoardPopover } from './elements/CreateBoardPopover';
import { MenuDivider } from './styles';
import { DrawerHeader, DrawerListItemButton } from 'pages/Home/styles';

import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardCustomize from '@mui/icons-material/DashboardCustomize';
import MailIcon from '@mui/icons-material/Mail';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';

interface LeftMenuProps {
  boards: Board[];
  open: boolean;
  onClose: () => void;
}

export function LeftMenu({ boards, open, onClose }: LeftMenuProps) {
  const theme = useTheme();
  const {
    setSelectedBoardBackgroundImagePath,
    setSelectedBoard,
    selectedBoard,
  } = useBoardStore();
  const navigate = useNavigate();
  const [isOpenedBoardCreation, setIsOpenedBoardCreation] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleBoardClick = (board: Board) => {
    setSelectedBoard(board);
    setSelectedBoardBackgroundImagePath(board.backgroundImage?.path ?? null);
    navigate(`/boards/${board.id}`);
  };

  const handleCreateBoard = () => {
    setIsOpenedBoardCreation(true);
  };

  return (
    <>
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
        ref={drawerRef}
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={onClose}>
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
        <MenuDivider>
          <Typography
            variant="body1"
            component="span"
            fontWeight="fontWeightBold"
            sx={{ paddingLeft: '10px' }}
          >
            Your boards
          </Typography>
          <Box>
            <IconButton>
              <MoreHorizIcon />
            </IconButton>
            <IconButton onClick={handleCreateBoard}>
              <AddIcon />
            </IconButton>
          </Box>
        </MenuDivider>
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
      <CreateBoardPopover
        open={isOpenedBoardCreation}
        onClose={() => setIsOpenedBoardCreation(false)}
        anchorEl={drawerRef.current}
      />
    </>
  );
}
