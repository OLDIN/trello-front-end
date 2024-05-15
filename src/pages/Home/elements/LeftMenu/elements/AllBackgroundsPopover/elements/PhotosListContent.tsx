import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useCreateBoardPopoverStore } from '../../CreateBoardPopover/createBoardPopover.store';

import { useUnsplashList } from '../../../hooks/useUnsplashList';
import Styled from '../styles';

import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import {
  CircularProgress,
  FormControl,
  Grid,
  ImageList,
  ImageListItem,
  TextField,
  Typography,
} from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PhotosListContentProps {}

interface SearchFormFields {
  search: string;
}

// eslint-disable-next-line no-empty-pattern
export function PhotosListContent({}: PhotosListContentProps) {
  const { selectedBackground, setSelectedBackground, search, setSearch } =
    useCreateBoardPopoverStore();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SearchFormFields>({});

  const { photoPages, observerElem, isFetchingNextPage } = useUnsplashList({
    search,
  });

  useEffect(() => {
    return () => {
      setSearch('');
    };
  }, [setSearch]);

  const onSubmit = (data: SearchFormFields) => {
    setSearch(data.search);
  };

  return (
    <Grid container>
      <FormControl fullWidth component="form" onChange={handleSubmit(onSubmit)}>
        <TextField
          size="small"
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          placeholder="Photos"
          helperText={errors.search?.message}
          error={!!errors.search}
          {...register('search', {
            maxLength: 100,
          })}
        />
      </FormControl>
      <ImageList cols={2} sx={{ width: '100%' }}>
        {photoPages.map((photoPage) =>
          photoPage.map((photo) => {
            const isSelected =
              selectedBackground?.type === 'photo' &&
              selectedBackground?.photo.id === photo.id;

            return (
              <ImageListItem key={photo.id}>
                <Styled.PhotoPreview
                  backgroundImage={photo.urls.small}
                  size="large"
                  className={isSelected ? 'selected' : ''}
                  onClick={() =>
                    setSelectedBackground({
                      type: 'photo',
                      photo,
                    })
                  }
                >
                  {isSelected && <CheckIcon color="primary" />}
                  <Styled.CreatorLink
                    href={photo.user.links.html}
                    target="_blank"
                    rel="noreferrer"
                    color="inherit"
                    className="creator-link"
                  >
                    {photo.user.name}
                  </Styled.CreatorLink>
                </Styled.PhotoPreview>
              </ImageListItem>
            );
          }),
        )}
        <Grid
          container
          component="span"
          ref={observerElem}
          justifyContent="center"
          width="100%"
          gridColumn="1 / 3"
          minHeight={50}
        >
          {isFetchingNextPage ? (
            <CircularProgress />
          ) : (
            <Typography>Load more</Typography>
          )}
        </Grid>
      </ImageList>
    </Grid>
  );
}
