import {
  Avatar,
  Button,
  Grid,
  styled,
  Typography,
  TypographyTypeMap,
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export const CommentBody = styled(Grid)`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow:
    0px 1px 1px #091e4240,
    0px 0px 1px #091e424f;
  box-sizing: border-box;
  clear: both;
  display: inline-block;
  margin: 4px 2px 4px 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 8px 12px;
`;

export const CommentActionButton = styled(Button)`
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    background-color: none;
  }
`;

export const CommentWrapper = styled(Grid)`
  border-left: 4px solid transparent;

  &.highlighted {
    background: #e9f2ff;
    border-left-color: #1d7afc;
    border-left: 4px solid #091e4224;
    /* margin: 0 0 0 -12px; */
    /* padding: 8px 0 8px 48px; */
  }
`;

export const CommentDateTypography = styled(Typography)`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
` as OverridableComponent<TypographyTypeMap<object, 'span'>>;

export const CommentAvatar = styled(Avatar)`
  width: 32px;
  height: 32px;
  font-size: 14px;
  margin: 5px;
`;
