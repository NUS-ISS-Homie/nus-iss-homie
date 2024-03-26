import React from 'react';
import { Notification } from '../../../@types/Notification';
import { Avatar, Box, Typography } from '@mui/material';

function NotificationView(props: { notification: Notification }) {
  const { notification } = props;
  return (
    <Box
      padding='1rem'
      border='none'
      display='flex'
      justifyContent='center'
      textAlign='left'
    >
      <Avatar>{notification.sender.username[0]}</Avatar>
      <Box marginLeft='1rem'>
        <Typography variant='h6'>{notification.message.title}</Typography>
        <Typography variant='subtitle1'>
          {notification.sender.username}
        </Typography>
      </Box>
    </Box>
  );
}

export default NotificationView;
