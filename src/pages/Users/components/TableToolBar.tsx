import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import usersApi, {
  type CreateUserPayload,
} from '../../../services/api/endpoints/users';
import { QueryKey } from 'enums/QueryKey.enum';

import useFileUpload from '../../../hooks/useFileUpload/useFileUpload';

import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Drawer, TextField } from '@mui/material';
import { GridToolbarContainer } from '@mui/x-data-grid';

import schema from '../validations/addUserValidation';

interface CreateUserPayloadForm
  extends Pick<
    CreateUserPayload,
    'email' | 'firstName' | 'lastName' | 'password'
  > {
  avatar: FileList;
}

export default function EditToolbar() {
  const [open, setOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png',
  );
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserPayloadForm>({
    resolver: yupResolver<CreateUserPayloadForm>(schema),
  });

  const { mutateAsync: uploadPhotoMutate } = useFileUpload();
  const { mutate: createUserMutate } = useMutation({
    mutationFn: (data: CreateUserPayload) => usersApi.create(data),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [QueryKey.USERS],
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

  const onSubmit = async (data: CreateUserPayloadForm) => {
    if (data.avatar.length > 0) {
      const formData = new FormData();
      formData.set('file', data.avatar[0]);
      const { file } = await uploadPhotoMutate(formData);

      if (file) {
        createUserMutate({
          ...data,
          photo: {
            id: file.id,
          },
        });
        return;
      }
    }

    createUserMutate(data);
  };

  const handleAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const file = 'files' in e.target ? e.target.files?.[0] : null;

    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
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
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
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
            type="file"
            error={!!errors.avatar}
            {...register('avatar')}
            helperText={errors.avatar?.message}
            fullWidth
            label="Avatar"
            variant="outlined"
            onChange={(e) => handleAvatarChange(e)}
            InputProps={{
              startAdornment: (
                <img
                  src={avatarPreview}
                  alt="avatar"
                  style={{ width: 30, height: 30, marginRight: 10 }}
                />
              ),
            }}
          />
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
