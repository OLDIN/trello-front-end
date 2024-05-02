import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { tasksApi } from 'services/api';
import { IPartialUpdateTask } from 'services/api/endpoints/tasks';
import { QueryKey } from 'enums/QueryKey.enum';

import { TextEditor } from '../../../../components/TextEditor';
import { Button } from 'components/Button';
import { EditableInput } from 'components/EditableInput';

import { useTaskDetails } from './hooks/useTaskDetails';
import { AddAttachmentPopover } from './elements/AddAttachmentPopover/AddAttachmentPopover';
import { Attachment } from './elements/Attachment/Attachment';
import { CheckList } from './elements/CheckList/CheckList';
import { RightSideButtons } from './elements/RightSideBtns/RightSideBtns';
import { TaskComment } from './elements/TaskComment/TaskComment';
import { TaskLabel } from './elements/TaskLabel/TaskLabel';
import {
  StyledTaskBlock,
  StyledTaskBlockTitle,
  TaskCover,
  WatchButton,
} from './styles';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Avatar,
  Button as ButtonBase,
  Dialog,
  DialogContent,
  Grid,
  Icon,
  IconButton,
  Input,
  Typography,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import DOMPurify from 'dompurify';

import './TaskView.scss';

interface TaskViewProps {
  open: boolean;
  onClose: () => void;
  taskId: number;
  boardId: number;
}

