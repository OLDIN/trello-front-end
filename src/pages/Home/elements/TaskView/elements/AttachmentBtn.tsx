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
}

export function AttachmentBtn({ children }: AttachmentBtnProps) {
  return (
    <AttachmentWrapper>
      <AttachmentLink>{children}</AttachmentLink>;
    </AttachmentWrapper>
  );
}
