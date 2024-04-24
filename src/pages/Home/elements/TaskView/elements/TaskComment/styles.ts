import { Button, Grid, styled } from '@mui/material';

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
  &:hover {
    background-color: none;
  }
`;