export function TaskView({ open, onClose, taskId, boardId }: TaskViewProps) {
  const queryClient = useQueryClient();
  const { hash } = useLocation();
  const [isReadOnlyDescription, setIsReadOnlyDescription] = useState(true);
  const [attachmentPopoverSettings, setAttachmentPopoverSettings] = useState<{
    isOpenAddAttachmentPopover: boolean;
    anchorEl: HTMLElement | null;
  }>({
    isOpenAddAttachmentPopover: false,
    anchorEl: null,
  });
  const [descriptionString, setDescriptionString] = useState<string>('');

  const { data: task, isLoading } = useTaskDetails({ taskId });
  const { mutate: updateTask, isPending: isPendingTaskUpdate } = useMutation({
    mutationFn: (data: IPartialUpdateTask) =>
      tasksApi.partialUpdate(taskId, data),
    onSuccess: (result) => {
      queryClient.setQueryData([QueryKey.TASKS, taskId], (oldTask) => {
        if (!oldTask) return;

        return {
          ...oldTask,
          ...result,
        };
      });
      setIsReadOnlyDescription(true);
    },
  });

  const { register, getValues, setValue } = useForm({
    values: {
      name: task?.name,
    },
  });

  useEffect(() => {
    if (task?.name) {
      setValue('name', task.name);
    }
  }, [setValue, task]);

  const highlightedCommentId = useMemo(() => {
    if (hash) {
      return parseInt(hash.replace('#comment-', ''));
    }
  }, [hash]);

  const enabledLabels = useMemo(() => {
    return task?.labels?.filter((label) => label.isEnable) ?? [];
  }, [task?.labels]);

  const handleOnPressEnterName = () => {
    updateTask({
      name: getValues('name'),
    });
  };

  const handleAddAttachment = (e: MouseEvent<HTMLElement>) => {
    setAttachmentPopoverSettings({
      isOpenAddAttachmentPopover: true,
      anchorEl: e.currentTarget,
    });
  };

  const handleCancelDescriptionEdit = () => {
    setIsReadOnlyDescription(true);
    setDescriptionString(task?.description ?? '');
  };

  const handleSaveDescription = () => {
    updateTask({ description: descriptionString });
  };

  const handleToggleWatch = () => {
    updateTask({ isWatched: !task?.isWatched });
  };

  return (
    <>
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
        {task?.cover && (
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
        )}
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
              {task?.cover?.path && (
                <Grid item xs={12}>
                  <TaskCover src={task.cover.path} />
                </Grid>
              )}
              <Grid item xs={12} padding={3}>
                <Grid
                  item
                  xs={12}
                  container
                  sx={{
                    minHeight: '32px',
                    padding: '8px 0px 8px 0px',
                    // padding: '8px 52px 8px 56px',
                    position: 'relative',
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    gap: '10px',
                  }}
                >
                  {/* sx={{ padding: '12px 0 0' }} */}
                  <Grid item>
                    <Icon>
                      <ViewAgendaOutlinedIcon />
                    </Icon>
                  </Grid>
                  <Grid item container>
                    <EditableInput
                      variant="h6"
                      value={task?.name}
                      onPressEnter={handleOnPressEnterName}
                      {...register('name')}
                    />

                    <Grid item container alignContent="center">
                      <Typography
                        variant="subtitle2"
                        sx={{ margin: '4px 8px 4px 2px' }}
                      >
                        In list{' '}
                        <span style={{ textDecoration: 'underline' }}>
                          {task?.taskList?.name}
                        </span>
                      </Typography>
                      {task?.isWatched && (
                        <VisibilityOutlinedIcon
                          sx={{
                            display: 'inline-block',
                            margin: '4px 8px 4px 2px',
                          }}
                        />
                      )}
                    </Grid>
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
                      flexWrap="wrap"
                      gap="8px"
                      sx={
                        {
                          // marginLeft: '40px',
                          // marginTop: '8px',
                        }
                      }
                    >
                      {!!task?.assignees?.length && (
                        <Grid
                          item
                          container
                          direction="column"
                          flexBasis="content"
                        >
                          <Typography variant="subtitle2" noWrap>
                            Members
                          </Typography>
                          <Grid item container gap="5px">
                            {task?.assignees?.map((member) => (
                              <Avatar
                                key={member.id}
                                alt={member.firstName + ' ' + member.lastName}
                                sx={{
                                  width: 32,
                                  height: 32,
                                  fontSize: 16,
                                }}
                                src={member.photo?.path}
                              >
                                {member.firstName[0] + member.lastName[0]}
                              </Avatar>
                            ))}
                            <IconButton
                              sx={{
                                width: 32,
                                height: 32,
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      )}
                      {!!enabledLabels.length && (
                        <Grid
                          item
                          container
                          direction="column"
                          flexBasis="content"
                        >
                          <Typography variant="subtitle2" noWrap>
                            Labels
                          </Typography>
                          <Grid item container gap="4px">
                            {enabledLabels.map((label) => (
                              <TaskLabel key={label.id} label={label} />
                            ))}
                            <IconButton
                              sx={{
                                width: 32,
                                height: 32,
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      )}
                      <Grid
                        item
                        container
                        direction="column"
                        flexBasis="content"
                      >
                        <Typography variant="subtitle2">
                          Notifications
                        </Typography>
                        <WatchButton
                          size="small"
                          startIcon={<VisibilityOutlinedIcon />}
                          endIcon={task?.isWatched && <DoneOutlinedIcon />}
                          variant="contained"
                          onClick={handleToggleWatch}
                        >
                          Watch
                        </WatchButton>
                      </Grid>
                    </Grid>
                    <StyledTaskBlock item container flexDirection="column">
                      <Grid item container justifyContent="space-between">
                        <Grid item>
                          <Typography variant="subtitle2">
                            Description
                          </Typography>
                        </Grid>
                        <Grid item>
                          {isReadOnlyDescription && (
                            <Button
                              onClick={() => setIsReadOnlyDescription(false)}
                            >
                              Edit
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                      <Grid item container gap="10px">
                        {!isReadOnlyDescription ? (
                          <>
                            <TextEditor
                              data={task?.description}
                              height={300}
                              isReadOnly={
                                isReadOnlyDescription || isPendingTaskUpdate
                              }
                              onChange={(data) => setDescriptionString(data)}
                            />
                            <ButtonBase
                              variant="contained"
                              disabled={isPendingTaskUpdate}
                              onClick={() => handleSaveDescription()}
                              startIcon={
                                isPendingTaskUpdate && (
                                  <CircularProgress size={16} />
                                )
                              }
                            >
                              Save
                            </ButtonBase>
                            <ButtonBase
                              variant="text"
                              onClick={() => handleCancelDescriptionEdit()}
                              disabled={isPendingTaskUpdate}
                            >
                              Cancel
                            </ButtonBase>
                          </>
                        ) : (
                          <Typography
                            variant="body1"
                            sx={{ whiteSpace: 'pre-wrap' }}
                            onClick={() => setIsReadOnlyDescription(false)}
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                task?.description ?? '',
                              ),
                            }}
                          />
                        )}
                      </Grid>
                    </StyledTaskBlock>
                    {!!task?.attachments?.length && (
                      <StyledTaskBlock item container direction="column">
                        <StyledTaskBlockTitle
                          item
                          container
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Grid item>
                            <Typography variant="subtitle2">
                              Attachments
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Button onClick={handleAddAttachment}>Add</Button>
                          </Grid>
                        </StyledTaskBlockTitle>
                        <Grid item container direction="column">
                          {task?.attachments?.map((attachment) => (
                            <Attachment
                              key={attachment.id}
                              attachment={attachment}
                              taskId={task.id}
                              taskCoverId={task.cover?.id}
                            />
                          ))}
                        </Grid>
                      </StyledTaskBlock>
                    )}
                    <StyledTaskBlock item container direction="column">
                      {task?.checklists?.map((checkList) => (
                        <CheckList
                          key={checkList.id}
                          checkList={checkList}
                          taskId={taskId}
                        />
                      ))}
                    </StyledTaskBlock>
                    <StyledTaskBlock item container direction="column">
                      <Grid item container justifyContent="space-between">
                        <Grid item>
                          <Typography variant="subtitle2">Activity</Typography>
                        </Grid>
                        <Grid item>
                          <Button>Show details</Button>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        sx={{
                          // margin: '0 0 8px 40px',
                          margin: '0 0 8px 0px',
                        }}
                      >
                        {/* <StyledCommentInput
                          placeholder="Write a comment..."
                          sx={{ width: '100%' }}
                        /> */}
                        <TextEditor
                          // height={300}
                          isReadOnly={
                            isReadOnlyDescription || isPendingTaskUpdate
                          }
                          onChange={(data) => setDescriptionString(data)}
                        />
                      </Grid>
                      {task?.comments?.map((comment) => (
                        <TaskComment
                          key={comment.id}
                          comment={comment}
                          isHighlighted={highlightedCommentId === comment.id}
                        />
                      ))}
                    </StyledTaskBlock>
                  </Grid>
                  <RightSideButtons
                    boardId={boardId}
                    taskId={taskId}
                    taskLabels={task?.labels ?? []}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
      {task && (
        <AddAttachmentPopover
          openPopover={attachmentPopoverSettings.isOpenAddAttachmentPopover}
          anchorEl={attachmentPopoverSettings.anchorEl}
          onClose={() =>
            setAttachmentPopoverSettings({
              isOpenAddAttachmentPopover: false,
              anchorEl: null,
            })
          }
          task={task}
        />
      )}
    </>
  );
}
