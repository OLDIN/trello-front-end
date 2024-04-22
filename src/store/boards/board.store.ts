import { create } from 'zustand';

interface BoardStore {
  selectedBoardBackgroundImagePath: string | null;

  setSelectedBoardBackgroundImagePath: (path: string | null) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  selectedBoardBackgroundImagePath: null,

  setSelectedBoardBackgroundImagePath: (path) => {
    set({
      selectedBoardBackgroundImagePath: path,
    });
  },
}));
