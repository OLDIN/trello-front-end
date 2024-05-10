import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { labelsApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';

import { LabelsPopoverAdd } from './LabelsPopoverAdd';
import { LabelsPopoverEdit } from './LabelsPopoverEdit';
import { LabelsPopoverList } from './LabelsPopoverList';

interface LabelsPopoverContentProps {
  boardId: number;
  taskId: number;
}

export function LabelsPopoverContent({
  boardId,
  taskId,
}: LabelsPopoverContentProps) {
  const [mode, setMode] = useState<
    { mode: 'list' | 'add' } | { mode: 'edit'; labelId: number }
  >({ mode: 'list' });
  const { data: labels = [] } = useQuery({
    queryKey: [QueryKey.LABELS, { taskId }],
    queryFn: () =>
      labelsApi.fetchAll({
        filter: {
          field: 'taskId',
          operator: '$eq',
          value: taskId,
        },
      }),
  });

  return mode.mode === 'list' ? (
    <LabelsPopoverList
      boardId={boardId}
      taskLabels={labels}
      onClickAddNewLabel={() => setMode({ mode: 'add' })}
      onClickEditLabel={(labelId) => setMode({ mode: 'edit', labelId })}
    />
  ) : mode.mode === 'add' ? (
    <LabelsPopoverAdd />
  ) : mode.mode === 'edit' ? (
    <LabelsPopoverEdit
      boardId={boardId}
      labelId={mode.labelId}
      onEditComplete={() => setMode({ mode: 'list' })}
      onCancel={() => setMode({ mode: 'list' })}
    />
  ) : (
    <></>
  );
}
