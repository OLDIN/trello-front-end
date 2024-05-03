import { create } from 'zustand';

import { Board } from 'types/Board';

interface BoardStore {
  selectedBoardBackgroundImagePath: string | null;
  setSelectedBoardBackgroundImagePath: (path: string | null) => void;

  selectedBoard: Board | null;
  setSelectedBoard: (board: Board | null) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  selectedBoardBackgroundImagePath: null,

  setSelectedBoardBackgroundImagePath: (path) => {
    set({
      selectedBoardBackgroundImagePath: path,
    });
  },

  selectedBoard: null,

  setSelectedBoard: (board) => {
    set({
      selectedBoard: board,
    });
  },
}));
