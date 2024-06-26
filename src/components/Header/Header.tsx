import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import authApi from '../../services/api/endpoints/auth';
import { QueryKey } from 'enums/QueryKey.enum';

import useAuth from '../../hooks/useAuth';
import type { IProfile } from '../../types/Profile';

import MenuIcon from '@mui/icons-material/Menu';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import { styled } from '@mui/material';
import AppBarBase from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

interface IPage {
  title: string;
  to: string;
  allowed?: (profile: IProfile) => boolean;
}

const pages: IPage[] = [
  { title: 'Home', to: '/' },
  {
    title: 'Users',
    to: '/users',
    allowed: (profile) => profile?.role.name === 'Admin',
  },
];
const settings = [
  { title: 'Profile', to: '/profile' },
  { title: 'Logout', to: '/logout' },
];

const AppBar = styled(AppBarBase)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  position: 'fixed',
  top: 0,
}));

export default function Header() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { token, logOut } = useAuth();
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: [QueryKey.ME],
    queryFn: authApi.getProfile,
    enabled: !!token,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.ME],
      });
    }
  }, [queryClient, token]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleUserMenu = (to: string) => {
    if (to === '/logout') {
      logOut();
    } else if (to === '/profile') {
      navigate(to);
    }
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backdropFilter: 'blur(6px)',
        backgroundColor: 'hsl(52,6.8%,29.6%)',
        position: 'relative',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SpaceDashboardIcon
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Trello
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map(({ title }) => (
                <MenuItem key={title} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <SpaceDashboardIcon
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/home"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Trello
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages
              .filter(
                ({ allowed }) => (profile && allowed?.(profile)) || !allowed,
              )
              .map(({ title, to }) => (
                <Button
                  key={title}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  <Link to={to}>{title}</Link>
                </Button>
              ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {profile ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={profile?.firstName + ' ' + profile?.lastName}
                      src={
                        profile?.photo?.path ??
                        'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png'
                      }
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map(({ title, to }) => (
                    <MenuItem key={title} onClick={() => handleUserMenu(to)}>
                      <Typography textAlign="center">{title}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Button>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
