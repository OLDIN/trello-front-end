import React, {
  CSSProperties,
  FC,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import { fontSizeOptions } from './constants/fontSizeOptions';
import { headingOptions } from './constants/headingOptions';
import { toolbarItems } from './constants/toolbarItems';
import { typedMemo } from '../../types/typedMemo';
import * as Styled from './styles';

export interface TextEditorProps {
  data?: string;
  onChange?: (data: string) => void;
  isReadOnly?: boolean;
  height?: CSSProperties['height'];
  minHeight?: CSSProperties['minHeight'];
  maxHeight?: CSSProperties['maxHeight'];
  placeholder?: string;
}

const TextEditorBase: FC<TextEditorProps> = ({
  onChange,
  isReadOnly,
  height,
  minHeight,
  maxHeight,
  placeholder,
  ...props
}) => {
  let editorInstance: DecoupledEditor | null = null;

  const handleReady = (editor: DecoupledEditor) => {
    editorInstance = editor;
    editor.focus();

    editor?.ui
      ?.getEditableElement()
      ?.parentElement?.insertBefore(
        editor?.ui?.view?.toolbar?.element as Node,
        editor.ui.getEditableElement() as Node,
      );

    if (isReadOnly) {
      editor.enableReadOnlyMode('read_only');
    } else {
      editor.disableReadOnlyMode('read_only');
    }
  };

  useEffect(() => {
    if (editorInstance) {
      if (isReadOnly) {
        if (editorInstance?.ui?.view?.toolbar?.element) {
          editorInstance.ui.view.toolbar.element.style.display = 'none';
        }
        editorInstance.enableReadOnlyMode('read_only');
      } else {
        if (editorInstance?.ui?.view?.toolbar?.element) {
          editorInstance.ui.view.toolbar.element.style.display = 'block';
        }
        editorInstance.disableReadOnlyMode('read_only');
      }
    }
  }, [editorInstance, isReadOnly]);

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
          placeholder,
          heading: {
            options: headingOptions,
          },
          fontSize: {
            options: fontSizeOptions,
          },
          toolbar: toolbarItems,
        }}
      />
    </Styled.TextEditorWrapper>
  );
};

export const TextEditor = typedMemo(TextEditorBase);
