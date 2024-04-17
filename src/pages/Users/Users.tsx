import React, { useCallback, useState } from 'react';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import usersApi from '../../services/api/endpoints/users';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  GridFilterOperator,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridSlots,
  GridSortModel,
} from '@mui/x-data-grid';
import { Box, Button, Container, Grid, Popover } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

import { IUser, IUserRole, IUserStatus } from '../../types/User';
import EditToolbar from './components/TableToolBar';
import TableFilterOperatorRolesList from './components/TableFilterOperatorRolesList';
import UserDetails from './components/UserDetails';

export function Users() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openedId, setOpenedId] = useState<number | null>(null);
  const [queryOptions, setQueryOptions] = useState<{
    sortModel: GridSortModel;
    filterModel: GridFilterModel;
  }>({
    sortModel: [],
    filterModel: {
      items: [],
    },
  });
  const [userDetailsOpened, setUserDetailsOpened] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

  const operator: GridFilterOperator<any, number> = {
    label: 'only role',
    value: 'role',
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }

      return (value) => {
        return Number(value) >= Number(filterItem.value);
      };
    },
    InputComponent: TableFilterOperatorRolesList,
    InputComponentProps: { type: 'number' },
  };

  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    // Here you save the data you need from the sort model
    setQueryOptions((oldQueryOptions) => ({
      ...oldQueryOptions,
      sortModel: [...sortModel],
    }));
  }, []);

  const onFilterChange = useCallback((filterModel: GridFilterModel) => {
    // Here you save the data you need from the filter model
    setQueryOptions((queryOptions) => ({
      ...queryOptions,
      filterModel: { ...filterModel },
    }));
  }, []);

  const open = Boolean(anchorEl);

  const {
    data: users,
    refetch: refetchUsers,
    isLoading,
  } = useQuery({
    queryKey: ['users', queryOptions, paginationModel],
    queryFn: usersApi.list,
    placeholderData: keepPreviousData,
  });
  const { data: usersCount } = useQuery({
    queryKey: ['users', 'count'],
    queryFn: usersApi.count,
  });

  const { mutateAsync: deleteMutate } = useMutation({
    mutationFn: (id: number) => usersApi.delete(id),
  });

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    // const editedRow = rows.find((row) => row.id === id);
    // if (editedRow!.isNew) {
    //   setRows(rows.filter((row) => row.id !== id));
    // }
  };

  const handlePreDeleteClick = async (
    id: number,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpenedId(id);
    // await deleteMutate(id);
    // refetchUsers();
  };

  const handleDeleteClick = async () => {
    if (!openedId) return;
    await deleteMutate(openedId);
    refetchUsers();
    setOpenedId(null);
    setAnchorEl(null);
  };

  const handleRowClick = (row: GridRowParams<IUser>) => {
    setUserDetailsOpened(true);
    setUser(row.row);
  };

  const columns: GridColDef<IUser>[] = [
    { field: 'id', headerName: 'ID', width: 70, filterable: false },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (value, row) =>
        `${row.firstName || ''} ${row.lastName || ''}`,
      filterable: false,
    },
    { field: 'email', headerName: 'Email', width: 250, filterable: false },
    {
      field: 'role',
      headerName: 'Role',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 100,
      valueFormatter: (value: IUserRole | null) => {
        return value?.name;
      },
      filterable: true,
      filterOperators: [operator],
    },
    {
      field: 'status',
      headerName: 'Status',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 100,
      valueFormatter: (value: IUserStatus | null) => {
        return value?.name;
      },
      filterable: false,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      filterable: false,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={'save'}
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              // onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={'cancel'}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={'edit'}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={'delete'}
            icon={<DeleteIcon color="error" />}
            label="Delete"
            onClick={(e) => handlePreDeleteClick(Number(id), e)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <>
      <Container maxWidth="xl">
        <div>
          <h1>Users</h1>

          <div style={{ height: 400, width: '100%', alignItems: 'center' }}>
            <DataGrid
              style={{ width: 800, margin: '0 auto' }}
              rows={users?.data ?? []}
              rowCount={usersCount ?? 0}
              columns={columns}
              paginationMode="server"
              sortingMode="server"
              filterMode="server"
              autoHeight
              rowSelection={false}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              onRowClick={(row) => handleRowClick(row)}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onFilterModelChange={onFilterChange}
              loading={isLoading}
              onSortModelChange={handleSortModelChange}
              pageSizeOptions={[10, 25, 50]}
              slots={{
                toolbar: EditToolbar as GridSlots['toolbar'],
              }}
            />
          </div>
        </div>
        <Popover
          id={openedId?.toString() ?? ''}
          open={open}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          anchorEl={anchorEl}
        >
          <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
            <Grid container spacing={2} style={{ padding: 15 }}>
              <Grid item xs={12} container spacing={2}>
                <Button
                  color="primary"
                  type="submit"
                  sx={{ mt: 1 /* margin top */ }}
                  onClick={() => setAnchorEl(null)}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} container spacing={2}>
                <Button
                  type="submit"
                  color="error"
                  sx={{ mt: 1 /* margin top */ }}
                  onClick={() => handleDeleteClick()}
                >
                  Confirm
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Popover>
      </Container>
      {user && (
        <UserDetails
          isOpen={userDetailsOpened}
          user={user}
          setIsOpen={setUserDetailsOpened}
        />
      )}
    </>
  );
}
