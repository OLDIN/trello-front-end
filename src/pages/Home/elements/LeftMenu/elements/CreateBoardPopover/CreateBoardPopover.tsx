import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { boardsApi, unsplashApi } from 'services/api';
import { CreateBoardPayload } from 'services/api/endpoints/boards';
import { QueryKey } from 'enums/QueryKey.enum';
import { Board } from 'types/Board';
import { UnsplashPhoto } from 'types/Unsplash-photo';

import { Popover } from 'components/Popover';

import { ReactComponent as DashBoardPreviewIcon } from 'assets/elements/dashboard.svg';
import Styled from './styles';

import CheckIcon from '@mui/icons-material/Check';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Icon,
  ImageList,
  ImageListItem,
  TextField,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import GradientAlienIconSrc, {
  ReactComponent as GradientAlienIcon,
} from 'assets/backgrounds/gradient-alien.svg';
import GradientCrystalIconSrc, {
  ReactComponent as GradientCrystalIcon,
} from 'assets/backgrounds/gradient-crystal.svg';
import GradientEarthIconSrc, {
  ReactComponent as GradientEarthIcon,
} from 'assets/backgrounds/gradient-earth.svg';
import GradientFlowerIconSrc, {
  ReactComponent as GradientFlowerIcon,
} from 'assets/backgrounds/gradient-flower.svg';
import GradientOceanIconSrc, {
  ReactComponent as GradientOceanIcon,
} from 'assets/backgrounds/gradient-ocean.svg';
import GradientPeachIconSrc, {
  ReactComponent as GradientPeachIcon,
} from 'assets/backgrounds/gradient-peach.svg';
import GradientRainbowIconSrc, {
  ReactComponent as GradientRainbowIcon,
} from 'assets/backgrounds/gradient-rainbow.svg';
import GradientSnowIconSrc, {
  ReactComponent as GradientSnowIcon,
} from 'assets/backgrounds/gradient-snow.svg';
import GradientVolcanoIconSrc, {
  ReactComponent as GradientVolcanoIcon,
} from 'assets/backgrounds/gradient-volcano.svg';

import createBoardValidation from './validation';

interface CreateBoardPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const backGroundColorGradientIcons = [
  { component: GradientSnowIcon, src: GradientSnowIconSrc },
  { component: GradientOceanIcon, src: GradientOceanIconSrc },
  { component: GradientCrystalIcon, src: GradientCrystalIconSrc },
  { component: GradientRainbowIcon, src: GradientRainbowIconSrc },
  { component: GradientPeachIcon, src: GradientPeachIconSrc },
  { component: GradientFlowerIcon, src: GradientFlowerIconSrc },
  { component: GradientEarthIcon, src: GradientEarthIconSrc },
  { component: GradientAlienIcon, src: GradientAlienIconSrc },
  { component: GradientVolcanoIcon, src: GradientVolcanoIconSrc },
];

console.log('GradientAlienIconSrc = ', GradientAlienIconSrc);

const backgroundGradientColorsForPreview = backGroundColorGradientIcons.slice(
  0,
  5,
);

export function CreateBoardPopover({
  open,
  anchorEl,
  onClose,
}: CreateBoardPopoverProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateBoardPayload>({
    resolver: yupResolver(createBoardValidation),
  });
  const [photosForPreview, setPhotosForPreview] = useState<UnsplashPhoto[]>([]);
  const [selectedBackground, setSelectedBackground] = useState<
    | {
        type: 'gradient-color';
        src: string;
      }
    | {
        type: 'color';
        color: string;
      }
    | {
        type: 'photo';
        photo: UnsplashPhoto;
      }
  >();

  const { data: photos = [] } = useQuery({
    queryKey: [QueryKey.UNSPLASH_PHOTOS],
    queryFn: () => unsplashApi.fetchPhotos(),
  });
  const { mutate: createBoard, isPending } = useMutation({
    mutationFn: (data: CreateBoardPayload) => boardsApi.createOne(data),
    onSuccess: (result) => {
      queryClient.setQueryData<Board[]>([QueryKey.BOARDS], (oldBoards) => {
        if (!oldBoards) return [];

        return [...oldBoards, result];
      });
    },
  });

  useEffect(() => {
    setPhotosForPreview(photos.slice(0, 4));
    setSelectedBackground({
      type: 'photo',
      photo: photos[0],
    });
  }, [photos]);

  const onSubmit = (data: CreateBoardPayload) => {
    createBoard(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Styled.Popover
      open={open}
      anchorEl={anchorEl}
      title="Create board"
      sx={{
        marginLeft: '5px',
        marginTop: '0px',
        width: '304px',
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={handleClose}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        gap={2}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Divider
          sx={{
            width: '100%',
            // margin: '16px 0',
          }}
        />

        <Styled.PreviewWrapperGrid
          item
          container
          justifyContent="center"
          backgroundImage={
            selectedBackground?.type === 'photo'
              ? selectedBackground.photo?.urls.small
              : selectedBackground?.type === 'gradient-color'
                ? selectedBackground.src
                : ''
          }
        >
          <Styled.DashboardPreviewIconWrapper>
            <DashBoardPreviewIcon />
          </Styled.DashboardPreviewIconWrapper>
        </Styled.PreviewWrapperGrid>
        <Grid item container>
          <Grid item>
            <ImageList cols={4}>
              {photosForPreview.map((photo) => {
                const isSelected =
                  selectedBackground?.type === 'photo' &&
                  selectedBackground?.photo.id === photo.id;

                return (
                  <ImageListItem key={photo.id}>
                    <Styled.PhotoPreview
                      backgroundImage={photo.urls.small}
                      className={isSelected ? 'selected' : ''}
                      startIcon={isSelected && <CheckIcon color="primary" />}
                      onClick={() =>
                        setSelectedBackground({
                          type: 'photo',
                          photo,
                        })
                      }
                    />
                  </ImageListItem>
                );
              })}
            </ImageList>
          </Grid>
          <Grid item width="100%">
            <Styled.List>
              {backgroundGradientColorsForPreview.map(
                ({ component: GradientIcon, src }, index) => (
                  <Styled.ListItem key={index}>
                    <Styled.IconButton
                      // startIcon={
                      //   selectedBackground.type === 'color' &&
                      //   selectedBackground.value === GradientIcon.name && (
                      //     <CheckIcon color="primary" />
                      //   )
                      // }
                      onClick={() => {
                        console.log('GradientIcon.propTypes = ', GradientIcon);
                        setSelectedBackground({ type: 'gradient-color', src });
                      }}
                    >
                      <GradientIcon
                        viewBox="0 0 40 32"
                        width="40px"
                        height="32px"
                        style={{ borderRadius: '3px' }}
                      />
                    </Styled.IconButton>
                  </Styled.ListItem>
                ),
              )}
              <Styled.ListItem>
                <Styled.MoreIconButton>
                  <MoreHorizIcon viewBox="0 0 24 24" />
                </Styled.MoreIconButton>
              </Styled.ListItem>
            </Styled.List>
          </Grid>
        </Grid>
        <Grid item container gap={2}>
          <FormControl fullWidth>
            <FormLabel required>Board title</FormLabel>
            <TextField
              size="small"
              helperText={errors.name?.message}
              error={!!errors.name}
              {...register('name')}
            />
          </FormControl>
          <FormControl fullWidth>
            <Button
              color="primary"
              type="submit"
              startIcon={isPending && <CircularProgress size={16} />}
              disabled={!isValid || isPending}
            >
              Create
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </Styled.Popover>
  );
}
