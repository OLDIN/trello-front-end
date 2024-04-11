import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import schema from './editProfileValidation';
import authApi from '../../services/api/endpoints/auth';
import useProfileUpdate from './hooks/useProfileUpdate';

interface IProfile {
  firstName: string;
  lastName: string;
}

export function Profile() {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const { data: profile } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.getProfile,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IProfile>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: profile?.data.firstName,
      lastName: profile?.data.lastName,
    },
  });
  const { mutate, isPending } = useProfileUpdate({
    onSuccess: () => {
      setMode('view');
    },
  });

  const handleEdit = () => {
    setMode('edit');
  };

  const onSubmit = (data: IProfile) => {
    mutate(data);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} container spacing={2}>
        <Grid item sm={6} md={4} alignSelf="right">
          <Paper
            style={{ border: '2px solid', height: '200px', width: '200px' }}
          >
            Profile Picture
          </Paper>
        </Grid>
        <Grid item sm={6} md={8} alignSelf="left" container gap={10}>
          {mode === 'edit' ? (
            <form onSubmit={handleSubmit(onSubmit)}>
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
            </form>
          ) : (
            <>
              <Grid item xs={12} container alignItems="flex-end" gap={10}>
                <Typography variant="h4">First Name</Typography>
                <Typography variant="h4">{`${profile?.data.firstName}`}</Typography>
                <IconButton
                  onClick={() => handleEdit()}
                  style={{ backgroundColor: '#594f8d', marginLeft: '1rem' }}
                >
                  <EditIcon style={{ color: 'white' }} />
                </IconButton>
              </Grid>
              <Grid item xs={12} container alignItems="flex-end" gap={10}>
                <Typography variant="h4">Last Name</Typography>
                <Typography variant="h4">{`${profile?.data.lastName}`}</Typography>
              </Grid>
              <Grid item xs={12} container alignItems="flex-start" gap={10}>
                <Typography variant="h4">Email</Typography>
                <Typography variant="h4">{`${profile?.data.email}`}</Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
