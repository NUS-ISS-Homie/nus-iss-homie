import React from 'react';
import { Notification } from '../../../@types/Notification';
import { Box, Button, DialogActions, Divider, Typography } from '@mui/material';
import {
  NOTIFICATION_INVITE,
  NOTIFICATION_JOIN_REQ,
  NOTIFICATION_CHORE_REMINDER,
  NOTIFICATION_NEW_CHORE,
} from '../../../constants';
import { useAuth } from '../../../context/HomeContext';

function NotificationDetails(props: {
  notification: Notification;
  deleteNotification: VoidFunction;
}) {
  const {
    notification: { message, sender },
    deleteNotification,
  } = props;

  const homeClient = useAuth();

  return (
    <Box padding='1rem' width='600px'>
      <Typography variant='h6'>{message.title}</Typography>
      <Divider />
      {message.content}
      {(message.title === NOTIFICATION_JOIN_REQ ||
        message.title === NOTIFICATION_INVITE) && (
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
                switch (message.title) {
                  case NOTIFICATION_JOIN_REQ:
                    homeClient.acceptJoinRequest(
                      sender._id,
                      deleteNotification
                    );
                    break;
                  case NOTIFICATION_INVITE:
                    homeClient.acceptInvite(sender._id, deleteNotification);
                    break;
                }
              }}
            >
              Accept
            </Button>
          </DialogActions>
        </>
      )}
      {message.title === NOTIFICATION_CHORE_REMINDER ||
        (message.title === NOTIFICATION_NEW_CHORE && (
          <>
            <Divider />
            <DialogActions>
              <Button
                color='primary'
                variant='outlined'
                onClick={deleteNotification}
              >
                Close
              </Button>
            </DialogActions>
          </>
        ))}
    </Box>
  );
}

export default NotificationDetails;
