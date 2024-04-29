import { useQuery } from '@tanstack/react-query';

import { labelsApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';

export function useFetchLabelDetailed(labelId: number) {
  // TODO: maybe fet initial data from cache
  return useQuery({
    queryKey: [QueryKey.LABELS, labelId],
    queryFn: () => labelsApi.fetchOneById(labelId),
  });
}
