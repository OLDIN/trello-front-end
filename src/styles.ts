import { Board } from 'types/Board';

import { Box, css, styled } from '@mui/material';

type BoardBackground = Pick<Board, 'background' | 'backgroundType'>;

export const AppWrapper = styled(Box, {
  shouldForwardProp: (prop) =>
    !['backgroundType', 'background'].includes(prop.toString()),
})<BoardBackground>`
  ${({ backgroundType, background }) => {
    console.log('background', { backgroundType, background });
    if (backgroundType === 'image') {
      return css`
        background-image: url(${background});
        background-size: cover;
        background-position: center;
      `;
    }

    if (backgroundType === 'gradient_color') {
      return css`
        background: url(${background});
      `;
    }

    return '';
  }}
`;
