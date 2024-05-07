import type { ToolbarConfig } from '@ckeditor/ckeditor5-core';

import Dots from 'assets/icons/dots.svg';

export const toolbarItems: ToolbarConfig = {
  items: [
    'heading',
    '|',
    'bold',
    'italic',
    {
      label: 'More formatting',
      withText: false,
      // icon: Dots,
      tooltip: 'More formatting',
      items: ['underline', 'strikethrough'],
    },
    '|',
    {
      label: 'Lists',
      items: ['bulletedList', 'numberedList'],
      tooltip: 'Lists',
    },
    '|',
    {
      label: 'Insert elements',
      items: ['blockQuote', 'emoji'],
      tooltip: 'Insert elements',
    },
    '|',
    'link',
    '|',
    'codeBlock',
  ],
  shouldNotGroupWhenFull: false,
};
