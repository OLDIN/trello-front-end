import { useMemo } from 'react';
import groupBy from 'lodash.groupby';
import { useQuery } from '@tanstack/react-query';

import { checklistApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';

export function useGetChecklists(taskId: number) {
  const { data: checklists } = useQuery({
    queryKey: [QueryKey.CHECKLISTS, { taskId }],
    queryFn: () =>
      checklistApi.fetchAll({
        join: [
          {
            field: 'task',
            select: ['id', 'name'],
          },

          {
            field: 'items',
            select: ['id', 'name'],
          },
        ],
      }),
  });

  const groupedChecklists = useMemo(() => {
    const groupedRaw = groupBy(checklists, (checklist) => checklist.task?.id);

    return Object.entries(groupedRaw).map(([, checklists]) => {
      const task = checklists[0].task;

      return {
        task,
        checklists: checklists.map((checklist) => ({
          id: checklist.id,
          name: checklist.name,
          items: checklist.items,
        })),
      };
    });
  }, [checklists]);

  return { checklists, groupedChecklists };
}
