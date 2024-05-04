import React, {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  MouseEventHandler,
} from 'react';

import { StyledButton } from './styles';

import { MUIStyledCommonProps } from '@mui/system';

interface ButtonProps
  extends Pick<MUIStyledCommonProps, 'sx'>,
    DetailedHTMLProps<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    > {
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  disabled?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
  type?: 'submit';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export function Button({
  children,
  onClick,
  type,
  startIcon,
  endIcon,
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
      {startIcon && <span className="endIcon">{endIcon}</span>}
    </StyledButton>
  );
}
