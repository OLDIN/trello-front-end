import { create } from 'zustand';

import { UnsplashPhoto } from 'types/Unsplash-photo';

type SelectedBackgroundState =
  | {
      type: 'gradient-color';
      src: string;
    }
  | {
      type: 'color';
      color: string;
    }
  | {
      type: 'photo';
      photo: UnsplashPhoto;
    }
  | null;

interface CreateBoardPopoverStore {
  selectedBackground: SelectedBackgroundState;
  setSelectedBackground: (background: SelectedBackgroundState) => void;

  search: string;
  setSearch: (search: string) => void;
}

export const useCreateBoardPopoverStore = create<CreateBoardPopoverStore>(
  (set) => ({
    selectedBackground: null,

    setSelectedBackground: (background) =>
      set({
        selectedBackground: background,
      }),

    search: '',

    setSearch: (search) =>
      set({
        search,
      }),
  }),
);
