import {
  Badge,
  BadgeProps,
  Box,
  IconButton as IconButtonBase,
  ListItem,
} from '@mui/material';
import { styled } from '@mui/system';

export const TaskEditButton = styled(IconButtonBase)`
  display: none;
  position: absolute;
  top: 2px;
  right: 2px;
  border-radius: 25px;
  padding: 6px 8px;
  background-color: #ffffff;
  z-index: 10;
  cursor: pointer;
  color: #172b4d;
  transition-property: background-color, border-color, box-shadow;
  transition-duration: 85ms;
  transition-timing-function: ease;
`;

export const Task = styled(ListItem)`
  padding: 0;
  background-color: ${({ theme }) =>
    theme.palette.mode === 'dark' ? '#fff' : '#ffffff'};
  border-radius: 8px;
  box-shadow:
    0px 1px 1px #091e4240,
    0px 0px 1px #091e424f;
  min-height: 36px;
  cursor: pointer;
  color: #172b4d;
  overflow: hidden;
  flex: 1 0 100%;
  &:hover .MuiButtonBase-root {
    display: inline-flex;
  }
`;

export const StyledBadge = styled(Badge)<BadgeProps>(() => ({
  '& .MuiBadge-badge': {
    right: -5,
    top: 8,
    border: 'none',
    padding: '0 4px',
  },
}));

export const IconButton = styled(IconButtonBase)`
  &:hover {
    background-color: transparent;
  }
`;

export const Label = styled(Badge)`
  padding: '4px 8px';
  margin: '4px';
  min-width: 40px;
  max-width: 40px;
  height: 8px;
  color: transparent;
  display: inline-block;
  position: relative;
  border-radius: 4px;
  padding: 0 8px;
  box-sizing: border-box;
  line-height: 16px;
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TaskBody = styled(Box)`
  padding: 8px 12px 4px;
  min-height: 24px;
`;
