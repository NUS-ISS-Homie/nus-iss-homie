import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { SchoolSharp, SettingsSharp } from '@mui/icons-material';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const user = useUser();
  const navigate = useNavigate();
  const theme = useTheme();

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
          onClick={() => navigate('/home')}
        >
          <SchoolSharp />
        </IconButton>

        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          Homie
        </Typography>

        <Stack direction='row' spacing={2}>
          <Typography variant='h6'>{user.username}</Typography>
          {/* <IconButton onClick={handleOpenSettingsMenu} color='inherit'>
            <SettingsSharp />
          </IconButton> */}
        </Stack>

        {/* <Menu
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
        </Menu> */}
      </Toolbar>

      {/* <ConfirmationDialog
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
      /> */}
    </AppBar>
  );
}

export default Navbar;
