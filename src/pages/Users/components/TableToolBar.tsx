import React, { useState } from 'react';
import { Box, Button, Drawer, TextField } from '@mui/material';
import { GridToolbarContainer } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import schema from '../addUserValidation';
import usersApi, {
  type CreateUserPayload,
} from '../../../services/api/endpoints/users';

export default function EditToolbar() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserPayload>({
    resolver: yupResolver<CreateUserPayload>(schema),
  });
  const { mutate: createUserMutate } = useMutation({
    mutationFn: (data: CreateUserPayload) => usersApi.create(data),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['users'],
      });
      setOpen(false);
      reset();
    },
  });

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);

    if (!newOpen) {
      reset();
    }
  };

  const onSubmit = (data: CreateUserPayload) => {
    createUserMutate(data);
  };

  return (
    <>
      <GridToolbarContainer>
        <Button
          color="primary"
          startIcon={<AddIcon />}
          onClick={toggleDrawer(true)}
        >
          Add User
        </Button>
      </GridToolbarContainer>
      <Drawer open={open} onClose={toggleDrawer(false)}>
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
          <TextField
            error={!!errors.firstName}
            {...register('firstName', { required: 'First name is required' })}
            helperText={errors.firstName?.message}
            margin="normal"
            fullWidth
            label="First Name"
          ></TextField>
          <TextField
            error={!!errors.lastName}
            {...register('lastName', { required: 'Last name is required' })}
            helperText={errors.lastName?.message}
            margin="normal"
            fullWidth
            label="Last Name"
          ></TextField>
          <TextField
            error={!!errors.email}
            {...register('email', { required: 'Email is required' })}
            helperText={errors.email?.message}
            margin="normal"
            fullWidth
            label="Email"
            type="email"
          ></TextField>
          <TextField
            error={!!errors.password}
            {...register('password', { required: 'Password is required' })}
            helperText={errors.password?.message}
            margin="normal"
            fullWidth
            label="Password"
            type="password"
          ></TextField>
          <Button type="submit" sx={{ mt: 1 /* margin top */ }}>
            Create
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
