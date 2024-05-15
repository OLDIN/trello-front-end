import React, { useMemo, useState } from 'react';

import { UnsplashPhoto } from 'types/Unsplash-photo';

import { ColorsListContent } from './elements/ColorsListContent';
import { MainContent } from './elements/MainContent';
import { PhotosListContent } from './elements/PhotosListContent';
import Styled from './styles';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { IconButton } from '@mui/material';

interface AllBackgroundsPopoverProps {
  open: boolean;
  anchorEl?: HTMLElement | null;
  photoPages: UnsplashPhoto[][];
  onCLose: () => void;
}

export function AllBackgroundsPopover({
  open,
  anchorEl,
  onCLose,
  photoPages,
}: AllBackgroundsPopoverProps) {
  const [mode, setMode] = useState<'all' | 'colors' | 'photos'>('all');

  const handleClose = () => {
    onCLose();
    setMode('all');
  };

  const content = useMemo(() => {
    switch (mode) {
      case 'all':
        return <MainContent photoPages={photoPages} setMode={setMode} />;
      case 'photos':
        return <PhotosListContent />;

      case 'colors':
        return <ColorsListContent />;

      default:
        return <></>;
    }
  }, [mode, photoPages]);

  return (
    <Styled.Popover
      open={open}
      anchorEl={anchorEl}
      title="Board background"
      titleIcon={
        ['photos', 'colors'].includes(mode) && (
          <IconButton size="small" onClick={() => setMode('all')}>
            <ArrowBackIosIcon />
          </IconButton>
        )
      }
      sx={{
        marginLeft: '10px',
        marginTop: '0px',
        width: '304px',
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
      onClose={handleClose}
    >
      {content}
    </Styled.Popover>
  );
}
