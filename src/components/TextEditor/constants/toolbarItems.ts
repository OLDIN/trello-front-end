import type { ToolbarConfig } from '@ckeditor/ckeditor5-core';

export const toolbarItems: ToolbarConfig = {
  items: [
    'heading',
    '|',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    'link',
    'blockQuote',
    '|',
    'image2',
    '|',
    'codeBlock',
  ],
  shouldNotGroupWhenFull: false,
};
