import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Stack,
  Typography,
  Menu,
  MenuItem,
  Button,
  Badge,
} from '@mui/material';
import { MailRounded, SettingsRounded as Settings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '../context/UserContext';
import { useAuth as useHomeAuth } from '../context/HomeContext';
import ConfirmationDialog from './modal/ConfirmationDialog';
import ChangeUsernameDialog from './modal/ChangeUsernameDialog';
import ChangePasswordDialog from './modal/ChangePasswordDialog';
import NotificationsDialog from './modal/notification/NotificationsDialog';
import { useSockets } from '../context/SocketContext';

function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [changeUnameDialogOpen, setChangeUnameDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);

  // Notification States
  const [badgeInvisible, setBadgeInvisible] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const user = useUser();
  const authClient = useAuth();
  const homeClient = useHomeAuth();
  const { homeSocket } = useSockets();
  const navigate = useNavigate();

  const handleOpenSettingsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChangeUsername = () => {
    setAnchorEl(null);
    setChangeUnameDialogOpen(true);
  };

  const handleChangePassword = () => {
    setAnchorEl(null);
    setChangePasswordDialogOpen(true);
  };

  const handleDeleteAccount = () => {
    setAnchorEl(null);
    setConfirmDialogOpen(true);
  };

  const handleDeleteUser = () => {
    authClient.deleteUser();
    homeClient.leaveHome();
    homeSocket.emit('delete-session', homeSocket.auth);
    homeSocket.disconnect();
    navigate('/');
  };

  const handleLogout = () => {
    authClient.logout();
    homeClient.setHome(null);
    homeSocket.emit('delete-session', homeSocket.auth);
    homeSocket.disconnect();
    navigate('/');
  };

  homeSocket.on('notify', () => {
    setBadgeInvisible(false);
  });

  return (
    <AppBar
      position='relative'
      sx={{
        boxShadow: '8px 8px 35px #d7dbe3',
        backgroundColor: '#f3f7fa',
        color: 'black',
        marginBottom: '30px',
      }}
    >
      <Toolbar>
        <IconButton
          size='large'
          edge='start'
          color='inherit'
          aria-label='menu'
          onClick={() => setNotificationsOpen(true)}
        >
          <Badge color='error' variant='dot' invisible={badgeInvisible}>
            <MailRounded />
          </Badge>
        </IconButton>

        <Button
          variant='text'
          sx={{ flexGrow: 1 }}
          onClick={() => navigate('/')}
        >
          Homie
        </Button>

        <Stack direction='row' spacing={2}>
          <Typography variant='h6'>{user.username}</Typography>
          <IconButton onClick={handleOpenSettingsMenu} color='inherit'>
            <Settings />
          </IconButton>
        </Stack>

        <Menu
          id='menu-appbar'
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={handleChangeUsername}>Change username</MenuItem>
          <MenuItem onClick={handleChangePassword}>Change password</MenuItem>
          <MenuItem onClick={handleDeleteAccount} sx={{ color: 'red' }}>
            Delete account
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>

      <ConfirmationDialog
        dialogOpen={confirmDialogOpen}
        setDialogOpen={setConfirmDialogOpen}
        message={'Confirm the deletion of your account?'}
        onConfirmAction={handleDeleteUser}
      />

      <ChangeUsernameDialog
        dialogOpen={changeUnameDialogOpen}
        setDialogOpen={setChangeUnameDialogOpen}
      />

      <ChangePasswordDialog
        dialogOpen={changePasswordDialogOpen}
        setDialogOpen={setChangePasswordDialogOpen}
      />

      <NotificationsDialog
        dialogOpen={notificationsOpen}
        setDialogOpen={setNotificationsOpen}
        markRead={() => setBadgeInvisible(true)}
      />
    </AppBar>
  );
}

export default Navbar;