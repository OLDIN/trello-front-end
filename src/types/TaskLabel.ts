export enum LabelColor {
  SUBTLE_GREEN = 'subtle_green',
  SUBTLE_YELLOW = 'subtle_yellow',
  SUBTLE_ORANGE = 'subtle_orange',
  SUBTLE_RED = 'subtle_red',
  SUBTLE_PURPLE = 'subtle_purple',

  GREEN = 'green',
  YELLOW = 'yellow',
  ORANGE = 'orange',
  RED = 'red',
  PURPLE = 'purple',

  BOLD_GREEN = 'bold_green',
  BOLD_YELLOW = 'bold_yellow',
  BOLD_ORANGE = 'bold_orange',
  BOLD_RED = 'bold_red',
  BOLD_PURPLE = 'bold_purple',

  SUBTLE_BLUE = 'subtle_blue',
  SUBTLE_SKY = 'subtle_sky',
  SUBTLE_LIME = 'subtle_lime',
  SUBTLE_PINK = 'subtle_pink',
  SUBTLE_BLACK = 'subtle_black',

  BLUE = 'blue',
  SKY = 'sky',
  LIME = 'lime',
  PINK = 'pink',
  BLACK = 'black',

  BOLD_BLUE = 'bold_blue',
  BOLD_SKY = 'bold_sky',
  BOLD_LIME = 'bold_lime',
  BOLD_PINK = 'bold_pink',
  BOLD_BLACK = 'bold_black',
}

export interface TaskLabel {
  id: number;
  name?: string | null;
  color?: LabelColor | null;
  isEnable: boolean;
  taskId: number;
}
