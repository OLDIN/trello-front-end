import React, { CSSProperties, FC, memo, useCallback, useRef } from 'react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import { fontSizeOptions } from './constants/fontSizeOptions';
import { headingOptions } from './constants/headingOptions';
import { toolbarItems } from './constants/toolbarItems';
import * as Styled from './styles';
import { typedMemo } from '../../types/typedMemo';

export interface TextEditorProps {
  data?: string;
  onChange?: (data: string) => void;
  isReadOnly?: boolean;
  height?: CSSProperties['height'];
  minHeight?: CSSProperties['minHeight'];
  maxHeight?: CSSProperties['maxHeight'];
}

const TextEditorBase: FC<TextEditorProps> = ({
  onChange,
  isReadOnly,
  height,
  minHeight,
  maxHeight,
  ...props
}) => {
  const toolBarRef = useRef<HTMLDivElement>(null);

  const handleReady = useCallback(
    (editor: DecoupledEditor) => {
      if (toolBarRef.current) {
        if (isReadOnly) {
          editor.enableReadOnlyMode('read_only');
        } else {
          const isToolbarExists =
            !!toolBarRef.current.querySelector('.ck-toolbar');

          if (!isToolbarExists) {
            toolBarRef.current.appendChild(
              editor.ui.view.toolbar.element as Node,
            );
          }
        }
      }
    },
    [isReadOnly],
  );

  const handleChange = useCallback(
    (event: any, editor: DecoupledEditor) => {
      onChange?.(editor.getData());
    },
    [onChange],
  );

  return (
    <Styled.TextEditorWrapper
      isReadOnly={isReadOnly}
      height={height}
      minHeight={minHeight}
      maxHeight={maxHeight}
    >
      <CKEditor
        {...props}
        editor={DecoupledEditor}
        onReady={handleReady}
        onChange={handleChange}
        config={{
          heading: {
            options: headingOptions,
          },
          fontSize: {
            options: fontSizeOptions,
          },
          toolbar: toolbarItems,
        }}
      />
      <div ref={toolBarRef} />
    </Styled.TextEditorWrapper>
  );
};

export const TextEditor = typedMemo(TextEditorBase);
