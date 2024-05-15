import React from 'react';

import { useCreateBoardPopoverStore } from '../../CreateBoardPopover/createBoardPopover.store';

import Styled from '../styles';

import CheckIcon from '@mui/icons-material/Check';
import { Divider, Grid, ImageList, ImageListItem } from '@mui/material';

import { backgroundColorGradientIcons } from '../../../gradients';

enum SimpleColorsEnum {
  BLUE = 'Blue',
  ORANGE = 'Orange',
  GREEN = 'Green',
  RED = 'Red',
  PURPLE = 'Purple',
  PINK = 'Pink',
  LIME = 'Lime',
  SKY = 'Sky',
  GRAY = 'Gray',
}

export function ColorsListContent() {
  const { selectedBackground, setSelectedBackground } =
    useCreateBoardPopoverStore();

  return (
    <Grid container>
      <Grid item>
        <ImageList
          cols={3}
          sx={{
            width: '100%',
          }}
        >
          {backgroundColorGradientIcons.map(
            ({ component: GradientIcon, src }, index) => (
              <ImageListItem
                key={index}
                sx={{
                  height: '56px',
                }}
              >
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
                    viewBox="0 0 40 100%"
                    width="100%"
                    height="56px"
                    style={{ borderRadius: '3px' }}
                  />
                </Styled.IconButton>
              </ImageListItem>
            ),
          )}
        </ImageList>
      </Grid>
      <Divider />
      <Grid item width="100%">
        <ImageList
          cols={3}
          sx={{
            width: '100%',
          }}
        >
          {Object.values(SimpleColorsEnum).map((color, index) => (
            <ImageListItem
              key={index}
              sx={{
                height: '56px',
              }}
            >
              <Styled.IconButton
                onClick={() => {
                  setSelectedBackground({
                    type: 'color',
                    color,
                  });
                }}
                className={['BackGroup-color', color].join(' ')}
              >
                {selectedBackground?.type === 'color' &&
                  selectedBackground?.color === color && (
                    <CheckIcon
                      className="background-selected-icon"
                      color="primary"
                    />
                  )}
              </Styled.IconButton>
            </ImageListItem>
          ))}
        </ImageList>
      </Grid>
    </Grid>
  );
}
