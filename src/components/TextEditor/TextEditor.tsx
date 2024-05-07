import React, { CSSProperties, FC, useCallback, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import { headingOptions } from './constants/headingOptions';
import { toolbarItems } from './constants/toolbarItems';
import { typedMemo } from '../../types/typedMemo';
import * as Styled from './styles';

import { SxProps } from '@mui/material';
// import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import CustomEditor from 'ckeditor5-custom-build';

import './TextEditor.scss';

export type MentionFeedItem = string | MentionFeedObjectItem;
export type MentionFeedObjectItem = {
  /**
   * A unique ID of the mention. It must start with the marker character.
   */
  id: string;
  /**
   * Text inserted into the editor when creating a mention.
   */
  text?: string;

  userId?: number;

  fullName?: string;
};
export type FeedCallback = (
  searchString: string,
) => Array<MentionFeedItem> | Promise<Array<MentionFeedItem>>;

export interface TextEditorProps {
  data?: string;
  onChange?: (data: string) => void;
  isReadOnly?: boolean;
  height?: CSSProperties['height'];
  minHeight?: CSSProperties['minHeight'];
  maxHeight?: CSSProperties['maxHeight'];
  placeholder?: string;
  getMentionFeedItems?: FeedCallback;
  sx?: SxProps;
}

const TextEditorBase: FC<TextEditorProps> = ({
  onChange,
  isReadOnly,
  height,
  minHeight,
  maxHeight,
  placeholder,
  getMentionFeedItems,
  sx,
  ...props
}) => {
  let editorInstance: any | null = null;

  const handleReady = (editor: any) => {
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
    (event: any, editor: CustomEditor) => {
      onChange?.(editor.getData());
    },
    [onChange],
  );

  function customItemRenderer(item: any) {
    const itemElement = document.createElement('span');

    itemElement.classList.add('custom-item');
    itemElement.id = `mention-list-item-id-${item.id}`;
    itemElement.textContent = `${item.text} `;

    const usernameElement = document.createElement('span');

    usernameElement.classList.add('custom-item-username');
    usernameElement.textContent = item.id;

    itemElement.appendChild(usernameElement);

    return itemElement;
  }

  return (
    <Styled.TextEditorWrapper
      isReadOnly={isReadOnly}
      height={height}
      minHeight={minHeight}
      maxHeight={maxHeight}
      sx={sx}
    >
      <CKEditor<CustomEditor>
        {...props}
        editor={CustomEditor}
        onReady={handleReady}
        onChange={handleChange}
        config={
          {
            placeholder,
            mention: {
              feeds: [
                {
                  marker: '@',
                  itemRenderer: customItemRenderer,
                  feed: getMentionFeedItems,
                },
                {
                  marker: '#',
                  feed: [
                    { id: '#all_watchers', text: 'All watchers' },
                    { id: '#all_assignees', text: 'All assignees' },
                  ],
                },
              ],
            },
            fontSize: '12px',
            fontFamily: {
              options: [
                '-apple-system',
                'BlinkMacSystemFont',
                'Segoe UI',
                'Roboto',
                'Noto Sans',
                'Ubuntu',
                'Droid Sans',
                'Helvetica Neue',
                'sans-serif',
              ],
            },
            heading: {
              options: headingOptions,
            },
            toolbar: toolbarItems,
          } as any
        }
      />
    </Styled.TextEditorWrapper>
  );
};

export const TextEditor = typedMemo(TextEditorBase);
