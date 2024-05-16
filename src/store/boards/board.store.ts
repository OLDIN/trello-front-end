import { create } from 'zustand';

import { Board } from 'types/Board';

interface BoardStore {
  selectedBoard: Board | null;
  setSelectedBoard: (board: Board | null) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  selectedBoard: null,
  setSelectedBoard: (board) => {
    set({
      selectedBoard: board,
    });
  },
}));
