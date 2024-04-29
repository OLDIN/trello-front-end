import { Grid, styled } from '@mui/material';

export const LabelItemWrapper = styled(Grid)`
  cursor: pointer;

  & .label-title {
    display: inline-block;
    position: relative;
    margin-bottom: 0;
    border-radius: 3px;
    padding: 0 12px;
    max-width: 100%;
    min-width: 48px;
    height: 32px;
    box-sizing: border-box;
    line-height: 32px;
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & .label-title:not([class*='label-color-pattern-']) {
    background-color: #091e420f;
    color: #172b4d;
  }

  & .MuiCheckbox-root {
    padding: 0;
  }

  & .MuiIconButton-root {
    border-radius: 3px;
  }
` as typeof Grid;

export const LabelSelect = styled(Grid)`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
  margin-bottom: 8px;
`;

export const LabelSelectOptionWrapper = styled(Grid)`
  border-radius: 3px;
  border: 2px transparent solid;
  cursor: pointer;
  position: relative;

  &.selected {
    border: 2px #0c66e4 solid;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border: 2px #ffffff solid;
      pointer-events: none;
    }
  }
`;

export const LabelSelectOption = styled(Grid)`
  /* border-radius: 3px; */
  /* border: 2px transparent solid; */
  height: 32px;
  cursor: pointer;
`;

export const LabelPreviewWrapper = styled(Grid)`
  padding: 32px;
  background-color: #f7f8f9;
`;

export const LabelPreview = styled(Grid)`
  display: inline-block;
  position: relative;
  margin-bottom: 0;
  border-radius: 3px;
  padding: 0 12px;
  max-width: 100%;
  min-width: 48px;
  width: 100%;
  height: 32px;
  box-sizing: border-box;
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:not([class*='label-color-pattern-']) {
    background-color: #091e420f;
    color: #172b4d;
  }
`;
