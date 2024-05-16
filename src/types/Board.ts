export type BackgroundType = 'image' | 'gradient_color' | 'simple_color';

export interface Board {
  id: number;
  name: string;
  backgroundType?: BackgroundType;
  background?: string;
}
