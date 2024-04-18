import React, { Dispatch } from 'react';
import {
  Box,
  Button,
  Drawer,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IUser } from '../../../types/User';
import { formatDate } from '../../../utils/formatDate';
import { UpdateUserPayload } from '../../../services/api/endpoints/users';
import schema from '../validations/editUserValidation';
import usersApi from '../../../services/api/endpoints/users';

interface UserDetailsProps {
  isOpen: boolean;
  setIsOpen: Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      user: IUser | null;
      mode: 'view' | 'edit';
    }>
  >;
  user: IUser;
  mode: 'view' | 'edit';
}

export default function UserDetails({
  isOpen,
  user,
  setIsOpen,
  mode,
}: UserDetailsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserPayload>({
    resolver: yupResolver<UpdateUserPayload>(schema),
  });
  const queryClient = useQueryClient();

  const { mutate: updateUserMutate } = useMutation({
    mutationFn: (data: UpdateUserPayload) => usersApi.update(user.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
      handleClose();
      reset();
    },
  });

  const handleClose = () => {
    setIsOpen({
      isOpen: false,
      user: null,
      mode: 'view',
    });
  };

  const onSubmit = (data: UpdateUserPayload) => {
    updateUserMutate(data);
  };

  return (
    <Drawer open={isOpen} onClose={() => handleClose()} anchor="right">
      <Box
        component="form"
        autoComplete="off"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          margin: [2, 2, 2, 2],
          width: 300,
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography variant="h4" gutterBottom>
          User Details
        </Typography>
        <Grid
          container
          spacing={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Grid item>
            {mode === 'edit' ? (
              <TextField
                error={!!errors.firstName}
                {...register('firstName', {
                  required: 'First name is required',
                  value: user.firstName,
                })}
                helperText={errors.firstName?.message}
                fullWidth
                label="First Name"
                variant="outlined"
              />
            ) : (
              <Typography>First Name: {user.firstName}</Typography>
            )}
          </Grid>
          <Grid item>
            {mode === 'edit' ? (
              <TextField
                error={!!errors.lastName}
                {...register('lastName', {
                  required: 'Last name is required',
                  value: user.lastName,
                })}
                helperText={errors.lastName?.message}
                fullWidth
                label="Last Name"
                variant="outlined"
              />
            ) : (
              <Typography>Last Name: {user.lastName}</Typography>
            )}
          </Grid>
          <Grid item>
            {mode === 'edit' ? (
              <TextField
                error={!!errors.email}
                {...register('email', {
                  required: 'Email is required',
                  value: user.email,
                })}
                helperText={errors.email?.message}
                fullWidth
                label="Email"
                variant="outlined"
              />
            ) : (
              <Typography>Email: {user.email}</Typography>
            )}
          </Grid>
          <Grid item>
            {mode === 'edit' ? (
              <TextField
                fullWidth
                label="Status"
                value={user.status.name}
                variant="outlined"
              />
            ) : (
              <Typography>Status: {user.status.name}</Typography>
            )}
          </Grid>
          <Grid item>
            {mode === 'edit' ? (
              <TextField
                fullWidth
                label="Role"
                value={user.role.name}
                variant="outlined"
              />
            ) : (
              <Typography>Role: {user.role.name}</Typography>
            )}
          </Grid>
          <Grid item>
            <Typography>
              Created at:{' '}
              {formatDate(new Date(user.createdAt), 'StandardWithHours')}
            </Typography>
          </Grid>
          {mode === 'edit' && (
            <Grid item>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </Drawer>
  );
}
