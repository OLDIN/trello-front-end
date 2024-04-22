import React, { Dispatch } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import usersApi, {
  UpdateUserPayload,
} from '../../../services/api/endpoints/users';

import useFileUpload from '../../../hooks/useFileUpload/useFileUpload';
import { formatDate } from '../../../utils/formatDate';
import { IUser } from '../../../types/User';

import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import schema from '../validations/editUserValidation';

import './UserDetails.scss';

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

type UpdateUserPayloadForm = Pick<
  UpdateUserPayload,
  'email' | 'firstName' | 'lastName'
> & {
  avatar: FileList;
};

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
  } = useForm<UpdateUserPayloadForm>({
    resolver: yupResolver<UpdateUserPayloadForm>(schema),
  });
  const queryClient = useQueryClient();
  const [avatarPreview, setAvatarPreview] = React.useState<string>(
    user.photo?.path ??
      'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png',
  );

  const { mutate: updateUserMutate, isPending: isPendingUpdateUser } =
    useMutation({
      mutationFn: (data: UpdateUserPayload) => usersApi.update(user.id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['users'],
        });
        handleClose();
        reset();
      },
    });
  const { mutateAsync: uploadPhotoMutate, isPending: isPendingUploadAvatar } =
    useFileUpload();

  const handleClose = () => {
    setIsOpen({
      isOpen: false,
      user: null,
      mode: 'view',
    });
  };

  const onSubmit = async (data: UpdateUserPayloadForm) => {
    // if photo is not selected then send the data without avatar
    if (data.avatar.length > 0) {
      const formData = new FormData();
      formData.set('file', data.avatar[0]);
      const { file } = await uploadPhotoMutate(formData);

      if (file) {
        updateUserMutate({
          ...data,
          photo: {
            id: file.id,
          },
        });
        return;
      }
    }

    updateUserMutate(data);
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
        <Typography className="Typography" variant="h4" gutterBottom>
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
            ) : (
              <Paper
                style={{
                  border: '2px solid',
                  height: '200px',
                  width: '200px',
                  margin: '0 auto',
                }}
              >
                <img
                  src={
                    user?.photo
                      ? user.photo.path
                      : 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png'
                  }
                  style={{ height: '100%', width: '100%' }}
                />
              </Paper>
            )}
          </Grid>
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
              <Typography className="Typography">
                <span>First Name: </span>
                {user.firstName}
              </Typography>
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
              <Typography className="Typography">
                <span>Last Name: </span>
                {user.lastName}
              </Typography>
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
              <Typography className="Typography">
                <span>Email: </span>
                {user.email}
              </Typography>
            )}
          </Grid>
          <Grid item>
            {mode === 'edit' ? (
              <TextField
                fullWidth
                label="Status"
                value={user.status?.name ?? 'No status'}
                variant="outlined"
                disabled={true}
              />
            ) : (
              <Typography className="Typography">
                <span>Status: </span>
                {user.status?.name ?? (
                  <span className="no-value">No status</span>
                )}
              </Typography>
            )}
          </Grid>
          <Grid item>
            {mode === 'edit' ? (
              <TextField
                fullWidth
                label="Role"
                value={user.role?.name ?? 'No role'}
                variant="outlined"
                disabled={true}
              />
            ) : (
              <Typography className="Typography">
                <span>Role: </span>
                {user.role?.name ?? <span className="no-value">No role</span>}
              </Typography>
            )}
          </Grid>
          <Grid item>
            <Typography className="Typography">
              <span>Created at: </span>
              {formatDate(new Date(user.createdAt), 'StandardWithHours')}
            </Typography>
          </Grid>
          {mode === 'edit' && (
            <Grid item>
              {isPendingUpdateUser || isPendingUploadAvatar ? (
                <IconButton
                  style={{ backgroundColor: '#594f8d', marginLeft: '1rem' }}
                >
                  <CircularProgress style={{ color: 'white' }} />
                </IconButton>
              ) : (
                <Button type="submit" variant="contained">
                  Save
                </Button>
              )}
            </Grid>
          )}
        </Grid>
      </Box>
    </Drawer>
  );
}
