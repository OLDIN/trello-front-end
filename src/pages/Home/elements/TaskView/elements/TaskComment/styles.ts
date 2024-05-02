import {
  Avatar,
  Button,
  Grid,
  IconButton,
  styled,
  Typography,
} from '@mui/material';

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
  padding: 8px 0;
  margin: 0px 0 0 -20px;
  width: auto;

  &.highlighted {
    background: #e9f2ff;
    border-left-color: #1d7afc;
    /* margin: 0 0 0 -12px; */
    /* padding: 8px 0 8px 48px; */
  }
`;

export const CommentDateTypography = styled(Typography)`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
` as typeof Typography;

export const CommentAvatar = styled(Avatar)`
  width: 32px;
  height: 32px;
  font-size: 14px;
  margin-left: 15px;
  margin: 5px 0px 0px 15px;
`;

export const AddReactionButton = styled(IconButton)`
  padding: 0;
  border-radius: 12px;
  box-sizing: content-box;

  & > .MuiSvgIcon-root {
    border: 1px solid #091e4224;
    border-radius: 12px;
    color: #626f86;
    line-height: 16px;
    margin-bottom: 4px;
    padding: 3px 7px;
    width: auto;
  }
`;
