import React from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import api from '../../services/api';
import { QueryKey } from 'enums/QueryKey.enum';

import useAuth from '../../hooks/useAuth';

import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Typography,
} from '@mui/material';

import { setPersistUser } from '../../providers/AuthProvider/helpers';
import schema from './validation';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { setToken } = useAuth();
  const queryClient = useQueryClient();

  const onSubmit = async (data: unknown) => {
    const { token, refreshToken, user } = await api.auth.login(data);

    setToken({
      token,
      refreshToken,
    });
    queryClient.setQueryData([QueryKey.ME], user);
    setPersistUser(user);
  };

  return (
    <main>
      <CssBaseline />
      <Box
        sx={{
          width: 300,
          mx: 'auto', // margin left & right
          my: 4, // margin top & bottom
          py: 3, // padding top & bottom
          px: 2, // padding left & right
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 'sm',
          boxShadow: 'md',
        }}
        // variant="outlined"
      >
        <div>
          <Typography variant="h4" component="h1">
            <b>Welcome!</b>
          </Typography>
          <Typography variant="body1">Sign in to continue.</Typography>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              // html input attribute
              type="email"
              placeholder="johndoe@email.com"
              {...register('email', { required: true })}
            />
            {errors.email && (
              <FormHelperText id="my-helper-text">
                {errors.email?.message?.toString()}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              // html input attribute
              type="password"
              placeholder="password"
              {...register('password', { required: true })}
            />
            {errors.password && (
              <FormHelperText id="my-helper-text">
                {errors.password?.message?.toString()}
              </FormHelperText>
            )}
          </FormControl>
          <Button type="submit" sx={{ mt: 1 /* margin top */ }}>
            Log in
          </Button>
        </form>
        <Typography sx={{ alignSelf: 'center' }}>
          Don&apos;t have an account?
        </Typography>
        <Link to="/sign-up">Sign up</Link>
      </Box>
    </main>
  );
}
