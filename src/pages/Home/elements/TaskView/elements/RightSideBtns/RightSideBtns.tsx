import React from 'react';

import { StyledDivider } from '../../styles';
import { Button } from './styles';

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
      <Grid item container direction="column" alignItems="flex-start" gap="8px">
        <Typography variant="subtitle2">Add to card</Typography>
        <Button startIcon={<Person2Icon />}>Members</Button>
        <Button startIcon={<LabelIcon />}>Labels</Button>
        <Button startIcon={<ChecklistIcon />}>Checklist</Button>
        <Button startIcon={<ScheduleIcon />}>Dates</Button>
        <Button startIcon={<AttachmentIcon />}>Attachment</Button>
        <Button startIcon={<PowerInputIcon />}>Custom fields</Button>
      </Grid>
      <Grid item container direction="column" alignItems="flex-start" gap="8px">
        <Typography variant="subtitle2" sx={{ marginTop: '8px' }}>
          Actions
        </Typography>
        <Button startIcon={<EastIcon />}>Move</Button>
        <Button startIcon={<ContentCopyIcon />}>Copy</Button>
        <Button startIcon={<DashboardCustomizeIcon />}>Make template</Button>
        <StyledDivider flexItem />
        <Button startIcon={<ArchiveIcon />}>Archive</Button>
        <Button startIcon={<ShareIcon />}>Share</Button>
      </Grid>
    </Grid>
  );
}
