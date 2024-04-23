import React, { useState } from 'react';

import type { TaskCheckListItem } from '../../../../../types/TaskChecklist';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Checkbox, Grid, IconButton, styled, Typography } from '@mui/material';

interface CheckListItemProps {
  item: TaskCheckListItem;
}

const CheckListItemWrapper = styled(Grid)`
  border-radius: 12px;
  box-sizing: border-box;
  clear: both;
  padding-left: 40px;
  position: relative;
  transform-origin: left bottom;
  transition-duration: 0.15s;
  transition-property: transform, opacity, height, padding, margin,
    background-color;
  transition-timing-function: ease-in;
`;

export function CheckListItem({ item }: CheckListItemProps) {
  const [isHover, setIsHover] = useState(false);

  return (
    <CheckListItemWrapper
      item
      key={item.id}
      container
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      wrap="nowrap"
    >
      <Grid item>
        <Checkbox checked={item.checked ?? false} />
      </Grid>
      <Grid item container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="body2">{item.name}</Typography>
        </Grid>
        {isHover && (
          <Grid item>
            <IconButton size="small">
              <AccessTimeIcon />
            </IconButton>
            <IconButton size="small">
              <PersonAddAltIcon />
            </IconButton>
            <IconButton size="small">
              <MoreHorizIcon />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </CheckListItemWrapper>
  );
}
