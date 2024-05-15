import React from 'react';

import useWindowDimensions from 'hooks/useWindowDimensions';

import { Popover as PopoverBase, PopoverBody, PopoverTitle } from './styles';

import CloseIcon from '@mui/icons-material/Close';
import {
  Grid,
  IconButton,
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
    | 'sx'
    | 'ref'
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
  sx,
}: PopoverProps) {
  const { height } = useWindowDimensions();

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
        '& > .MuiPaper-root': {
          overflow: 'hidden',
        },
        ...sx,
      }}
    >
      <PopoverBody
        container
        direction="column"
        component="section"
        className="Popover-Body"
        wrap="nowrap"
      >
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
              size="small"
              onClick={(e) => handleOnClose(e, 'closeIconClick')}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
              disabled={isDisabledClosing}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid
          item
          container
          sx={{
            maxHeight: height - 90,
            overflowY: 'auto',
          }}
        >
          {children}
        </Grid>
      </PopoverBody>
    </PopoverBase>
  );
}
