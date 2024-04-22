import React from 'react';

import { StyledButton, StyledDivider } from '../styles';

import ArchiveIcon from '@mui/icons-material/Archive';
import AttachmentIcon from '@mui/icons-material/Attachment';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import EastIcon from '@mui/icons-material/East';
import LabelIcon from '@mui/icons-material/Label';
import Person2Icon from '@mui/icons-material/Person2';
import PowerInputIcon from '@mui/icons-material/PowerInput';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ShareIcon from '@mui/icons-material/Share';
import { Grid, Typography } from '@mui/material';

export function RightSideBtns() {
  return (
    <Grid container item xs={3} alignContent="start">
      <Grid item container direction="column" alignItems="flex-start">
        <Typography variant="subtitle2">Add to card</Typography>
        <StyledButton size="small" startIcon={<Person2Icon />}>
          Members
        </StyledButton>
        <StyledButton size="small" startIcon={<LabelIcon />}>
          Labels
        </StyledButton>
        <StyledButton size="small" startIcon={<ChecklistIcon />}>
          Checklist
        </StyledButton>
        <StyledButton size="small" startIcon={<ScheduleIcon />}>
          Dates
        </StyledButton>
        <StyledButton size="small" startIcon={<AttachmentIcon />}>
          Attachment
        </StyledButton>
        <StyledButton size="small" startIcon={<PowerInputIcon />}>
          Custom fields
        </StyledButton>
      </Grid>
      <Grid item container direction="column" alignItems="flex-start">
        <Typography variant="subtitle2">Actions</Typography>
        <StyledButton size="small" startIcon={<EastIcon />}>
          Move
        </StyledButton>
        <StyledButton size="small" startIcon={<ContentCopyIcon />}>
          Copy
        </StyledButton>
        <StyledButton size="small" startIcon={<DashboardCustomizeIcon />}>
          Make template
        </StyledButton>
        <StyledDivider flexItem sx={{ marginTop: '8px' }} />
        <StyledButton size="small" startIcon={<ArchiveIcon />}>
          Archive
        </StyledButton>
        <StyledButton size="small" startIcon={<ShareIcon />}>
          Share
        </StyledButton>
      </Grid>
    </Grid>
  );
}