import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Paper,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import schema from './editProfileValidation';
import authApi from '../../services/api/endpoints/auth';
import useProfileUpdate from './hooks/useProfileUpdate';
import useFileUpload from '../../hooks/useFileUpload/useFileUpload';
import { IProfile } from '../../types/Profile';

interface IProfilePayload {
  firstName: string;
  lastName: string;
  avatar: FileList;
}

export function Profile() {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [url, setUrl] = useState();
  const { data: profile } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.getProfile,
  });
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IProfilePayload>({
    // resolver: yupResolver<IProfile>(schema),
    defaultValues: {
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      avatar: undefined,
    },
  });
  const { mutate, isPending } = useProfileUpdate({
    onSuccess: (data) => {
      setMode('view');
      queryClient.setQueryData<unknown, ['me'], IProfile>(['me'], data);
    },
  });
  const { mutateAsync: uploadPhotoMutate } = useFileUpload({
    onSuccess: ({ file }) => {
      console.log('file on success', file);
      queryClient.setQueryData<unknown, ['me'], IProfile>(
        ['me'],
        (savedProfile) => {
          if (savedProfile) {
            savedProfile.photo = file;
          }

          return savedProfile;
        },
      );
    },
  });

  const handleEdit = () => {
    setMode('edit');
  };

  const onSubmit = async (data: IProfilePayload) => {
    console.log('data', data);
    // if photo is not selected then send the data without avatar
    if (data.avatar.length > 0) {
      const formData = new FormData();
      formData.set('file', data.avatar[0]);
      const { file } = await uploadPhotoMutate(formData);

      console.log('uploaded file = ', file);

      if (file) {
        mutate({
          ...data,
          photo: {
            id: file.id,
          },
        });
        return;
      }
    }

    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} style={{ padding: 150 }}>
        <Grid item xs={12} container spacing={2}>
          <Grid item sm={6} md={4} alignSelf="right">
            {mode === 'edit' ? (
              <FormControl>
                <FormLabel>Profile picture</FormLabel>
                <Input
                  // html input attribute
                  type="file"
                  placeholder="avatar"
                  {...register('avatar', { required: false })}
                />
                {errors.firstName && (
                  <FormHelperText id="my-helper-text">
                    {errors.firstName?.message?.toString()}
                  </FormHelperText>
                )}
              </FormControl>
            ) : (
              <Paper
                style={{ border: '2px solid', height: '200px', width: '200px' }}
              >
                <img
                  src={
                    profile?.photo
                      ? profile.photo.path
                      : 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png'
                  }
                  style={{ height: '100%', width: '100%' }}
                />
              </Paper>
            )}
          </Grid>
          <Grid item sm={6} md={8} alignSelf="left" container gap={10}>
            {mode === 'edit' ? (
              <>
                <Grid item xs={12} container alignItems="flex-end" gap={10}>
                  <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      // html input attribute
                      type="text"
                      placeholder="first name"
                      {...register('firstName', { required: true })}
                    />
                    {errors.firstName && (
                      <FormHelperText id="my-helper-text">
                        {errors.firstName?.message?.toString()}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl>
                    <FormLabel>Last Name</FormLabel>
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
                </Grid>
                <Grid item xs={12} container alignItems="flex-end" gap={10}>
                  {isPending ? (
                    <IconButton
                      onClick={() => handleEdit()}
                      style={{ backgroundColor: '#594f8d', marginLeft: '1rem' }}
                    >
                      <CircularProgress style={{ color: 'white' }} />
                    </IconButton>
                  ) : (
                    <Button type="submit" sx={{ mt: 1 /* margin top */ }}>
                      Save
                    </Button>
                  )}
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} container alignItems="flex-end" gap={10}>
                  <Typography variant="h4">First Name</Typography>
                  <Typography variant="h4">{`${profile?.firstName}`}</Typography>
                  <IconButton
                    onClick={() => handleEdit()}
                    style={{ backgroundColor: '#594f8d', marginLeft: '1rem' }}
                  >
                    <EditIcon style={{ color: 'white' }} />
                  </IconButton>
                </Grid>
                <Grid item xs={12} container alignItems="flex-end" gap={10}>
                  <Typography variant="h4">Last Name</Typography>
                  <Typography variant="h4">{`${profile?.lastName}`}</Typography>
                </Grid>
                <Grid item xs={12} container alignItems="flex-start" gap={10}>
                  <Typography variant="h4">Email</Typography>
                  <Typography variant="h4">{`${profile?.email}`}</Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
