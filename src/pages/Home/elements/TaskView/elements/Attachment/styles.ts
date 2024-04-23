import { Grid, styled } from '@mui/material';

export const AttachmentPreview = styled('a', {
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

export const AttachmentDescription = styled(Grid)`
  box-sizing: border-box;
  cursor: pointer;
  margin: 0;
  min-height: 80px;
  padding: 8px 8px 8px 18px;
`;
