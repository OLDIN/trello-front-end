import React, { useEffect, useState } from 'react';

import { TaskLabel } from 'types/TaskLabel';

import { LabelsPopoverAdd } from './LabelsPopoverAdd';
import { LabelsPopoverEdit } from './LabelsPopoverEdit';
import { LabelsPopoverList } from './LabelsPopoverList';

interface LabelsPopoverContentProps {
  taskLabels: TaskLabel[];
}

export function LabelsPopoverContent({
  taskLabels,
}: LabelsPopoverContentProps) {
  const [mode, setMode] = useState<
    { mode: 'list' | 'add' } | { mode: 'edit'; labelId: number }
  >({ mode: 'list' });

  return mode.mode === 'list' ? (
    <LabelsPopoverList
      taskLabels={taskLabels}
      onClickAddNewLabel={() => setMode({ mode: 'add' })}
      onClickEditLabel={(labelId) => setMode({ mode: 'edit', labelId })}
    />
  ) : mode.mode === 'add' ? (
    <LabelsPopoverAdd />
  ) : mode.mode === 'edit' ? (
    <LabelsPopoverEdit
      labelId={mode.labelId}
      onEditComplete={() => setMode({ mode: 'list' })}
      onCancel={() => setMode({ mode: 'list' })}
    />
  ) : (
    <></>
  );
}
