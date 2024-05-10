import { Divider, styled } from '@mui/material';

export const MenuDivider = styled(Divider)`
  & .MuiDivider-wrapper {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  &::before,
  &::after {
    content: none;
  }
`;
