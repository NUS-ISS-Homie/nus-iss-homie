import React from 'react';
import { Notification } from '../../../@types/Notification';
import { Box, Button, DialogActions, Divider, Typography } from '@mui/material';
import { NOTIFICATION_JOIN_REQ, STATUS_OK } from '../../../constants';
import APIHome from '../../../utils/api-home';
import { useAuth, useHome } from '../../../context/HomeContext';
import { useUser } from '../../../context/UserContext';
import { useSockets } from '../../../context/SocketContext';
import { useSnackbar } from '../../../context/SnackbarContext';

function NotificationDetails(props: {
  notification: Notification;
  deleteNotification: VoidFunction;
}) {
  const {
    notification: { message, sender, recipients },
    deleteNotification,
  } = props;

  const home = useHome();
  const homeClient = useAuth();
  const { user_id } = useUser();
  return (
    <Box padding='1rem' width='600px'>
      <Typography variant='h6'>{message.title}</Typography>
      <Divider />
      {message.title === NOTIFICATION_JOIN_REQ
        ? JSON.parse(message.content).message
        : message.content}
      {message.title === NOTIFICATION_JOIN_REQ && (
        <>
          <Divider />
          <DialogActions>
            <Button
              color='primary'
              variant='outlined'
              onClick={deleteNotification}
            >
              Decline
            </Button>

            <Button
              variant='contained'
              onClick={() => {
                if (!home || !user_id) return;
                homeClient.acceptJoinRequest(
                  sender._id,
                  JSON.parse(message.content).socketId,
                  deleteNotification
                );
              }}
            >
              Accept
            </Button>
          </DialogActions>
        </>
      )}
    </Box>
  );
}

export default NotificationDetails;
