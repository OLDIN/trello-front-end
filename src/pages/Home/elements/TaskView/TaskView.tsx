import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { commentsApi } from 'services/api';
import { ICreateCommentPayload } from 'services/api/endpoints/comments';
import { QueryKey } from 'enums/QueryKey.enum';
import useProfile from 'hooks/useProfile/useProfile';
import { ITask } from 'types/Task';

import { TextEditor } from '../../../../components/TextEditor';
import { Button } from 'components/Button';
import { EditableInput } from 'components/EditableInput';

import { useTaskDetails } from './hooks/useTaskDetails';
import { useUpdateTask } from 'pages/Home/hooks/useUpdateTask';
import { AddAttachmentPopover } from './elements/AddAttachmentPopover/AddAttachmentPopover';
import { Attachment } from './elements/Attachment/Attachment';
import { CheckList } from './elements/CheckList/CheckList';
import { RightSideButtons } from './elements/RightSideBtns/RightSideBtns';
import { TaskComment } from './elements/TaskComment/TaskComment';
import { TaskLabel } from './elements/TaskLabel/TaskLabel';
import {
  Container,
  StyledCommentInput,
  StyledDescriptionPlaceholder,
  StyledEmptyDescriptionBlock,
  StyledTaskBlockTitle,
  TaskCover,
  WatchButton,
} from './styles';

import AddIcon from '@mui/icons-material/Add';
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import FormatAlignCenterOutlinedIcon from '@mui/icons-material/FormatAlignCenterOutlined';
import FormatAlignLeftOutlinedIcon from '@mui/icons-material/FormatAlignLeftOutlined';
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

