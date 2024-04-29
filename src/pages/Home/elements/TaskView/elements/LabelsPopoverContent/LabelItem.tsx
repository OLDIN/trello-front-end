import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';

import { PartialUpdateLabel } from 'services/api/endpoints/labels';
import { TaskLabel } from 'types/TaskLabel';
import { getTooltipTitle } from 'utils/helpers';

import { useUpdateLabel } from '../../hooks/useUpdateLabel';
import { LabelItemWrapper } from './styles';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Checkbox, Grid, IconButton, Tooltip } from '@mui/material';

interface LabelItemProps {
  label: TaskLabel;
  onClickEditLabel: (labelId: number) => void;
}

export function LabelItem({ label, onClickEditLabel }: LabelItemProps) {
  const { register, getValues, handleSubmit, setValue } = useForm<{
    isEnable: boolean;
  }>({
    mode: 'onChange',
    defaultValues: {
      isEnable: label.isEnable,
    },
  });
  const formRef = useRef<HTMLFormElement | null>(null);
  const { mutate: updateLabel, isPending: isPendingUpdate } = useUpdateLabel({
    taskId: label.taskId,
    labelId: label.id,
  });

  const onChange = (data: PartialUpdateLabel) => {
    updateLabel(data);
  };

  const handleClickTitle = () => {
    setValue('isEnable', !getValues('isEnable'));
    handleSubmit(onChange)();
  };

  return (
    <LabelItemWrapper
      item
      container
      alignItems="center"
      gap="12px"
      component="form"
      ref={formRef}
      onChange={handleSubmit(onChange)}
    >
      <Grid item>
        <Checkbox
          checked={getValues('isEnable')}
          {...register('isEnable')}
          disabled={isPendingUpdate}
        />
      </Grid>
      <Tooltip
        title={getTooltipTitle(label.color, label.name)}
        disableInteractive
      >
        <Grid
          item
          flex={1}
          className={
            label.color
              ? `label-title label-color-pattern-${label.color}`
              : 'label-title'
          }
          onClick={handleClickTitle}
        >
          {label.name}
        </Grid>
      </Tooltip>
      <Grid item>
        <IconButton size="small" onClick={() => onClickEditLabel(label.id)}>
          <EditOutlinedIcon />
        </IconButton>
      </Grid>
    </LabelItemWrapper>
  );
}
