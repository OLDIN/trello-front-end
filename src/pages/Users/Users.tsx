import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import usersApi from '../../services/api/endpoints/users';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridSlots,
} from '@mui/x-data-grid';
import { Box, Button, Container, Grid, Popover } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

import { IUser } from '../../types/User';
import EditToolbar from './components/TableToolBar';

export function Users() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openedId, setOpenedId] = useState<number | null>(null);

  const open = Boolean(anchorEl);

  const { data: users, refetch: refetchUsers } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.list,
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

  const columns: GridColDef<IUser>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 130,
      editable: true,
    },
    { field: 'lastName', headerName: 'Last name', width: 130, editable: true },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (value, row) =>
        `${row.firstName || ''} ${row.lastName || ''}`,
    },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
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

          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={users?.data ?? []}
              columns={columns}
              editMode="row"
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
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
    </>
  );
}
