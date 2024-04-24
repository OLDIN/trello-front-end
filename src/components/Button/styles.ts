import { styled } from '@mui/material';

export const StyledButton = styled('a', {
  shouldForwardProp: (prop) => prop !== 'disabled',
})<{
  disabled?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
}>`
  display: inline-flex;
  align-items: center;
  background-color: #091e420f;
  border-radius: 3px;
  border: none;
  box-shadow: none;
  box-sizing: border-box;
  color: #172b4d;
  cursor: pointer;
  font-weight: 500;
  height: 32px;
  max-width: 300px;
  overflow: hidden;
  padding: 6px 12px;
  position: relative;
  text-decoration: none;
  text-overflow: ellipsis;
  transition-duration: 85ms;
  transition-property: background-color, border-color, box-shadow;
  transition-timing-function: ease;
  -webkit-user-select: none;
  user-select: none;
  white-space: nowrap;
  text-transform: none;
  justify-content: flex-start;
  font-size: 14px;

  &:hover {
    border: none;
    box-shadow: none;
    color: #172b4d;
    background-color: #091e4224;
    text-decoration: none;
  }

  ${({ disabled }) =>
    disabled &&
    `
    background-color: #091e420f;
    color: #172b4d;
    cursor: not-allowed;
    pointer-events: none;
  `}

  ${({ variant }) =>
    variant === 'text' &&
    `
    background-color: transparent;
    color: #172b4d;
    border: none;
    box-shadow: none;
  `}

  & > .startIcon {
    display: inherit;
    margin-right: 8px;
    margin-left: -2px;
    font-size: 18px;
  }
`;
