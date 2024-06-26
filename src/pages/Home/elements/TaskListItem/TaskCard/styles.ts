import { TaskLabelsViewModeEnum } from 'types/Task';

import {
  Badge,
  Box,
  IconButton as IconButtonBase,
  ListItem,
  Typography,
} from '@mui/material';
import { css, styled } from '@mui/system';

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

export const StyledBadge = styled(Badge)`
  align-items: center;

  & .MuiBadge-badge {
    border: none;
    transform: none;
    position: relative;
    padding: 0 2px;
  }
`;

export const IconButton = styled(IconButtonBase)`
  padding: 2px;

  &:hover {
    background-color: transparent;
  }
`;

export const Label = styled(Badge, {
  shouldForwardProp: (prop) => prop !== 'labelViewMode',
})<{
  labelViewMode: TaskLabelsViewModeEnum;
}>`
  display: inline-block;
  position: relative;
  margin-bottom: 0;
  border-radius: 4px;
  padding: 0 8px;
  min-width: 56px;
  max-width: 100%;
  height: 16px;
  box-sizing: border-box;
  line-height: 16px;
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ labelViewMode }) =>
    labelViewMode === TaskLabelsViewModeEnum.ONLY_COLOR &&
    css`
      margin-top: 0;
      margin-bottom: 0;
      padding-right: 0;
      padding-left: 0;
      min-width: 40px;
      max-width: 40px;
      height: 8px;
      color: transparent;
    `}
`;

export const TaskBody = styled(Box)`
  padding: 8px 12px 4px;
  min-height: 24px;
`;

export const TaskTemplateLabel = styled(Typography)`
  display: inline-flex;
  align-items: center;
  column-gap: 4px;
  width: max-content;
  background-color: #cce0ff;
  color: #0055cc;
  padding: 2px;
  border-radius: 3px;

  & .MuiIcon-root {
    align-items: center;
    display: inline-flex;
  }
` as typeof Typography;
