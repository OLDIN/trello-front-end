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
  background-color: #091e420f;
  line-height: 32px;
  color: #172b4d;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;

  &.task-label-color-red {
    background-color: #f87168;
    color: #5d1f1a;

    &:hover {
      background-color: #fd9891;
    }
  }

  &.task-label-color-yellow {
    background-color: #f5cd47;
    color: #533f04;

    &:hover {
      background-color: #e2b203;
    }
  }

  &.task-label-color-purple {
    background-color: #9f8fef;
    color: #352c63;

    &:hover {
      background-color: #b8acf6;
    }
  }
`;
