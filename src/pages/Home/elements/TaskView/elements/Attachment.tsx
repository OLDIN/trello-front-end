import React from 'react';

import { formatDate } from '../../../../../utils/formatDate';
import { IFile } from '../../../../../types/File';

import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Button, Grid, styled, Typography } from '@mui/material';

import { AttachmentBtn } from './AttachmentBtn';

interface AttachmentProps {
  attachment: IFile;
}

const AttachmentPreview = styled('a', {
  shouldForwardProp: (prop) => prop !== 'backgroundImagePath',
})<{ backgroundImagePath: string }>`
  background-image: url(${({ backgroundImagePath }) => backgroundImagePath});
  background-color: #f5f5f4;
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 3px;
  height: 80px;
  left: 0;
  margin-top: -40px;
  position: relative;
  text-align: center;
  text-decoration: none;
  top: 50%;
  width: 112px;
  display: block;
`;

const AttachmentDescription = styled(Grid)`
  box-sizing: border-box;
  cursor: pointer;
  margin: 0;
  min-height: 80px;
  padding: 8px 8px 8px 18px;
`;

export function Attachment({ attachment }: AttachmentProps) {
  return (
    <Grid
      item
      container
      wrap="nowrap"
      sx={{
        '&:hover': {
          backgroundColor: '#091e420f',
        },
      }}
    >
      <Grid item>
        <AttachmentPreview backgroundImagePath={attachment.path} />
      </Grid>
      <AttachmentDescription item container direction="column">
        <Grid item>
          <Typography variant="body2">{attachment.name}</Typography>
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
          <Button size="small" startIcon={<CreditCardIcon />}>
            Make cover
          </Button>
        </Grid>
      </AttachmentDescription>
    </Grid>
  );
}
