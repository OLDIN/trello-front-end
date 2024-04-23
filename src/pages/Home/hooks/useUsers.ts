import { type DefaultError, useQuery } from '@tanstack/react-query';

import { usersApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';
import type { IUser } from 'types/User';

interface IUseUsers {
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
          field: 'tasks.taskList.boardId',
          operator: 'eq',
          value: boardId,
        },
        join: [
          {
            field: 'tasks',
            select: ['id'],
          },
          {
            field: 'tasks.taskList',
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
