import React from 'react';
import {
  Avatar,
  Box,
  Button as ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider as DividerBase,
  Grid,
  IconButton,
  Input,
  LinearProgress,
  Modal,
  styled,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Person2Icon from '@mui/icons-material/Person2';
import LabelIcon from '@mui/icons-material/Label';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AttachmentIcon from '@mui/icons-material/Attachment';
import PowerInputIcon from '@mui/icons-material/PowerInput';
import EastIcon from '@mui/icons-material/East';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import ArchiveIcon from '@mui/icons-material/Archive';
import ShareIcon from '@mui/icons-material/Share';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';

import tasksApi from '../../../../services/api/endpoints/tasks';
import { IUser } from '../../../../types/User';
import { TextEditor } from '../../../../components/TextEditor';
import { formatDate } from '../../../../utils/formatDate';
import { AttachmentBtn } from './elements/AttachmentBtn';
import { TaskCover } from './styles';

interface TaskViewProps {
  open: boolean;
  onClose: () => void;
  taskId: number;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 768,
  // bgcolor: '#091e420f',
  bgcolor: '#ffffff',
  // border: '2px solid #000',
  borderRadius: 3,
  minHeight: 600,
  boxShadow: 24,
  boxSizing: 'border-box',
  overflow: 'hidden',
};

const Button = styled(ButtonBase)`
  background-color: #091e420f;
  border: none;
  border-radius: 3px;
  box-shadow: none;
  box-sizing: border-box;
  color: #172b4d;
  cursor: pointer;
  font-weight: 500;
  height: 32px;
  margin-top: 8px;
  max-width: 300px;
  overflow: hidden;
  padding: 6px 12px;
  position: relative;
  text-decoration: none;
  text-overflow: ellipsis;
  transition-duration: 85ms;
  transition-property: background-color, border-color, box-shadow;
  transition-timing-function: ease;
  -webkit-user-select: none;
  user-select: none;
  white-space: nowrap;
  text-transform: none;
  max-width: 300px;
  width: 100%;
  justify-content: flex-start;
  &:hover {
    border: none;
    box-shadow: none;
    color: #172b4d;
    background-color: #091e4224;
    text-decoration: none;
  }
`;

const Divider = styled(DividerBase)`
  background-color: #091e4224;
`;

const Label = styled(Typography)`
  display: inline-block;
  position: relative;
  margin-bottom: 0;
  border-radius: 3px;
  padding: 0 12px;
  max-width: 100%;
  min-width: 48px;
  height: 32px;
  box-sizing: border-box;
  background-color: #091e420f;
  line-height: 32px;
  color: #172b4d;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.color-red {
    background-color: #f44336;
    color: #fff;
  }

  &.color-yellow {
    background-color: #ffeb3b;
    color: #172b4d;
  }

  &.color-purple {
    background-color: #9c27b0;
    color: #fff;
  }
`;

const members: IUser[] = [
  {
    id: 11,
    firstName: 'Duncan',
    lastName: 'Legros',
    email: '',
    provider: 'local',
    createdAt: '2024-04-12T18:04:58.426Z',
    updatedAt: '2024-04-18T06:45:26.400Z',
    photo: null,
  },
  {
    id: 12,
    firstName: 'Duncan',
    lastName: 'Legros',
    email: '',
    provider: 'local',
    createdAt: '2024-04-12T18:04:58.426Z',
    updatedAt: '2024-04-18T06:45:26.400Z',
    photo: null,
  },
];

const checkLists = [
  {
    id: 1,
    name: 'checklist 1 test',
    items: [
      {
        id: 1,
        name: 'todo 1',
        checked: false,
      },
      {
        id: 2,
        name: 'todo 2',
        checked: true,
      },
      {
        id: 3,
        name: 'todo 3',
        checked: false,
      },
    ],
  },
];

export default function TaskView({ open, onClose, taskId }: TaskViewProps) {
  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () =>
      tasksApi.getById(taskId, {
        join: [
          {
            field: 'assignee',
          },
          {
            field: 'assignee.photo',
          },
          {
            field: 'cover',
          },
          {
            field: 'attachments',
          },
          {
            field: 'taskList',
          },
          {
            field: 'labels',
          },
          {
            field: 'comments',
          },
          {
            field: 'comments.author',
          },
        ],
      }),
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      maxWidth={false}
      scroll="body"
      sx={{
        padding: 0,
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <ButtonBase
        startIcon={<CreditCardIcon />}
        sx={{
          position: 'absolute',
          right: 8,
          top: 123,
          textTransform: 'none',
        }}
      >
        Cover
      </ButtonBase>
      <DialogContent
        sx={{
          width: 768,
          minHeight: 600,
          padding: 0,
        }}
      >
        {isLoading ? (
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Loading...
          </Typography>
        ) : (
          <Grid
            container
            sx={{
              bgcolor: '#ffffff',
            }}
          >
            <Grid item xs={12}>
              <TaskCover src={task?.cover?.path ?? ''} />
              <ButtonBase></ButtonBase>
            </Grid>
            <Grid item xs={12} padding={4}>
              <Grid
                item
                xs={12}
                sx={{
                  minHeight: '32px',
                  padding: '8px 52px 8px 56px',
                  position: 'relative',
                }}
              >
                <Typography variant="h6" sx={{ padding: '12px 0 0' }}>
                  {task?.name}
                </Typography>
                <Grid item container>
                  <Typography
                    variant="subtitle2"
                    sx={{ margin: '4px 8px 4px 2px' }}
                  >
                    In list{' '}
                    <span style={{ textDecoration: 'underline' }}>
                      {task?.taskList?.name}
                    </span>
                  </Typography>
                  <VisibilityIcon
                    sx={{
                      display: 'inline-block',
                      margin: '4px 8px 4px 2px',
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container item xs={12}>
                <Grid
                  container
                  item
                  xs={9}
                  direction="column"
                  sx={{
                    minHeight: '24px',
                    padding: '0 8px 8px 16px',
                    position: 'relative',
                    width: '552px',
                  }}
                >
                  <Grid
                    item
                    container
                    direction="row"
                    flexWrap="nowrap"
                    sx={
                      {
                        // marginLeft: '40px',
                        // marginTop: '8px',
                      }
                    }
                  >
                    <Grid item container direction="column">
                      <Typography variant="subtitle2" noWrap>
                        Members
                      </Typography>
                      <Grid item container>
                        {members.map((member) => (
                          <Avatar
                            key={member.id}
                            alt="Remy Sharp"
                            sx={{
                              width: 32,
                              height: 32,
                            }}
                            src="/static/images/avatar/1.jpg"
                          />
                        ))}
                      </Grid>
                    </Grid>
                    <Grid item container direction="column">
                      <Typography variant="subtitle2" noWrap>
                        Labels
                      </Typography>
                      <Grid item container gap="2px">
                        {task?.labels?.map((label) => (
                          <Grid item key={label.id}>
                            <Label noWrap className={`color-${label.color}`}>
                              {label.name}
                            </Label>
                          </Grid>
                        ))}
                        <IconButton>
                          <AddIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                    <Grid item container direction="column">
                      <Typography variant="subtitle2">Notifications</Typography>
                      <ButtonBase size="small" startIcon={<VisibilityIcon />}>
                        Watch
                      </ButtonBase>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    sx={{ width: '100%' }}
                    flexDirection="column"
                    wrap="nowrap"
                  >
                    <TextEditor
                      data={task?.description}
                      height={300}
                      isReadOnly={true}
                    />
                  </Grid>
                  <Grid item container direction="column">
                    <Grid item>
                      <Typography variant="subtitle2">Attachments</Typography>
                    </Grid>
                    <Grid item container direction="column">
                      {task?.attachments?.map((attachment) => (
                        <Grid
                          item
                          container
                          key={attachment.id}
                          wrap="nowrap"
                          sx={{
                            '&:hover': {
                              backgroundColor: '#091e420f',
                            },
                          }}
                        >
                          <Grid item>
                            <img alt="Remy Sharp" src={attachment.path} />
                          </Grid>
                          <Grid item container direction="column">
                            <Grid item>
                              <Typography variant="body2">
                                {attachment.name}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="caption">
                                <span>
                                  Added{' '}
                                  <span>
                                    {formatDate(
                                      new Date(attachment.createdAt),
                                      'StandardWithHours',
                                    )}
                                  </span>
                                </span>
                                <span>
                                  <AttachmentBtn>Comment</AttachmentBtn>
                                </span>
                                <span>
                                  <AttachmentBtn>Download</AttachmentBtn>
                                </span>
                                <span>
                                  <AttachmentBtn>Delete</AttachmentBtn>
                                </span>
                                <span>
                                  <AttachmentBtn>Edit</AttachmentBtn>
                                </span>
                              </Typography>
                            </Grid>
                            <Grid item>
                              <ButtonBase size="small">Make cover</ButtonBase>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid item container direction="column">
                    {checkLists.map((checkList) => (
                      <Grid item key={checkList.id}>
                        <Grid item>
                          <Typography variant="subtitle2">
                            {checkList.name}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <LinearProgress
                            variant="determinate"
                            value={
                              (checkList.items.filter((i) => i.checked).length /
                                checkList.items.length) *
                              100
                            }
                          />
                        </Grid>
                        <Grid item container direction="column">
                          {checkList.items.map((item) => (
                            <Grid item key={item.id}>
                              <Grid item>
                                <Typography variant="body2">
                                  {item.name}
                                </Typography>
                              </Grid>
                            </Grid>
                          ))}
                        </Grid>
                        <Grid item>
                          <ButtonBase size="small" startIcon={<AddIcon />}>
                            Add an item
                          </ButtonBase>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                  <Grid item container direction="column">
                    <Grid item>
                      <Typography variant="subtitle2">Activity</Typography>
                    </Grid>
                    <Grid item>
                      <Input
                        placeholder="Write a comment..."
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    {task?.comments?.map((comment) => (
                      <Grid item key={comment.id} container direction="column">
                        <Grid item>
                          <span>
                            {comment.author.firstName +
                              ' ' +
                              comment.author.lastName}
                          </span>
                          <span>
                            {formatDate(
                              new Date(comment.createdAt),
                              'StandardWithHours',
                            )}
                          </span>
                        </Grid>
                        <Grid item>
                          <Typography variant="body2">
                            {comment.message}
                          </Typography>
                        </Grid>
                        <Grid item>
                          {/* emoji */}
                          <ButtonBase size="small">Edit</ButtonBase>
                          <ButtonBase size="small">Delete</ButtonBase>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid container item xs={3}>
                  <Grid
                    item
                    container
                    direction="column"
                    alignItems="flex-start"
                  >
                    <Typography variant="subtitle2">Add to card</Typography>
                    <Button size="small" startIcon={<Person2Icon />}>
                      Members
                    </Button>
                    <Button size="small" startIcon={<LabelIcon />}>
                      Labels
                    </Button>
                    <Button size="small" startIcon={<ChecklistIcon />}>
                      Checklist
                    </Button>
                    <Button size="small" startIcon={<ScheduleIcon />}>
                      Dates
                    </Button>
                    <Button size="small" startIcon={<AttachmentIcon />}>
                      Attachment
                    </Button>
                    <Button size="small" startIcon={<PowerInputIcon />}>
                      Custom fields
                    </Button>
                  </Grid>
                  <Grid
                    item
                    container
                    direction="column"
                    alignItems="flex-start"
                  >
                    <Typography variant="subtitle2">Actions</Typography>
                    <Button size="small" startIcon={<EastIcon />}>
                      Move
                    </Button>
                    <Button size="small" startIcon={<ContentCopyIcon />}>
                      Copy
                    </Button>
                    <Button size="small" startIcon={<DashboardCustomizeIcon />}>
                      Make template
                    </Button>
                    <Divider flexItem sx={{ marginTop: '8px' }} />
                    <Button size="small" startIcon={<ArchiveIcon />}>
                      Archive
                    </Button>
                    <Button size="small" startIcon={<ShareIcon />}>
                      Share
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}
