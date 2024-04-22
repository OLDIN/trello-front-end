import { CSSProperties } from 'react';

import { Box, css, styled } from '@mui/material';

export const TextEditorWrapper = styled(Box)<{
  isReadOnly?: boolean;
  height: CSSProperties['height'];
  minHeight: CSSProperties['minHeight'];
  maxHeight: CSSProperties['maxHeight'];
}>`
  display: flex;
  flex-direction: column;
  &&& .ck-toolbar {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border-top: 0;
    min-height: 50px;
  }

  &&& .ck-content {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;

    &.ck-focused {
      box-shadow: none;
    }

    ${({ isReadOnly }) =>
      isReadOnly &&
      css`
        border: none;
        padding: 0;

        & > *:first-child {
          margin-top: 0;
        }
      `}

    ${({ height }) => {
      if (height && typeof height === 'number') {
        return css`
          height: ${height}px;
        `;
      }

      return css`
        height: ${height};
      `;
    }}

    ${({ minHeight }) => {
      if (minHeight && typeof minHeight === 'number') {
        return css`
          min-height: ${minHeight}px;
        `;
      }

      return css`
        min-height: ${minHeight};
      `;
    }}

    ${({ maxHeight }) => {
      if (maxHeight && typeof maxHeight === 'number') {
        return css`
          max-height: ${maxHeight}px;
        `;
      }

      return css`
        max-height: ${maxHeight};
      `;
    }}
  }

  .ck-toolbar__items {
    justify-content: space-around;
  }

  .ck.ck-toolbar.ck-toolbar_grouping > .ck-toolbar__items {
    flex-wrap: wrap;
  }

  ul,
  ol {
  }
`;
