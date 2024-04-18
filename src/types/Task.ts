export enum TaskPriorityEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Task {
  id: number;
  name: string;
  position: number;
  description: string;
  priority: TaskPriorityEnum;
  createdAt: string;
  updatedAt: string;
  assigneeId: number;
  taskListId: number;
}
