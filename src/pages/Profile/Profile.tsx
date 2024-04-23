import React, { FC, ReactElement, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import authApi from '../../services/api/endpoints/auth';
import { QueryKey } from 'enums/QueryKey.enum';

import useFileUpload from '../../hooks/useFileUpload/useFileUpload';
import useProfileUpdate from './hooks/useProfileUpdate';
import { IProfile } from '../../types/Profile';

import EditIcon from '@mui/icons-material/Edit';
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

import { setPersistUser } from '../../providers/AuthProvider/helpers';
import schema from './editProfileValidation';

interface IProfilePayload {
  firstName: string;
  lastName: string;
  avatar: FileList;
}

export const Profile: FC = (): ReactElement => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const { data: profile } = useQuery({
    queryKey: [QueryKey.ME],
    queryFn: authApi.getProfile,
  });
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProfilePayload>({
    resolver: yupResolver<
      Pick<IProfile, 'firstName' | 'lastName'> & {
        avatar: FileList;
      }
    >(schema),
    defaultValues: {
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      avatar: undefined,
    },
  });
  const { mutate, isPending } = useProfileUpdate({
    onSuccess: (data) => {
      setMode('view');
      queryClient.setQueryData<unknown, [QueryKey.ME], IProfile>(
        [QueryKey.ME],
        data,
      );
      setPersistUser(data);
    },
  });
  const { mutateAsync: uploadPhotoMutate } = useFileUpload({
    onSuccess: ({ file }) => {
      queryClient.setQueryData<unknown, [QueryKey.ME], IProfile>(
        [QueryKey.ME],
        (profile) => {
          if (profile) {
            profile.photo = file;
            setPersistUser(profile);
          }

          return profile;
        },
      );
    },
  });

  const handleEdit = () => {
    setMode('edit');
  };

  const onSubmit = async (data: IProfilePayload) => {
    // if photo is not selected then send the data without avatar
    if (data.avatar.length > 0) {
      const formData = new FormData();
      formData.set('file', data.avatar[0]);
      const { file } = await uploadPhotoMutate(formData);

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
};
