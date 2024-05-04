import React, { useMemo, useState } from 'react';

import { ITask } from 'types/Task';

import { Popover } from 'components/Popover';

import { useUpdateTask } from 'pages/Home/hooks/useUpdateTask';
import { ActionsCopyPopoverContent } from './elements/ActionsCopyPopoverContent/ActionsCopyPopoverContent';
import { ActionsMovePopoverContent } from './elements/ActionsMovePopoverContent/ActionsMovePopoverContent';
import { AttachmentPopoverContent } from './elements/AttachmentPopoverContent/AttachmentPopoverContent';
import { ChecklistPopoverContent } from './elements/ChecklistPopoverContent/ChecklistPopoverContent';
import { CoverPopoverContent } from './elements/CoverPopoverContent/CoverPopoverContent';
import { DatesPopoverContent } from './elements/DatesPopoverContent/DatesPopoverContent';
import { MembersPopoverContent } from './elements/MembersPopoverContent/MembersPopoverContent';
import { StyledDivider } from '../../styles';
import { Button, RightSideButtonsWrapper, TemplateCheckIcon } from './styles';

import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import AttachmentIcon from '@mui/icons-material/Attachment';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import EastIcon from '@mui/icons-material/East';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import PowerInputIcon from '@mui/icons-material/PowerInput';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ShareIcon from '@mui/icons-material/Share';
import { Grid, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { LabelsPopoverContent } from '../LabelsPopoverContent/LabelsPopoverContent';

interface RightSideBtnsProps {
  task: ITask;
}

export function RightSideButtons({ task }: RightSideBtnsProps) {
  const [popoverSettings, setPopoverSettings] = useState<{
    isOpenPopover: boolean;
    anchorEl: HTMLElement | null;
    title: string | null;
    component: ((...props: any) => JSX.Element) | null;
  }>({
    isOpenPopover: false,
    anchorEl: null,
    title: null,
    component: null,
  });

  const { mutate: updateTask, isPending: isPendingTaskUpdate } = useUpdateTask({
    taskId: task.id,
  });

  const closePopover = () =>
    setPopoverSettings({
      anchorEl: null,
      title: null,
      isOpenPopover: false,
      component: null,
    });

  const content = useMemo(() => {
    switch (popoverSettings.component?.name) {
      case 'MembersPopoverContent':
        return (
          <MembersPopoverContent boardId={task.boardId} taskId={task.id} />
        );
      case 'LabelsPopoverContent':
        return <LabelsPopoverContent taskLabels={task.labels ?? []} />;
      case 'ChecklistPopoverContent':
        return (
          <ChecklistPopoverContent
            taskId={task.id}
            onSuccessfulSubmit={() => closePopover()}
          />
        );
      case 'DatesPopoverContent':
        return <DatesPopoverContent />;
      case 'AttachmentPopoverContent':
        return <AttachmentPopoverContent />;
      case 'CoverPopoverContent':
        return <CoverPopoverContent />;
      case 'ActionsMovePopoverContent':
        return <ActionsMovePopoverContent />;
      case 'ActionsCopyPopoverContent':
        return <ActionsCopyPopoverContent />;

      default:
        return <></>;
    }
  }, [popoverSettings.component?.name, task]);

  const toggleIsTemplate = () => {
    updateTask({ isTemplate: !task.isTemplate });
  };

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
            startIcon={<Person2OutlinedIcon />}
            onClick={(e) =>
              setPopoverSettings({
                anchorEl: e.currentTarget,
                title: 'Members',
                isOpenPopover: true,
                component: MembersPopoverContent,
              })
            }
          >
            Members
          </Button>
          <Button
            startIcon={<LabelOutlinedIcon />}
            onClick={(e) =>
              setPopoverSettings({
                anchorEl: e.currentTarget,
                title: 'Labels',
                isOpenPopover: true,
                component: LabelsPopoverContent,
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
                component: ChecklistPopoverContent,
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
                component: DatesPopoverContent,
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
                component: AttachmentPopoverContent,
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
                component: CoverPopoverContent,
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
                component: ActionsMovePopoverContent,
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
                component: ActionsCopyPopoverContent,
              })
            }
          >
            Copy
          </Button>
          <Button
            startIcon={
              isPendingTaskUpdate ? (
                <CircularProgress size={16} />
              ) : (
                <DashboardCustomizeIcon />
              )
            }
            endIcon={task.isTemplate && <TemplateCheckIcon />}
            onClick={toggleIsTemplate}
            disabled={isPendingTaskUpdate}
          >
            {task.isTemplate ? 'Template' : 'Make template'}
          </Button>
          <StyledDivider flexItem />
          <Button startIcon={<ArchiveOutlinedIcon />}>Archive</Button>
          <Button startIcon={<ShareIcon />}>Share</Button>
        </Grid>
      </RightSideButtonsWrapper>
      <Popover
        openPopover={popoverSettings.isOpenPopover}
        anchorEl={popoverSettings.anchorEl}
        title={popoverSettings.title ?? ''}
        onClose={() => closePopover()}
      >
        {content}
      </Popover>
    </>
  );
}
