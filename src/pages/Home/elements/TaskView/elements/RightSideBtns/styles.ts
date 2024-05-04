import { Button as CustomButton } from 'components/Button';

import CheckIcon from '@mui/icons-material/Check';
import { Grid, styled } from '@mui/material';

export const Button = styled(CustomButton)`
  width: 100%;

  & > .endIcon {
    position: absolute;
    right: 4px;
  }
`;

export const RightSideButtonsWrapper = styled(Grid)`
  padding: 0 16px 8px 8px;
`;

export const TemplateCheckIcon = styled(CheckIcon)`
  background-color: #1f845a;
  padding: 2px 4px;
  border-radius: 3px;
  color: #fff;
  /* font-size: ${({ theme }) => theme.typography.subtitle2}; */
`;
