import React from 'react';
import { Notification } from '../../../@types/Notification';
import { Box, Divider, Typography } from '@mui/material';

function NotificationDetails(props: { notification: Notification }) {
  const {
    notification: { message, sender },
  } = props;

  return (
    <Box padding='1rem' width='600px'>
      <Typography variant='h6'>{message.title}</Typography>
      <Divider />
      {message.content}
    </Box>
  );
}

export default NotificationDetails;
