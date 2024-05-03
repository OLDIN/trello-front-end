import { Button, css, Paper, styled } from '@mui/material';

export const AddAnotherListWrapper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'mode',
})<{ mode: 'add' | 'view' }>`
  min-width: 272px;
  width: 272px;
  height: 100%;
  padding: 8px;
  border-radius: 12px;

  ${({ mode }) =>
    mode === 'view' &&
    css`
      background-color: transparent;
    `};
`;

export const AddAnotherListButton = styled(Button)`
  justify-content: flex-start;
  width: 272px;
  border-radius: 12px;
  padding: 12px;
  background-color: #ffffff3d;
  color: #fff;

  &:hover {
    background-color: #a6c5e229;
    color: #ffffff;
  }
`;
