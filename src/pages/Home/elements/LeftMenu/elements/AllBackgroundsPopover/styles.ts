import { Popover as PopoverBase } from 'components/Popover';

import {
  Button,
  css,
  IconButton as IconButtonBase,
  Link,
  List as ListBase,
  ListItem as ListItemBase,
  styled,
} from '@mui/material';

const Popover = styled(PopoverBase)`
  & .MuiPaper-root {
    max-width: 100%;
  }
`;

const List = styled(ListBase)`
  display: flex;
  justify-content: space-between;
  gap: 4px;
`;

const ListItem = styled(ListItemBase)`
  width: calc(33% - 4px);
  padding: 0;
  justify-content: center;
  align-items: center;
`;

const PhotoPreview = styled(IconButtonBase, {
  shouldForwardProp: (prop) =>
    !['backgroundImage', 'size'].includes(prop.toString()),
})<{
  backgroundImage: string;
  size?: 'small' | 'large';
}>`
  ${({ backgroundImage }) =>
    backgroundImage &&
    css`
      background-image: url(${backgroundImage});
    `}

  align-items: center;
  background-position: center center;
  background-size: cover;
  border-radius: 3px;
  box-shadow: none;
  color: #091e420f;
  display: flex;
  justify-content: center;
  margin: 0;
  min-height: 0;
  outline: 0;
  padding: 0;
  position: relative;
  line-height: 0;

  ${({ size = 'small' }) =>
    size === 'large'
      ? css`
          height: 81px;
          width: 100%;
        `
      : css`
          height: 56px;
          width: 100%;
        `}

  &:hover {
    border-radius: 3px;
  }

  &:hover::before,
  &:focus::before,
  &.selected::before {
    background: #00000029;
    position: absolute;
    bottom: 0;
    content: '';
    display: block;
    left: 0;
    right: 0;
    top: 0;
    border-radius: 3px;
    z-index: 0;
  }

  & .creator-link {
    opacity: 0;
  }

  &:hover .creator-link {
    opacity: 1;
  }
`;

const IconButton = styled(IconButtonBase)`
  width: 100%;
  height: 56px;
  padding: 0;

  &:hover::before {
    background: rgba(0, 0, 0, 0.15);
    position: absolute;
    bottom: 0;
    content: '';
    display: block;
    left: 0;
    right: 0;
    top: 0;
    border-radius: 3px;
    z-index: 0;
  }

  & > .MuiButton-icon {
    margin-right: 0;
  }
`;

const CreatorLink = styled(Link)`
  color: #ffffff;
  position: absolute;
  bottom: 0;
  left: 0;
  display: block;
  background: #0000003d;
  height: 20px;
  width: 100%;
  font-size: 12px;
  line-height: 16px;
  text-align: start;
  padding: 2px 4px;
`;

const SelectedPhotoIconButton = styled(IconButtonBase)``;

export default {
  Popover,
  List,
  ListItem,
  PhotoPreview,
  IconButton,
  CreatorLink,
};
