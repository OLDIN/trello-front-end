import { styled } from '@mui/material';

export const AttachmentLink = styled('a')`
  text-decoration: underline;
  color: #44546f;
  font-size: 14px;
  margin-bottom: 8px;
  cursor: pointer;
`;

export const AttachmentWrapper = styled('span')`
  &::before {
    content: ' • ';
  }
`;
