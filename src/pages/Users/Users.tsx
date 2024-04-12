import React from 'react';
import { useQuery } from '@tanstack/react-query';

import usersApi from '../../services/api/endpoints/users';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Container } from '@mui/material';

import { IUser } from '../../types/User';

const columns: GridColDef<IUser>[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
  { field: 'email', headerName: 'Email', width: 250 },
];

export function Users() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.list,
  });

  return (
    <Container maxWidth="xl">
      <div>
        <h1>Users</h1>

        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={users?.data ?? []}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
        </div>
      </div>
    </Container>
  );
}
