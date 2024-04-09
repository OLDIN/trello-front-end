import React from 'react';
import { useQuery } from '@tanstack/react-query';
import authApi from '../../services/api/endpoints/auth';
import { Grid, IconButton, Paper, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export function Profile() {
  const { data: profile } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.getProfile,
  });

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
        <Grid item sm={6} md={8} alignSelf="left" container>
          <Grid item xs={12} container alignItems="flex-end">
            <Typography variant="h4">{`${profile?.data.firstName}`}</Typography>
            <IconButton
              style={{ backgroundColor: '#594f8d', marginLeft: '1rem' }}
            >
              <EditIcon style={{ color: 'white' }} />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">{`${profile?.data.lastName}`}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
