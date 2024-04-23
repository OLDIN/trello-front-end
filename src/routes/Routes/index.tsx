import React from 'react';
import { Route, Routes } from 'react-router-dom';

import GuestRoute from '../components/GuestRoute/GuestRoute';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';

import useAuth from '../../hooks/useAuth';

import { CircularProgress, Grid } from '@mui/material';
import { Container } from '@mui/system';

import ConfirmEmail from '../../pages/ConfirmEmail/ConfirmEmail';
import Home from '../../pages/Home/Home';
import Login from '../../pages/Login/Login';
import NotFound from '../../pages/NotFound/NotFound';
import { Profile } from '../../pages/Profile/Profile';
import Registration from '../../pages/Registration/Registration';
import { Users } from '../../pages/Users/Users';

export default function Routers() {
  const { isLoaded } = useAuth();

  return isLoaded ? (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/confirm-email" element={<ConfirmEmail />} />
      {/* Guest routes */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Registration />} />
      </Route>
      {/* Admin routes */}
      <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
        <Route path="/users" element={<Users />} />
      </Route>
      {/* User routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/boards" element={<Home />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/boards/:boardId" element={<Home />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/boards/:boardId/tasks/:taskId" element={<Home />} />
      </Route>

      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  ) : (
    <Container maxWidth="md">
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <Grid item>
          <CircularProgress color="inherit" />
        </Grid>
      </Grid>
    </Container>
  );
}
