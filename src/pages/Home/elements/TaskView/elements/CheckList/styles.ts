import {
  css,
  LinearProgress,
  linearProgressClasses,
  styled,
} from '@mui/material';

export const StyledLinearProgress = styled(LinearProgress)`
  height: 8px;
  border-radius: 4px;
  clear: both;
  background: #091e420f;

  & .${linearProgressClasses.bar} {
    background-color: #579dff;
  }

  ${({ value }) =>
    value === 100 &&
    css`
      & .${linearProgressClasses.bar} {
        background-color: #1f845a;
      }
    `}
`;
