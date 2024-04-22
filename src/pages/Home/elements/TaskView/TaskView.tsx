import React from 'react';

import { TextEditor } from '../../../../components/TextEditor';

import { useTaskDetails } from './hooks/useTaskDetails';
import { IUser } from '../../../../types/User';
import { Attachment } from './elements/Attachment';
import { CheckList } from './elements/CheckList';
import { RightSideBtns } from './elements/RightSideBtns';
import { TaskComment } from './elements/TaskComment';
import { TaskLabel } from './elements/TaskLabel';
import { StyledTaskBlock, TaskCover } from './styles';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Avatar,
  Button,
  Button as ButtonBase,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Input,
  Typography,
} from '@mui/material';

interface TaskViewProps {
  open: boolean;
  onClose: () => void;
  taskId: number;
}

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

export function TaskView({ open, onClose, taskId }: TaskViewProps) {
  const { data: task, isLoading } = useTaskDetails({ taskId });

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

        '& .MuiDialog-paper': {
          borderRadius: '10px',
        },
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
              bgcolor: '#ededed',
            }}
          >
            <Grid item xs={12}>
              <TaskCover src={task?.cover?.path ?? ''} />
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
                          <TaskLabel key={label.id} label={label} />
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
                  <StyledTaskBlock item container direction="column">
                    <Grid item>
                      <Typography variant="subtitle2">Attachments</Typography>
                    </Grid>
                    <Grid item container direction="column">
                      {task?.attachments?.map((attachment) => (
                        <Attachment
                          key={attachment.id}
                          attachment={attachment}
                        />
                      ))}
                    </Grid>
                  </StyledTaskBlock>
                  <StyledTaskBlock item container direction="column">
                    {checkLists.map((checkList) => (
                      <CheckList key={checkList.id} checkList={checkList} />
                    ))}
                  </StyledTaskBlock>
                  <StyledTaskBlock item container direction="column">
                    <Grid item container justifyContent="space-between">
                      <Grid item>
                        <Typography variant="subtitle2">Activity</Typography>
                      </Grid>
                      <Grid item>
                        <Button size="small">Show details</Button>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Input
                        placeholder="Write a comment..."
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    {task?.comments?.map((comment) => (
                      <TaskComment key={comment.id} comment={comment} />
                    ))}
                  </StyledTaskBlock>
                </Grid>
                <RightSideBtns />
              </Grid>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}