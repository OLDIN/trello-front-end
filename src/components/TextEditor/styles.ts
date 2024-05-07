import { CSSProperties } from 'react';

import { Box, css, styled } from '@mui/material';

export const TextEditorWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isReadOnly',
})<{
  isReadOnly?: boolean;
  height: CSSProperties['height'];
  minHeight: CSSProperties['minHeight'];
  maxHeight: CSSProperties['maxHeight'];
}>`
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  border: 2px solid transparent;

  &:focus-within {
    border: 2px solid hsl(218, 81.8%, 56.9%);
  }

  &&& .ck-toolbar {
    border-radius: 3px 3px 0 0;
    border-top: 0;
    min-height: 50px;
    border: 2px solid transparent;
    box-shadow: inset 0px -2px 0 0 #f1f2f4;
  }

  &&& .ck-content {
    border-radius: 0 0 3px 3px;
    background-color: #fff;
    border: 2px solid transparent;

    &.ck-focused,
    &:focus-within,
    &:focus-visible {
      box-shadow: none;
      outline: none;
    }

    ${({ isReadOnly }) =>
      isReadOnly &&
      css`
        border: none;
        padding: 0;

        & > *:first-of-type {
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

    & .ck-character-grid {
      & .ck-character-grid__tiles {
        display: flex;
        width: 300px;
        flex-wrap: wrap;
        height: 300px;
        overflow: auto;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .ck.ck-toolbar.ck-toolbar_grouping > .ck-toolbar__items {
    flex-wrap: wrap;
  }

  ul,
  ol {
  }
`;
