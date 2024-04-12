import React, { useState } from 'react';
import {
  Button,
  CssBaseline,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from '@mui/material';
import { Link, Sheet, Typography } from '@mui/joy';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import schema from './validation';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

export default function Registration() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm({
    // resolver: yupResolver(schema),
  });
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const onSubmit = async (data: unknown) => {
    try {
      setIsLoading(true);
      await api.auth.registration(data);
      const { user, token, refreshToken } = await api.auth.login(data);
      auth.setToken({
        token,
        refreshToken,
      });
      queryClient.setQueryData(['me'], user);
    } catch (e: any) {
      if (e.response.status === 422) {
        Object.keys(e.response.data.errors).forEach((key) => {
          setError(key, {
            type: 'manual',
            message: e.response.data.errors[key],
          });
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <CssBaseline />
      <Sheet
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
        variant="outlined"
      >
        <div>
          <Typography level="h4" component="h1">
            <b>Welcome!</b>
          </Typography>
          <Typography level="body-sm">Sign in to continue.</Typography>
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

          <FormControl>
            <FormLabel>First name</FormLabel>
            <Input
              // html input attribute
              type="text"
              placeholder="First Name"
              {...register('firstName', { required: true })}
            />
            {errors.firstName && (
              <FormHelperText id="my-helper-text">
                {errors.firstName?.message?.toString()}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>Last name</FormLabel>
            <Input
              // html input attribute
              type="text"
              placeholder="last name"
              {...register('lastName', { required: true })}
            />
            {errors.lastName && (
              <FormHelperText id="my-helper-text">
                {errors.lastName?.message?.toString()}
              </FormHelperText>
            )}
          </FormControl>
          <Button type="submit" sx={{ mt: 1 /* margin top */ }}>
            Register
          </Button>
        </form>
      </Sheet>
    </main>
  );
}
