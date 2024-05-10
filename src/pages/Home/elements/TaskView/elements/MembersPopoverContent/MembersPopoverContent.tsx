import React, { useMemo } from 'react';

import { IUser } from 'types/User';

import { useUpdateTask } from 'pages/Home/hooks/useUpdateTask';
import { useUsers } from 'pages/Home/hooks/useUsers';
import { useTaskDetails } from 'pages/Home/elements/TaskView/hooks/useTaskDetails';
import { Item } from './styles';

import {
  Avatar,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

interface MembersPopoverContentProps {
  boardId: number;
  taskId: number;
}

export function MembersPopoverContent({
  boardId,
  taskId,
}: MembersPopoverContentProps) {
  const { data: users = [] } = useUsers({
    boardId,
  });
  const { taskMembersIds } = useTaskDetails({ taskId });

  const { mutate: updateTask, isPending } = useUpdateTask({ taskId });

  const handleAddMemberToTask = (memberId: number) => {
    updateTask({
      membersIds: [...taskMembersIds, memberId],
    });
  };

  const handleRemoveMemberFromTask = (memberId: number) => {
    updateTask({
      membersIds: taskMembersIds.filter((id) => id !== memberId),
    });
  };

  const members = useMemo(() => {
    return users.reduce<{
      taskMembers: IUser[];
      boardMembers: IUser[];
    }>(
      (acc, user) => {
        if (taskMembersIds.includes(user.id)) {
          acc.taskMembers.push(user);
        } else {
          acc.boardMembers.push(user);
        }

        return acc;
      },
      {
        taskMembers: [],
        boardMembers: [],
      },
    );
  }, [taskMembersIds, users]);

  return (
    <Grid container>
      <Grid item component="form" width="100%">
        <TextField
          placeholder="Search members"
          type="search"
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item width="100%" container sx={{ marginTop: '10px' }}>
        <Grid item width="100%">
          <Typography
            variant="subtitle2"
            sx={{
              marginTop: '16px',
            }}
          >
            Card members
          </Typography>
          <Stack direction="column" spacing={1}>
            {members.taskMembers.map((member) => (
              <Item key={member.id}>
                <Button
                  onClick={() => handleRemoveMemberFromTask(member.id)}
                  disabled={isPending}
                  startIcon={
                    <Avatar
                      src={member.photo?.path}
                      alt={`${member.firstName} ${member.lastName}`}
                      sx={{
                        width: 30,
                        height: 30,
                        marginRight: '8px',
                        '&:nth-of-type(1)': {
                          fontSize: '14px',
                        },
                      }}
                    >
                      {member.firstName[0]} {member.lastName[0]}
                    </Avatar>
                  }
                  sx={{
                    color: '#172B4D',
                  }}
                >
                  {member.firstName} {member.lastName}
                </Button>
              </Item>
            ))}
          </Stack>
        </Grid>
        <Grid item width="100%">
          <Typography
            variant="subtitle2"
            sx={{
              marginTop: '16px',
            }}
          >
            Board members
          </Typography>
          <Stack direction="column" spacing={1}>
            {members.boardMembers.map((member) => (
              <Item key={member.id}>
                <Button
                  onClick={() => handleAddMemberToTask(member.id)}
                  disabled={isPending}
                  startIcon={
                    <Avatar
                      src={member.photo?.path}
                      alt={`${member.firstName} ${member.lastName}`}
                      sx={{
                        width: 30,
                        height: 30,
                        marginRight: '8px',
                        '&:nth-of-type(1)': {
                          fontSize: '14px',
                        },
                      }}
                    >
                      {member.firstName[0]} {member.lastName[0]}
                    </Avatar>
                  }
                  sx={{
                    color: '#172B4D',
                  }}
                >
                  {member.firstName} {member.lastName}
                </Button>
              </Item>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}
