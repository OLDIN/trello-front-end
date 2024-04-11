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

export default function Routers() {
  const auth = {
    isLoaded: true,
  };

  return auth.isLoaded ? (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Registration />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/users" element={<Users />} />
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