export function TaskView({ open, onClose, taskId }: TaskViewProps) {
  const queryClient = useQueryClient();
  const { hash } = useLocation();
  const [isReadOnlyDescription, setIsReadOnlyDescription] = useState(true);
  const [isReadOnlyCommentInput, setIsReadOnlyCommentInput] = useState(true);
  const [attachmentPopoverSettings, setAttachmentPopoverSettings] = useState<{
    isOpenAddAttachmentPopover: boolean;
    anchorEl: HTMLElement | null;
  }>({
    isOpenAddAttachmentPopover: false,
    anchorEl: null,
  });
  const [descriptionString, setDescriptionString] = useState<string>('');
  const [commentString, setCommentString] = useState<string>('');

  const { data: task, isLoading } = useTaskDetails({ taskId });
  const { data: profile } = useProfile();
  const { mutate: updateTask, isPending: isPendingTaskUpdate } = useUpdateTask({
    taskId,
    onSuccess: () => {
      setIsReadOnlyDescription(true);
    },
  });
  const { mutate: createComment, isPending: isPendingCreateComment } =
    useMutation({
      mutationFn: (data: ICreateCommentPayload) =>
        commentsApi.create(taskId, data, {
          join: [
            {
              field: 'author',
            },
            {
              field: 'author.photo',
            },
          ],
        }),
      onSuccess: (result) => {
        queryClient.setQueryData<ITask>([QueryKey.TASKS, taskId], (oldTask) => {
          if (!oldTask || !oldTask.comments) return oldTask;

          return {
            ...oldTask,
            comments: [result, ...oldTask.comments],
          };
        });
        setCommentString('');
        setIsReadOnlyCommentInput(true);
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

  const handleSaveComment = () => {
    createComment({
      message: commentString,
    });
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
        {task?.cover && !isLoading && (
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
            <Grid
              container
              sx={{
                minHeight: '600px',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CircularProgress />
            </Grid>
          ) : (
            <Grid
              container
              sx={{
                bgcolor: '#ededed',
              }}
            >
              {task?.cover?.path && (
                <Grid item xs={12}>
                  <TaskCover
                    src={task.cover.path}
                    coverBgColor={task.coverBgColor}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Grid
                  item
                  xs={12}
                  container
                  wrap="nowrap"
                  gap="10px"
                  sx={{
                    minHeight: '32px',
                    padding: '8px 24px',
                    // padding: '8px 52px 8px 56px',
                    position: 'relative',
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
                      fontWeight={(theme) => theme.typography.fontWeightBold}
                      value={task?.name}
                      onPressEnter={handleOnPressEnterName}
                      {...register('name')}
                    />

                    <Grid
                      item
                      container
                      alignContent="center"
                      alignItems="center"
                    >
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
                            fontSize: '16px',
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
                      position: 'relative',
                      width: '552px',
                      paddingRight: '8px',
                    }}
                  >
                    <Container
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
                          <Typography
                            variant="body2"
                            component="h3"
                            noWrap
                            fontWeight="fontWeightBold"
                            color="text.secondary"
                          >
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
                          <Typography
                            variant="body2"
                            component="h3"
                            noWrap
                            fontWeight="fontWeightBold"
                            color="text.secondary"
                          >
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
                          {task?.isWatched ? 'Watching' : 'Watch'}
                        </WatchButton>
                      </Grid>
                    </Container>
                    {/* --- DESCRIPTION --- */}
                    <Container
                      item
                      container
                      wrap="nowrap"
                      gap="10px"
                      iconStart
                    >
                      <Grid item>
                        <Icon>
                          <FormatAlignLeftOutlinedIcon />
                        </Icon>
                      </Grid>
                      <Grid item container>
                        <Grid
                          item
                          container
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Grid item>
                            <Typography
                              variant="subtitle1"
                              fontWeight={(theme) =>
                                theme.typography.fontWeightBold
                              }
                            >
                              Description
                            </Typography>
                          </Grid>
                          {task?.description?.length &&
                            isReadOnlyDescription && (
                              <Grid item>
                                <Button
                                  onClick={() =>
                                    setIsReadOnlyDescription(false)
                                  }
                                >
                                  Edit
                                </Button>
                              </Grid>
                            )}
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
                          ) : task?.description ? (
                            <StyledDescriptionPlaceholder
                              variant="body1"
                              onClick={() => setIsReadOnlyDescription(false)}
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(task.description),
                              }}
                            />
                          ) : (
                            <StyledEmptyDescriptionBlock
                              component="a"
                              onClick={() => setIsReadOnlyDescription(false)}
                            >
                              Add a more detailed description...
                            </StyledEmptyDescriptionBlock>
                          )}
                        </Grid>
                      </Grid>
                    </Container>
                    {/* --- END DESCRIPTION --- */}
                    {/* --- ATTACHMENTS --- */}
                    {!!task?.attachments?.length && (
                      <Container
                        item
                        container
                        wrap="nowrap"
                        gap="10px"
                        iconStart
                      >
                        <Grid item>
                          <Icon>
                            <AttachmentOutlinedIcon
                              sx={{ transform: 'rotate(-45deg)' }}
                            />
                          </Icon>
                        </Grid>
                        <Grid item container>
                          <StyledTaskBlockTitle
                            item
                            container
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Grid item>
                              <Typography
                                variant="subtitle1"
                                fontWeight={(theme) =>
                                  theme.typography.fontWeightBold
                                }
                              >
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
                        </Grid>
                      </Container>
                    )}
                    {/* --- END ATTACHMENTS --- */}
                    <Container
                      item
                      container
                      wrap="nowrap"
                      gap="10px"
                      iconStart
                    >
                      <Grid item container direction="column">
                        {task?.checklists?.map((checkList) => (
                          <CheckList
                            key={checkList.id}
                            checkList={checkList}
                            taskId={taskId}
                          />
                        ))}
                      </Grid>
                    </Container>
                    <Container item container direction="column" iconStart>
                      <Grid
                        item
                        container
                        justifyContent="space-between"
                        gap="10px"
                      >
                        <Grid item>
                          <Icon>
                            <FormatAlignCenterOutlinedIcon />
                          </Icon>
                        </Grid>
                        <Grid item flex={1}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={(theme) =>
                              theme.typography.fontWeightBold
                            }
                          >
                            Activity
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Button>Show details</Button>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        container
                        wrap="nowrap"
                        gap="10px"
                        sx={{
                          // margin: '0 0 8px 40px',
                          margin: '0 0 8px 0px',
                        }}
                      >
                        <Avatar
                          alt={profile?.firstName + ' ' + profile?.lastName}
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: 16,
                          }}
                          src={profile?.photo?.path}
                        >
                          {profile?.firstName?.[0] ??
                            '' + profile?.lastName?.[0] ??
                            ''}
                        </Avatar>
                        {isReadOnlyCommentInput ? (
                          <StyledCommentInput
                            placeholder="Write a comment..."
                            sx={{ width: '100%' }}
                            onClick={() => setIsReadOnlyCommentInput(false)}
                          />
                        ) : (
                          <Grid container>
                            <TextEditor
                              placeholder="Write a comment..."
                              isReadOnly={
                                isReadOnlyCommentInput || isPendingCreateComment
                              }
                              onChange={(data) => setCommentString(data)}
                            />
                            <ButtonBase
                              onClick={handleSaveComment}
                              disabled={
                                isPendingCreateComment || !commentString.length
                              }
                            >
                              Save
                            </ButtonBase>
                          </Grid>
                        )}
                      </Grid>
                      {task?.comments?.map((comment) => (
                        <TaskComment
                          key={comment.id}
                          comment={comment}
                          isHighlighted={highlightedCommentId === comment.id}
                        />
                      ))}
                    </Container>
                  </Grid>
                  {task && <RightSideButtons task={task} />}
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
