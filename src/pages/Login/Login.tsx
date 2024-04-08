import React from 'react';
import {
  Button,
  CssBaseline,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from '@mui/material';
import { Sheet, Typography } from '@mui/joy';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from './validation';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const auth = useAuth();

  const onSubmit = async (data: unknown) => {
    console.log(data);

    const { data: loginData } = await api.auth.login(data);

    console.log(loginData);

    auth.setToken(loginData.token);
    auth.setUser(loginData.user);
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
          <Button type="submit" sx={{ mt: 1 /* margin top */ }}>
            Log in
          </Button>
        </form>
        <Typography
          endDecorator={<Link to="/sign-up">Sign up</Link>}
          fontSize="sm"
          sx={{ alignSelf: 'center' }}
        >
          Don&apos;t have an account?
        </Typography>
      </Sheet>
    </main>
  );
}
