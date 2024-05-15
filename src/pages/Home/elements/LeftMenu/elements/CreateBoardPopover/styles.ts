import { Popover as PopoverBase } from 'components/Popover';

import {
  Button,
  css,
  Grid,
  Icon,
  IconButton as IconButtonBase,
  List as ListBase,
  ListItem as ListItemBase,
  styled,
} from '@mui/material';

const PhotoPreview = styled(IconButtonBase, {
  shouldForwardProp: (prop) => prop !== 'backgroundImage',
})<{
  backgroundImage: string;
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
  height: 40px;
  justify-content: center;
  margin: 0;
  min-height: 0;
  outline: 0;
  padding: 0;
  position: relative;
  line-height: 0;
  width: 64px;

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
`;

const Popover = styled(PopoverBase)`
  /* background-color: red;
  & .MuiPaper-root {
  }
  & .Popover-Body {
    padding: 12px;
  } */
`;

const IconButton = styled(IconButtonBase)`
  width: 40px;
  height: 32px;
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
`;

const MoreIconButton = styled(IconButton)`
  background-color: #091e420f;
  border-radius: 3px;
`;

const List = styled(ListBase)`
  display: flex;
  justify-content: space-between;
`;

const ListItem = styled(ListItemBase)`
  padding: 0;
  justify-content: center;
  align-items: center;
`;

const PreviewWrapperGrid = styled(Grid, {
  shouldForwardProp: (prop) =>
    !['backgroundImage', 'backgroundColor'].includes(prop.toString()),
})<{
  backgroundImage?: string;
  backgroundColor?: string;
}>`
  background-position: center center;
  background-size: cover;
  border-radius: 3px;
  width: 200px;
  height: 120px;

  ${({ backgroundImage }) =>
    backgroundImage &&
    css`
      background-image: url(${backgroundImage});
    `}

  ${({ backgroundColor }) =>
    backgroundColor &&
    css`
      background-color: ${backgroundColor};
    `}
`;

const DashboardPreviewIconWrapper = styled(Icon)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 120px;
`;

export default {
  PhotoPreview,
  Popover,
  IconButton,
  List,
  ListItem,
  MoreIconButton,
  PreviewWrapperGrid,
  DashboardPreviewIconWrapper,
};
