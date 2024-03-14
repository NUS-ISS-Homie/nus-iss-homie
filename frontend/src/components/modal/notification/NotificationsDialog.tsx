import { Close } from '@mui/icons-material';
import {
  Box,
  ButtonBase,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Typography,
  snackbarClasses,
} from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Notification } from '../../../@types/Notification';
import { useUser } from '../../../context/UserContext';
import APINotification from '../../../utils/api-notification';
import NotificationView from './NotificationView';
import NotificationDetails from './NotificationDetails';
import { STATUS_OK } from '../../../constants';
import { useSnackbar } from '../../../context/SnackbarContext';

type NotificationsDialogProps = {
  dialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
  onConfirmAction: () => void;
};

function NotificationsDialog(props: NotificationsDialogProps) {
  const { dialogOpen, setDialogOpen, onConfirmAction } = props;

  const { user_id } = useUser();
  const snackbar = useSnackbar();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const deleteNotification = (idx: number) => {
    if (!user_id) return;
    APINotification.deleteNotification(notifications[idx]._id, user_id)
      .then(({ data: { notification, message }, status }) => {
        if (status != STATUS_OK) throw new Error(message);
        notifications.splice(idx, 1);
        setNotifications(notifications);
        snackbar.setSuccess(message);
      })
      .catch((err: Error) => snackbar.setError(err.message));
  };

  useEffect(() => {
    if (!user_id) return;
    APINotification.getNotificationByUserId(user_id).then(
      ({ data: { notification, message }, status }) => {
        console.log(notification);
        setNotifications(notification);
      }
    );
  }, []);

  return (
    <Dialog open={dialogOpen}>
      <DialogTitle>Notifications</DialogTitle>

      <Divider />

      <Box position='absolute' top={0} right={0}>
        <IconButton onClick={() => setDialogOpen(false)}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent>
        {notifications.length === 0 ? (
          <Typography>You have no messages!</Typography>
        ) : (
          <NotificationsScroll
            notifications={notifications}
            deleteNotification={deleteNotification}
          />
        )}
      </DialogContent>

      {/* <DialogActions>
        <Button
          color='primary'
          variant='outlined'
          onClick={() => setDialogOpen(false)}
        >
          Cancel
        </Button>

        <Button variant='contained' onClick={onConfirmAction}>
          Confirm
        </Button>
      </DialogActions> */}
    </Dialog>
  );
}

function NotificationsScroll(props: {
  notifications: Notification[];
  deleteNotification: (idx: number) => void;
}) {
  const [selected, setSelected] = useState(0);
  const { notifications, deleteNotification } = props;

  return (
    <Box display='flex'>
      <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
        {notifications.length > 0 &&
          notifications.map((n, i) => (
            <ButtonBase key={i} onClick={() => setSelected(i)}>
              <NotificationView notification={n} />
            </ButtonBase>
          ))}
      </Paper>
      <NotificationDetails
        notification={notifications[selected]}
        deleteNotification={() => deleteNotification(selected)}
      />
    </Box>
  );
}

export default NotificationsDialog;
