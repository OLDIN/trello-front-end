import { Button, Divider, Grid, styled } from '@mui/material';

export const TaskCover = styled('div', {
  shouldForwardProp: (prop) => prop !== 'src',
})<{ src: string }>`
  background-color: rgb(106, 103, 90);
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
  margin-bottom: 24px;
  position: relative;
`;