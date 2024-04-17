import React, { Dispatch, useState } from 'react';
import { Box, Drawer, Grid, TextField, Typography } from '@mui/material';
import { IUser } from '../../../types/User';
import { formatDate } from '../../../utils/formatDate';

interface UserDetailsProps {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
  user: IUser;
}

export default function UserDetails({
  isOpen,
  user,
  setIsOpen,
}: UserDetailsProps) {
  const toggleDrawer = (newOpen: boolean) => () => {
    setIsOpen(newOpen);
  };

  return (
    <Drawer open={isOpen} onClose={toggleDrawer(false)} anchor="right">
      <Box
        component="form"
        autoComplete="off"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          margin: [2, 2, 2, 2],
          width: 300,
        }}
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
            <TextField
              fullWidth
              label="First Name"
              value={user.firstName}
              variant="outlined"
              disabled={true}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              label="Last Name"
              value={user.lastName}
              variant="outlined"
              disabled={true}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              label="Email"
              value={user.email}
              variant="outlined"
              disabled={true}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              label="Status"
              value={user.status.name}
              variant="outlined"
              disabled={true}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              label="Role"
              value={user.role.name}
              variant="outlined"
              disabled={true}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              label="Created At"
              value={formatDate(new Date(user.createdAt), 'StandardWithHours')}
              variant="outlined"
              disabled={true}
            />
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
}
