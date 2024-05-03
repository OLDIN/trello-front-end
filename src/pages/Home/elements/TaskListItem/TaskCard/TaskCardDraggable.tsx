import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import type { ITask } from '../../../../../types/Task';

import { TaskContextMenu } from '../../TaskContextMenu/TaskContextMenu';
import { TaskCard } from './TaskCard';

interface TaskCardDraggableProps {
  task: ITask;
  index: number;
}

interface TaskCardPosition {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function TaskCardDraggable({ task, index }: TaskCardDraggableProps) {
  const [taskModalOptionsSettings, setTaskModalOptionsSettings] = useState<{
    open: boolean;
    left: number;
    top: number;
    width: number;
    height: number;
  }>({
    open: false,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const handleClose = () => {
    setTaskModalOptionsSettings({
      ...taskModalOptionsSettings,
      open: false,
    });
  };

  const handleOnEditClick = (
    e: React.MouseEvent<HTMLElement>,
    { top, left, width, height }: TaskCardPosition,
  ) => {
    setTaskModalOptionsSettings({
      open: true,
      left,
      top,
      width,
      height,
    });
  };

  return (
    <>
      <Draggable draggableId={task.id.toString()} index={index}>
        {(provided) => (
          <TaskCard
            task={task}
            draggableProvided={provided}
            onEditClick={handleOnEditClick}
          />
        )}
      </Draggable>
      <TaskContextMenu
        task={task}
        {...taskModalOptionsSettings}
        onClose={handleClose}
      />
    </>
  );
}
