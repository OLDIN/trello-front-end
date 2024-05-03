import { Button, Divider, Grid, InputBase, styled } from '@mui/material';

export const TaskCover = styled('div', {
  shouldForwardProp: (prop) =>
    !['src', 'coverBgColor'].includes(prop.toString()),
})<{ src: string; coverBgColor?: string }>`
  background-color: ${({ coverBgColor = 'rgb(250, 250, 249)' }) =>
    coverBgColor};
  background-image: ${({ src }) => `url(${src})`};
  height: 160px;
  min-height: 160px;
  background-size: contain;
  background-origin: content-box;
  padding: 0px;
  box-sizing: border-box;
  background-position: center center;
  background-repeat: no-repeat;
  width: 100%;
  cursor: pointer;

  &:hover {
    /* opacity: 0.9; */
  }
`;

export const StyledButton = styled(Button)`
  background-color: #091e420f;
  border: none;
  border-radius: 3px;
  box-shadow: none;
  box-sizing: border-box;
  color: #172b4d;
  cursor: pointer;
  font-weight: 500;
  height: 32px;
  margin-top: 8px;
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
  max-width: 300px;
  width: 100%;
  justify-content: flex-start;
  &:hover {
    border: none;
    box-shadow: none;
    color: #172b4d;
    background-color: #091e4224;
    text-decoration: none;
  }
`;

export const StyledDivider = styled(Divider)`
  background-color: #091e4224;
`;

export const StyledTaskBlock = styled(Grid)`
  clear: both;
  position: relative;

  &:not(:last-child) {
    margin-bottom: 24px;
  }
`;

export const StyledTaskBlockTitle = styled(Grid)`
  margin: 0 0 4px 0px;
  min-height: 32px;
  /* padding: 8px 0; */
`;

export const StyledCommentInput = styled(InputBase)`
  outline: none;
  border: none;
  box-sizing: border-box;
  color: var(--ds-text, #172b4d);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Noto Sans', 'Ubuntu', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  font-display: swap;
  transition-property: background-color, border-color, box-shadow;
  transition-duration: 85ms;
  transition-timing-function: ease;
  border-radius: 3px;
  padding: 8px 12px;
  background-color: #ffffff;
  width: 100%;
  margin-bottom: 0;
  box-shadow:
    0px 1px 1px #091e4240,
    0px 0px 1px #091e424f;
  border-radius: 8px;
  cursor: pointer;

  & .MuiInputBase-input {
    padding: 0;
    cursor: pointer;
  }

  &:hover {
    box-shadow:
      0px 1px 1px #091e4240,
      0px 0px 1px #091e424f;
    background-color: #f7f8f9;
  }
`;

export const WatchButton = styled(Button)`
  & .MuiButton-endIcon {
    border-radius: 3px;
    padding: 2px 4px;
    text-align: center;
    background-color: #626f86;
    color: #fff;
  }
`;

export const Container = styled(StyledTaskBlock, {
  shouldForwardProp: (prop) => prop !== 'iconStart',
})<{ iconStart?: boolean }>`
  padding: 0 8px 0 ${({ iconStart = false }) => (iconStart ? '24' : '60')}px;
`;
