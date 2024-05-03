import { Dialog, type DialogProps, styled } from '@mui/material';

export const StyledDialog = styled(Dialog, {
  shouldForwardProp: (prop) => !['top', 'left'].includes(prop.toString()),
})<{
  top: number;
  left: number;
}>`
  .MuiDialog-container {
    justify-content: unset;
    align-items: unset;

    & .MuiDialog-paper {
      background-color: transparent;
      box-shadow: none;
      transform: translate3d(
        ${({ left }) => left}px,
        ${({ top }) => top}px,
        0px
      );
      margin: 0;
      position: fixed;

      & .MuiDialogContent-root {
        padding: 0;
      }
    }
  }
` as (props: DialogProps & { top: number; left: number }) => JSX.Element;
