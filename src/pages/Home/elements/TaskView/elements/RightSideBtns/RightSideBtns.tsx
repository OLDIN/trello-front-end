import React, { useState } from 'react';

import { Popover } from 'components/Popover';

import { ActionsCopyPopoverContent } from './elements/ActionsCopyPopoverContent/ActionsCopyPopoverContent';
import { ActionsMovePopoverContent } from './elements/ActionsMovePopoverContent/ActionsMovePopoverContent';
import { AttachmentPopoverContent } from './elements/AttachmentPopoverContent/AttachmentPopoverContent';
import { ChecklistPopoverContent } from './elements/ChecklistPopoverContent/ChecklistPopoverContent';
import { CoverPopoverContent } from './elements/CoverPopoverContent/CoverPopoverContent';
import { DatesPopoverContent } from './elements/DatesPopoverContent/DatesPopoverContent';
import { LabelsPopoverContent } from './elements/LabelsPopoverContent/LabelsPopoverContent';
import { MembersPopoverContent } from './elements/MembersPopoverContent/MembersPopoverContent';
import { StyledDivider } from '../../styles';
import { Button, RightSideButtonsWrapper } from './styles';

import ArchiveIcon from '@mui/icons-material/Archive';
import AttachmentIcon from '@mui/icons-material/Attachment';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import EastIcon from '@mui/icons-material/East';
import LabelIcon from '@mui/icons-material/Label';
import Person2Icon from '@mui/icons-material/Person2';
import PowerInputIcon from '@mui/icons-material/PowerInput';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ShareIcon from '@mui/icons-material/Share';
import { Grid, Typography } from '@mui/material';

interface RightSideBtnsProps {
  boardId: number;
  taskId: number;
}

export function RightSideButtons({ boardId, taskId }: RightSideBtnsProps) {
  const [popoverSettings, setPopoverSettings] = useState<{
    isOpenPopover: boolean;
    anchorEl: HTMLElement | null;
    title: string | null;
    content: React.ReactNode | null;
  }>({
    isOpenPopover: false,
    anchorEl: null,
    title: null,
    content: null,
  });

  return (
    <>
      <RightSideButtonsWrapper container item xs={3} alignContent="start">
        <Grid
          item
          container
          direction="column"
          alignItems="flex-start"
          gap="8px"
        >
          <Typography variant="subtitle2">Add to card</Typography>
          <Button
            startIcon={<Person2Icon />}
            onClick={(e) =>
              setPopoverSettings({
                anchorEl: e.currentTarget,
                title: 'Members',
                isOpenPopover: true,
                content: (
                  <MembersPopoverContent boardId={boardId} taskId={taskId} />
                ),
              })
            }
          >
            Members
          </Button>
          <Button
            startIcon={<LabelIcon />}
            onClick={(e) =>
              setPopoverSettings({
                anchorEl: e.currentTarget,
                title: 'Labels',
                isOpenPopover: true,
                content: <LabelsPopoverContent />,
              })
            }
          >
            Labels
          </Button>
          <Button
            startIcon={<ChecklistIcon />}
            onClick={(e) =>
              setPopoverSettings({
                anchorEl: e.currentTarget,
                title: 'Checklist',
                isOpenPopover: true,
                content: <ChecklistPopoverContent />,
              })
            }
          >
            Checklist
          </Button>
          <Button
            startIcon={<ScheduleIcon />}
            onClick={(e) =>
              setPopoverSettings({
                anchorEl: e.currentTarget,
                title: 'Dates',
                isOpenPopover: true,
                content: <DatesPopoverContent />,
              })
            }
          >
            Dates
          </Button>
          <Button
            startIcon={<AttachmentIcon />}
            onClick={(e) =>
              setPopoverSettings({
                anchorEl: e.currentTarget,
                title: 'Attachment',
                isOpenPopover: true,
                content: <AttachmentPopoverContent />,
              })
            }
          >
            Attachment
          </Button>
          <Button
            startIcon={<CreditCardIcon />}
            onClick={(e) =>
              setPopoverSettings({
                anchorEl: e.currentTarget,
                title: 'Cover',
                isOpenPopover: true,
                content: <CoverPopoverContent />,
              })
            }
          >
            Cover
          </Button>
          <Button startIcon={<PowerInputIcon />}>Custom fields</Button>
        </Grid>
        <Grid
          item
          container
          direction="column"
          alignItems="flex-start"
          gap="8px"
        >
          <Typography variant="subtitle2" sx={{ marginTop: '8px' }}>
            Actions
          </Typography>
          <Button
            startIcon={<EastIcon />}
            onClick={(e) =>
              setPopoverSettings({
                anchorEl: e.currentTarget,
                title: 'Move',
                isOpenPopover: true,
                content: <ActionsMovePopoverContent />,
              })
            }
          >
            Move
          </Button>
          <Button
            startIcon={<ContentCopyIcon />}
            onClick={(e) =>
              setPopoverSettings({
                anchorEl: e.currentTarget,
                title: 'Copy',
                isOpenPopover: true,
                content: <ActionsCopyPopoverContent />,
              })
            }
          >
            Copy
          </Button>
          <Button startIcon={<DashboardCustomizeIcon />}>Make template</Button>
          <StyledDivider flexItem />
          <Button startIcon={<ArchiveIcon />}>Archive</Button>
          <Button startIcon={<ShareIcon />}>Share</Button>
        </Grid>
      </RightSideButtonsWrapper>
      <Popover
        openPopover={popoverSettings.isOpenPopover}
        anchorEl={popoverSettings.anchorEl}
        title={popoverSettings.title ?? ''}
        onClose={() =>
          setPopoverSettings({
            anchorEl: null,
            title: null,
            isOpenPopover: false,
            content: null,
          })
        }
      >
        {popoverSettings.content}
      </Popover>
    </>
  );
}
