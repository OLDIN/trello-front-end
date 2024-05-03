import {
  Button,
  Grid,
  IconButton,
  styled,
  TextareaAutosize,
} from '@mui/material';

export const StyledButton = styled(Button)`
  /* width: 100%; */
  background-color: transparent;
  border-radius: 8px;
  color: #44546f;
  text-transform: none;
  padding: 6px 12px 6px 8px;
  text-decoration: none;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-grow: 1;
  margin: 0;

  &:hover: {
    background-color: #091e4224;
    color: #172b4d;
  }
`;

export const CreateFromTemplateIconButton = styled(IconButton)`
  border-radius: 8px;
  font-size: 16px;
`;

export const CreateTaskInputWrapper = styled(Grid)`
  padding: 0;
  background-color: ${({ theme }) =>
    theme.palette.mode === 'dark' ? '#fff' : '#ffffff'};
  border-radius: 8px;
  box-shadow:
    0px 1px 1px #091e4240,
    0px 0px 1px #091e424f;
  min-height: 36px;
  cursor: pointer;
  color: #172b4d;
  overflow: hidden;
  flex: 1 0 100%;
  &:hover .MuiButtonBase-root {
    display: inline-flex;
  }
`;

export const StyledTextareaAutosize = styled(TextareaAutosize)`
  background-color: #ffffff;
  box-shadow:
    0px 1px 1px #091e4240,
    0px 0px 1px #091e424f;
  border-radius: 8px;
  border: none;
  height: 36px;
  height: auto;
  margin: 0;
  max-height: 160px;
  min-height: 36px;
  overflow: hidden;
  overflow-wrap: break-word;
  overflow-y: auto;
  padding: 8px 12px;
  resize: none;
`;

export const IconButtonClose = styled(IconButton)`
  border-radius: 3px;
`;
