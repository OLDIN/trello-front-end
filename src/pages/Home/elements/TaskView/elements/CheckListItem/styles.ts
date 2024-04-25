import { Grid, styled } from '@mui/material';

export const CheckListItemWrapper = styled(Grid)`
  border-radius: 12px;
  box-sizing: border-box;
  clear: both;
  /* padding-left: 40px; */
  position: relative;
  transform-origin: left bottom;
  transition-duration: 0.15s;
  transition-property: transform, opacity, height, padding, margin,
    background-color;
  transition-timing-function: ease-in;
  /* padding: 6px 8px; */
`;

export const CheckListItemTitleWrapper = styled(Grid)`
  word-break: break-word;
  border-radius: 12px;
  margin: 0 0 0 -8px;
  overflow-wrap: break-word;
  padding: 0 8px;

  &:hover {
    background-color: #091e420f;

    .check-list-item-icons-block {
      display: block;
    }
  }
`;
