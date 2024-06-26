import {
  type DefaultError,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';

import { usersApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';
import type { IUser } from 'types/User';

interface IUseUsers
  extends Omit<
    UseQueryOptions<
      IUser[],
      DefaultError,
      IUser[],
      [
        'users',
        {
          boardId: number;
        },
      ]
    >,
    'queryKey' | 'queryFn'
  > {
  boardId: number;
}

export function useUsers({ boardId }: IUseUsers) {
  return useQuery<
    IUser[],
    DefaultError,
    IUser[],
    [
      'users',
      {
        boardId: number;
      },
    ]
  >({
    queryKey: [QueryKey.USERS, { boardId }],
    queryFn: () =>
      usersApi.listSimple({
        filter: {
          field: 'assignedTasks.taskList.boardId',
          operator: 'eq',
          value: boardId,
        },
        join: [
          {
            field: 'assignedTasks',
            select: ['id'],
          },
          {
            field: 'assignedTasks.taskList',
            select: ['id'],
          },
          {
            field: 'photo',
          },
        ],
        sort: [
          {
            field: 'firstName',
            order: 'ASC',
          },
          {
            field: 'lastName',
            order: 'ASC',
          },
        ],
      }),
    enabled: !!boardId,
  });
}
