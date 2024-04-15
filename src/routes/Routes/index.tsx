import React from 'react';

import { CircularProgress, Grid } from '@mui/material';
import { Container } from '@mui/system';
import { Route, Routes } from 'react-router-dom';
import Home from '../../pages/Home/Home';
import NotFound from '../../pages/NotFound/NotFound';
import Login from '../../pages/Login/Login';
import Registration from '../../pages/Registration/Registration';
import { Users } from '../../pages/Users/Users';
import { Profile } from '../../pages/Profile/Profile';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
import GuestRoute from '../components/GuestRoute/GuestRoute';
import ConfirmEmail from '../../pages/ConfirmEmail/ConfirmEmail';
import useAuth from '../../hooks/useAuth';

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
