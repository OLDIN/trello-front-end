import React from 'react';

import { styled } from '@mui/material';

const AttachmentLink = styled('a')`
  text-decoration: underline;
  color: #44546f;
  font-size: 14px;
  margin-bottom: 8px;
  cursor: pointer;
`;

const AttachmentWrapper = styled('span')`
  &::before {
    content: ' • ';
  }
`;

interface AttachmentBtnProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export function AttachmentBtn({ children, onClick }: AttachmentBtnProps) {
  return (
    <AttachmentWrapper>
      <AttachmentLink onClick={onClick}>{children}</AttachmentLink>;
    </AttachmentWrapper>
  );
}
