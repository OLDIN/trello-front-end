export interface TaskCheckListItem {
  id: number;
  name: string;
  checked: boolean;
}

export interface TaskCheckList {
  id: number;
  name: string;
  items: TaskCheckListItem[];
}
