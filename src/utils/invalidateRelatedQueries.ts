import { queryClient } from 'services/query-client';
import { QueryKey } from 'enums/QueryKey.enum';
import { AppEvent } from 'types/AppEvent';

const getRelatedQueryKeysByQueryEntity = (
  appEvent: AppEvent,
): QueryKey[] | undefined => {
  switch (appEvent) {
    case AppEvent.TaskUpdate:
      return [QueryKey.GET_TASKS, QueryKey.GET_TASK_BY_ID];

    default:
      return undefined;
  }
};

export const invalidateRelatedQueries = (appEvent: AppEvent) => {
  getRelatedQueryKeysByQueryEntity(appEvent)?.forEach((queryKey) =>
    queryClient.invalidateQueries({ queryKey: [queryKey] }),
  );
};
