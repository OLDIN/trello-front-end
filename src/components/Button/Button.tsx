import React, { MouseEventHandler } from 'react';

import { StyledButton } from './styles';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  disabled?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
  type?: 'submit';
  startIcon?: React.ReactNode;
}

export function Button({
  children,
  onClick,
  type,
  startIcon,
  ...props
}: ButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (props.disabled) return;

    onClick?.(e);

    if (type === 'submit') {
      const form = e.currentTarget.closest('form');

      if (form) {
        form.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        );
      }
    }
  };

  return (
    <StyledButton onClick={handleClick} {...props}>
      {startIcon && <span className="startIcon">{startIcon}</span>}
      {children}
    </StyledButton>
  );
}
