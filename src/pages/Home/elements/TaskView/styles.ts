import { styled } from '@mui/material';

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
