import React, {
  FC,
  FocusEvent,
  forwardRef,
  KeyboardEvent,
  useCallback,
  useState,
} from 'react';

import { typedMemo } from 'types/typedMemo';

import { StyledTextareaAutosize, StyledTypography } from './styles';

import { TextareaAutosizeProps, type TypographyOwnProps } from '@mui/material';

interface EditableInputProps
  extends Pick<TypographyOwnProps, 'variant' | 'fontWeight'>,
    Pick<TextareaAutosizeProps, 'onBlur'> {
  value?: string;
  onPressEnter?: (e: KeyboardEvent) => void;
}

const EditableInputBase: FC<EditableInputProps> = forwardRef<
  HTMLTextAreaElement,
  EditableInputProps
>(({ value, variant, onBlur, onPressEnter, fontWeight, ...props }, ref) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleClickFromViewMode = () => {
    setIsEditing(true);
  };

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLTextAreaElement>) => {
      setIsEditing(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  const handleOnKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key == 'Enter' && e.shiftKey == false) {
        e.preventDefault();
        onPressEnter?.(e);
        setIsEditing(false);
      }
    },
    [onPressEnter],
  );

  return (
    <>
      {isEditing ? (
        <StyledTextareaAutosize
          {...props}
          // value={value}
          ref={ref}
          onBlur={handleBlur}
          autoFocus
          onKeyDown={handleOnKeyDown}
        />
      ) : (
        <StyledTypography
          {...props}
          variant={variant}
          fontWeight={fontWeight}
          onClick={handleClickFromViewMode}
        >
          {value}
        </StyledTypography>
      )}
    </>
  );
});

EditableInputBase.displayName = 'EditableInput'; // Add display name

export const EditableInput = typedMemo(EditableInputBase);
