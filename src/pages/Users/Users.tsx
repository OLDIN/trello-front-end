import React from 'react';
import { useQuery } from '@tanstack/react-query';

import usersApi from '../../services/api/endpoints/users';

export function Users() {
  const { data } = useQuery({ queryKey: ['users'], queryFn: usersApi.list });

  return (
    <div>
      <h1>Users</h1>

      <ul>
        {data?.data?.map((user: any) => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
}
