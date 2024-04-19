import { create } from 'zustand';

interface TaskStore {
  taskModalSettings:
    | {
        isOpen: false;
        taskId: null;
      }
    | {
        isOpen: true;
        taskId: number;
      };

  setTaskModalSettings: (
    taskModalSettings: TaskStore['taskModalSettings'],
  ) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  taskModalSettings: {
    isOpen: false,
    taskId: null,
  },

  setTaskModalSettings: (taskModalSettings) => {
    set({ taskModalSettings });
  },
}));
