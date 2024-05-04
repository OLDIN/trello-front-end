import React, { MouseEvent as ReactMouseEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authApi, commentsApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';
import { ITask } from 'types/Task';
import { trimParagraphContainer } from 'utils/helpers';

import { useAddReaction } from '../../hooks/useAddReaction';
import { useRemoveReaction } from '../../hooks/useRemoveReaction';
import { formatDate } from '../../../../../../utils/formatDate';
import type { TaskComment } from '../../../../../../types/TaskComment';
import {
  AddReactionButton,
  CommentActionButton,
  CommentAvatar,
  CommentBody,
  CommentDateTypography,
  CommentWrapper,
} from './styles';

import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import { CircularProgress, Grid, Popover, Typography } from '@mui/material';
import DOMPurify from 'dompurify';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

import { CommentReaction } from '../CommentReaction/CommentReaction';

interface TaskCommentProps {
  comment: TaskComment;
  isHighlighted?: boolean;
}

export function TaskComment({
  comment,
  isHighlighted = false,
}: TaskCommentProps) {
  const [isEmojiPickerSettings, setIsEmojiPickerSettings] = useState<{
    open: boolean;
    anchorEl: HTMLElement | null;
  }>({
    open: false,
    anchorEl: null,
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { hash, pathname } = useLocation();

  const { data: profile } = useQuery({
    queryKey: [QueryKey.ME],
    queryFn: authApi.getProfile,
  });

  const { mutate: deleteComment, isPending: isPendingDelete } = useMutation({
    mutationFn: () => commentsApi.deleteById(comment.taskId, comment.id),
    onSuccess: () => {
      if (hash === `#comment-${comment.id}`) {
        navigate(pathname);
      }

      queryClient.setQueryData<ITask>(
        [QueryKey.GET_TASK_BY_ID, comment.taskId],
        (oldTask) => {
          if (!oldTask) return oldTask;

          return {
            ...oldTask,
            comments: oldTask.comments?.filter((c) => c.id !== comment.id),
          };
        },
      );
    },
  });

  const { mutate: AddReaction } = useAddReaction({
    taskId: comment.taskId,
    commentId: comment.id,
    profile,
    onSuccess: () => {
      setIsEmojiPickerSettings({
        open: false,
        anchorEl: null,
      });
    },
  });
  const { mutate: deleteReaction } = useRemoveReaction({
    userId: profile?.id ?? 0,
    taskId: comment.taskId,
    commentId: comment.id,
    onSuccess: () => {
      setIsEmojiPickerSettings({
        open: false,
        anchorEl: null,
      });
    },
  });

  const handleOnClickDate = () => {
    const commentId = parseInt(hash.replace('#comment-', ''));

    if (commentId === comment.id) {
      navigate(pathname);
      return;
    }

    navigate(`#comment-${comment.id}`);
  };

  const handleDeleteComment = () => {
    deleteComment();
  };

  const handleToggleEmojiPicker = (e: ReactMouseEvent<HTMLButtonElement>) => {
    setIsEmojiPickerSettings((prev) => {
      return {
        ...prev,
        open: !prev.open,
        anchorEl: !prev.open === true ? e.currentTarget : null,
      };
    });
  };

  const handleOnEmojiClick = (emojiData: EmojiClickData) => {
    const reaction = comment.reactions?.find(
      (reaction) =>
        (reaction.reaction === emojiData.unified &&
          reaction.users?.some((user) => user.id === profile?.id)) ??
        false,
    );

    if (reaction) {
      deleteReaction(reaction.id);
    } else {
      AddReaction({ reaction: emojiData.unified });
    }
  };

  return (
    <>
      <CommentWrapper
        container
        wrap="nowrap"
        className={isHighlighted ? 'highlighted' : ''}
        gap={'10px'}
      >
        <Grid item>
          <CommentAvatar src={comment.author.photo?.path}>
            {comment.author.firstName[0] + comment.author.lastName[0]}
          </CommentAvatar>
        </Grid>
        <Grid item container direction="column">
          <Grid item>
            <Typography
              variant="subtitle2"
              component="span"
              fontWeight={(theme) => theme.typography.fontWeightBold}
            >
              {comment.author.firstName + ' ' + comment.author.lastName}
            </Typography>
            <CommentDateTypography
              variant="body2"
              component="span"
              sx={{ marginLeft: '4px' }}
              onClick={handleOnClickDate}
            >
              {formatDate(new Date(comment.createdAt), 'StandardWithHours')}
            </CommentDateTypography>
          </Grid>
          <CommentBody item>
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  trimParagraphContainer(comment.message),
                ),
              }}
            />
          </CommentBody>
          <Grid item container gap={1} alignItems="center">
            {comment.reactions?.map(
              (reaction) =>
                !!profile && (
                  <CommentReaction
                    key={reaction.id}
                    reaction={reaction}
                    userId={profile.id}
                    taskId={comment.taskId}
                    commentId={comment.id}
                    user={profile}
                  />
                ),
            )}
            <AddReactionButton onClick={handleToggleEmojiPicker}>
              <AddReactionOutlinedIcon
                fontSize="small"
                sx={{
                  marginBottom: 0,
                  fontSize: '16px',
                }}
              />
            </AddReactionButton>

            {profile?.id === comment.authorId && (
              <>
                <CommentActionButton
                  size="small"
                  variant="text"
                  color="secondary"
                  disabled={isPendingDelete}
                >
                  Edit
                </CommentActionButton>
                <CommentActionButton
                  size="small"
                  variant="text"
                  color="secondary"
                  onClick={handleDeleteComment}
                  disabled={isPendingDelete}
                  startIcon={isPendingDelete && <CircularProgress size={8} />}
                >
                  Delete
                </CommentActionButton>
              </>
            )}
          </Grid>
        </Grid>
      </CommentWrapper>
      <Popover
        open={isEmojiPickerSettings.open}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={() =>
          setIsEmojiPickerSettings({ open: false, anchorEl: null })
        }
      >
        <EmojiPicker open={true} onEmojiClick={handleOnEmojiClick} />
      </Popover>
    </>
  );
}
