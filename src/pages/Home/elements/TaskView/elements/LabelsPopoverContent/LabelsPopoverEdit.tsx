import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { PartialUpdateLabel } from 'services/api/endpoints/labels';
import { LabelColor } from 'types/TaskLabel';

import { Button } from 'components/Button';

import { useFetchLabelDetailed } from '../../hooks/useFetchLabelDetailed';
import { useUpdateLabel } from '../../hooks/useUpdateLabel';
import {
  LabelPreview,
  LabelPreviewWrapper,
  LabelSelect,
  LabelSelectOption,
  LabelSelectOptionWrapper,
} from './styles';

import CloseIcon from '@mui/icons-material/Close';
import {
  Button as MUIButton,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  TextField,
  Tooltip,
} from '@mui/material';

interface LabelsPopoverEditProps {
  boardId: number;
  labelId: number;
  onEditComplete: () => void;
  onCancel: () => void;
}

export function LabelsPopoverEdit({
  boardId,
  labelId,
  onEditComplete,
  onCancel,
}: LabelsPopoverEditProps) {
  const labelColors = useMemo(() => Object.values(LabelColor), []);
  const { data: label } = useFetchLabelDetailed(labelId);
  const { mutate: updateLabel } = useUpdateLabel({
    boardId,
    taskId: label?.taskId ?? 0,
    labelId: labelId,
    onSuccess: () => {
      onEditComplete();
    },
  });
  const { register, handleSubmit, setValue, watch } =
    useForm<PartialUpdateLabel>({
      values: {
        color: label?.color,
        name: label?.name,
      },
    });
  const selectedColor = watch('color');
  const labelName = watch('name');

  const onSubmit = (data: PartialUpdateLabel) => {
    updateLabel(data);
  };

  const getTooltipTitle = useCallback(
    (color: string) => color.split('_').join(' '),
    [],
  );

  return (
    <Grid
      container
      direction="column"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      gap="8px"
    >
      <LabelPreviewWrapper item>
        <LabelPreview
          className={
            selectedColor ? `label-color-pattern-${selectedColor} no-hover` : ''
          }
        >
          {labelName}
        </LabelPreview>
      </LabelPreviewWrapper>
      <Grid item>
        <FormControl fullWidth>
          <FormLabel>Title</FormLabel>
          <TextField size="small" {...register('name')} />
        </FormControl>
      </Grid>
      <LabelSelect>
        {labelColors.map((color) => (
          <Tooltip
            title={getTooltipTitle(color)}
            key={color}
            disableInteractive
          >
            <LabelSelectOptionWrapper
              className={selectedColor === color ? 'selected' : ''}
            >
              <LabelSelectOption
                className={`label-color-pattern-${color}`}
                onClick={() => setValue('color', color)}
              />
            </LabelSelectOptionWrapper>
          </Tooltip>
        ))}
      </LabelSelect>
      <Grid item>
        <Button
          variant="contained"
          startIcon={<CloseIcon />}
          sx={{ width: '100%', justifyContent: 'center' }}
          onClick={() => setValue('color', null)}
          disabled={!selectedColor}
        >
          Remove color
        </Button>
      </Grid>
      <Divider />
      <Grid item container justifyContent="space-between">
        <MUIButton variant="contained" color="primary" type="submit">
          Save
        </MUIButton>
        <MUIButton variant="contained" color="error" onClick={onCancel}>
          Cancel
        </MUIButton>
      </Grid>
    </Grid>
  );
}
