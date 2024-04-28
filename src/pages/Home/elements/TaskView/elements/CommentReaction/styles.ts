import { Badge, styled } from '@mui/material';

export const ReactionWrapper = styled(Badge)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #e9f2ff;
  border: 1px solid;
  border-color: #091e4224;
  border-radius: 12px;
  padding: 0px 2px;
  background-color: #fff;
  cursor: pointer;

  &:hover,
  &.my-reaction {
    border-color: #0c66e4;
  }

  &.my-reaction .MuiBadge-badge {
    color: #0c66e4;
  }

  & .MuiIcon-root {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  & > .MuiBadge-badge {
    transform: none;
    position: relative;
    transform-origin: none;
    transition: none;

    font-weight: 700;
    color: #44546f;
    padding: 0 6px 0px 0px;
    min-width: auto;
  }
`;
