import { EditableInput } from 'components/EditableInput';

import { IconButton, Paper, styled } from '@mui/material';

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#ebecf0',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  minWidth: '272px',
  height: '100%',

  borderRadius: '12px',
  color: '#44546f',
}));

export const StyledEditableInput = styled(EditableInput)`
  padding: 6px 8px 6px 12px;
  background-color: transparent;
  cursor: pointer;
  display: block;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  margin: 0;
  overflow-wrap: anywhere;
  overflow: hidden;
  white-space: normal;
`;

export const TaskListItemOptionsBtn = styled(IconButton)`
  border-radius: 8px;

  &:hover {
    background-color: #091e4224;
    color: #44546f;
  }
`;
