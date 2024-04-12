import React, { useEffect } from 'react';

import { Box, CircularProgress, Container, Grid } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import authApi from '../../services/api/endpoints/auth';
import HTTP_CODES_ENUM from '../../types/http-codes';

export default function ConfirmEmail() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async (hash: string) => authApi.confirmEmail(hash),
    onSuccess: (httpCode) => {
      if (httpCode === HTTP_CODES_ENUM.NO_CONTENT) {
        enqueueSnackbar('Email confirmed', {
          variant: 'success',
        });
        navigate('/profile');
      } else {
        enqueueSnackbar('Error confirming email', {
          variant: 'error',
        });
        navigate('/');
      }
    },
  });

  useEffect(() => {
    const confirm = async () => {
      const params = new URLSearchParams(window.location.search);
      const hash = params.get('hash');

      if (hash) {
        mutate(hash);
      }
    };

    confirm();
  }, []);

  return (
    <Container maxWidth="sm">
      <Grid container>
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
            }}
          >
            <CircularProgress />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
