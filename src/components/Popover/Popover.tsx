import React, { useState } from 'react';

import { PopoverBody, PopoverTitle } from './styles';

import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import {
  Grid,
  IconButton,
  Popover as PopoverBase,
  PopoverOrigin,
  Typography,
} from '@mui/material';

interface PopoverProps {
  id?: string;
  openPopover: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  children: React.ReactNode;
  isDisabledClosing?: boolean;
  title: string;
  titleIcon?: React.ReactNode;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
}

export function Popover({
  openPopover,
  anchorEl,
  onClose,
  id,
  isDisabledClosing,
  children,
  title,
  titleIcon,
  anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'center',
  },
  transformOrigin = {
    vertical: 'top',
    horizontal: 'center',
  },
}: PopoverProps) {
  const handleOnClose = () => {
    if (isDisabledClosing) return;
    onClose();
  };

  return (
    <PopoverBase
      open={openPopover}
      anchorEl={anchorEl}
      onClose={handleOnClose}
      id={id}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      sx={{
        marginTop: '10px',
      }}
    >
      <PopoverBody container direction="column" component="section">
        <Grid
          item
          container
          justifyContent="space-between"
          alignItems="center"
          component="header"
        >
          <Grid item>{titleIcon}</Grid>
          <Grid item>
            <PopoverTitle variant="subtitle1">{title}</PopoverTitle>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="close"
              onClick={handleOnClose}
              sx={{
                position: 'absolute',
                right: 5,
                top: 5,
                color: (theme) => theme.palette.grey[500],
              }}
              disabled={isDisabledClosing}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item>{children}</Grid>
      </PopoverBody>
    </PopoverBase>
  );
}
