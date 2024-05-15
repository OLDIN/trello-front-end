import React, { useMemo } from 'react';

import { UnsplashPhoto } from 'types/Unsplash-photo';
import { useCreateBoardPopoverStore } from '../../CreateBoardPopover/createBoardPopover.store';

import { Button } from 'components/Button';

import Styled from '../styles';

import CheckIcon from '@mui/icons-material/Check';
import { Grid, ImageList, ImageListItem, Typography } from '@mui/material';

import { backGroundColorGradientIcons } from '../gradients';

const backgroundGradientColorsForPreview = backGroundColorGradientIcons.slice(
  0,
  6,
);

interface MainContentProps {
  setMode: React.Dispatch<React.SetStateAction<'all' | 'colors' | 'photos'>>;
  photoPages: UnsplashPhoto[][];
}

export function MainContent({ setMode, photoPages }: MainContentProps) {
  const { selectedBackground, setSelectedBackground } =
    useCreateBoardPopoverStore();

  const firstPhotos = useMemo(() => {
    if (!photoPages.length) return [];

    return photoPages[0].slice(0, 6);
  }, [photoPages]);

  return (
    <Grid container maxWidth="100%">
      <Grid item container justifyContent="space-between">
        <Typography variant="subtitle2">Photos</Typography>
        <Button onClick={() => setMode('photos')}>See more</Button>
      </Grid>
      <Grid item container>
        <ImageList cols={3} sx={{ width: '100%' }}>
          {firstPhotos.map((photo) => {
            const isSelected =
              selectedBackground?.type === 'photo' &&
              selectedBackground?.photo.id === photo.id;

            return (
              <ImageListItem key={photo.id}>
                <Styled.PhotoPreview
                  backgroundImage={photo.urls.small}
                  size="small"
                  className={isSelected ? 'selected' : ''}
                  onClick={() =>
                    setSelectedBackground({
                      type: 'photo',
                      photo,
                    })
                  }
                >
                  {isSelected && <CheckIcon color="primary" />}
                </Styled.PhotoPreview>
              </ImageListItem>
            );
          })}
        </ImageList>
      </Grid>
      <Grid item container justifyContent="space-between">
        <Typography variant="subtitle2">Colors</Typography>
        <Button onClick={() => setMode('colors')}>See more</Button>
      </Grid>
      <Grid item width="100%">
        <Styled.List sx={{ flexWrap: 'wrap' }}>
          {backgroundGradientColorsForPreview.map(
            ({ component: GradientIcon, src }, index) => (
              <Styled.ListItem key={index}>
                <Styled.IconButton
                  onClick={() => {
                    setSelectedBackground({
                      type: 'gradient-color',
                      src,
                    });
                  }}
                >
                  {selectedBackground?.type === 'gradient-color' &&
                    selectedBackground?.src === src && (
                      <CheckIcon
                        className="background-selected-icon"
                        color="primary"
                      />
                    )}
                  <GradientIcon
                    // viewBox="0 0 100% 56"
                    // width="100%"
                    height="56px"
                    style={{ borderRadius: '3px' }}
                  />
                </Styled.IconButton>
              </Styled.ListItem>
            ),
          )}
        </Styled.List>
      </Grid>
    </Grid>
  );
}
