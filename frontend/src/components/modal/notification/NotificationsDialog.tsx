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
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Notification } from '../../../@types/Notification';
import { useUser } from '../../../context/UserContext';
import APINotification from '../../../utils/api-notification';
import NotificationView from './NotificationView';
import NotificationDetails from './NotificationDetails';

type NotificationsDialogProps = {
  dialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
  onConfirmAction: () => void;
};

function NotificationsDialog(props: NotificationsDialogProps) {
  const { dialogOpen, setDialogOpen, onConfirmAction } = props;

  const { user_id } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
          <NotificationsScroll notifications={notifications} />
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

function NotificationsScroll(props: { notifications: Notification[] }) {
  const [selected, setSelected] = useState(0);
  const { notifications } = props;

  return (
    <Box display='flex'>
      <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
        {notifications.length > 0 &&
          notifications.map((n, i) => (
            <ButtonBase onClick={() => setSelected(i)}>
              <NotificationView notification={n} key={i} />
            </ButtonBase>
          ))}
      </Paper>
      <NotificationDetails notification={notifications[selected]} />
    </Box>
  );
}

export default NotificationsDialog;
