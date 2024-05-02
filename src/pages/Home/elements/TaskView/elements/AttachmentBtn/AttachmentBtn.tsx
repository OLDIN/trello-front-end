import React from 'react';

import { AttachmentLink, AttachmentWrapper } from './styles';

interface AttachmentBtnProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export function AttachmentBtn({ children, onClick }: AttachmentBtnProps) {
  return (
    <AttachmentWrapper>
      <AttachmentLink onClick={onClick}>{children}</AttachmentLink>
    </AttachmentWrapper>
  );
}
