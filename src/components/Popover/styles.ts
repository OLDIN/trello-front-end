import { Grid, styled, Typography } from '@mui/material';

export const PopoverBody = styled(Grid)`
  width: 304px;
  padding: 8px 16px;
` as typeof Grid;

export const PopoverTitle = styled(Typography)`
  box-sizing: border-box;
  color: #44546f;
  display: block;
  font-size: 14px;
  font-weight: 600;
  grid-column: 1 / span 3;
  grid-row: 1;
  height: 40px;
  letter-spacing: -0.003em;
  line-height: 16px;
  line-height: 40px;
  margin: 0;
  overflow: hidden;
  padding: 0 32px;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  z-index: 1;
`;
