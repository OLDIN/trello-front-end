import React from 'react';

import { PopoverBody, PopoverTitle } from './styles';

import CloseIcon from '@mui/icons-material/Close';
import {
  Grid,
  IconButton,
  Popover as PopoverBase,
  PopoverProps as PopoverPropsBase,
} from '@mui/material';

interface PopoverProps
  extends Pick<
    PopoverPropsBase,
    | 'id'
    | 'open'
    | 'anchorEl'
    | 'onClose'
    | 'children'
    | 'anchorOrigin'
    | 'transformOrigin'
  > {
  isDisabledClosing?: boolean;
  title: string;
  titleIcon?: React.ReactNode;
  onClose?: (
    event: object,
    reason: 'backdropClick' | 'escapeKeyDown' | 'closeIconClick',
  ) => void;
}

export function Popover({
  open,
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
  const handleOnClose = (
    event: object,
    reason: 'backdropClick' | 'escapeKeyDown' | 'closeIconClick',
  ) => {
    if (isDisabledClosing) return;
    onClose?.(event, reason);
  };

  return (
    <PopoverBase
      open={open}
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
              onClick={(e) => handleOnClose(e, 'closeIconClick')}
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
