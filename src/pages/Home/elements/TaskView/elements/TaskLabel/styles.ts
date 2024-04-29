import { styled, Typography } from '@mui/material';

export const StyledLabel = styled(Typography)`
  display: inline-block;
  position: relative;
  margin-bottom: 0;
  border-radius: 3px;
  padding: 0 12px;
  max-width: 100%;
  min-width: 48px;
  height: 32px;
  box-sizing: border-box;
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;

  &:not([class*='label-color-pattern-']) {
    background-color: #091e420f;
    color: #172b4d;
  }
`;
