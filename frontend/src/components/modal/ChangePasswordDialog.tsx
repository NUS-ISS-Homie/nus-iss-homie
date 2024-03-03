import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { AuthClient } from '../../utils/auth-client';
import { useSnackbar } from '../../context/SnackbarContext';
import { useUser } from '../../context/UserContext';

type ChangePasswordDialogProps = {
  dialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
};

function ChangePasswordDialog(props: ChangePasswordDialogProps) {
  const { dialogOpen, setDialogOpen } = props;
  const [loading, setLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [newPasswordShown, setNewPasswordShown] = useState(false);
  const [newPasswordConfShown, setNewPasswordConfShown] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const snackBar = useSnackbar();
  const user = useUser();

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const toggleNewPassword = () => {
    setNewPasswordShown(!newPasswordShown);
  };

  const togglePasswordConf = () => {
    setNewPasswordConfShown(!newPasswordConfShown);
  };

  const isMatchingNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (newPassword !== e.target.value) {
      setErrorText('Password does not match. Please check again.');
    } else {
      setErrorText('');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = user.username;
    const password = data.get('password');
    const newPassword = data.get('newPassword');

    if (!username || !password || !newPassword) {
      return;
    }

    const body = {
      username: username.toString(),
      oldPassword: password.toString(),
      newPassword: newPassword.toString(),
    };

    setLoading(true);
    AuthClient.changePassword(body)
      .then((resp) => {
        if (resp.status !== 200) throw new Error(resp.data.message);

        // success
        setDialogOpen(false);
        snackBar.setSuccess('Change password success', 2000);
      })
      .catch((err) => {
        snackBar.setError(err.toString());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={dialogOpen}>
      <DialogTitle>Change password</DialogTitle>

      <Box position='absolute' top={0} right={0}>
        <IconButton onClick={() => setDialogOpen(false)}>
          <Close />
        </IconButton>
      </Box>

      <Box
        sx={{
          paddingLeft: 5,
          paddingRight: 5,
          paddingBottom: 5,
        }}
        component='form'
        autoComplete='off'
        onSubmit={handleSubmit}
      >
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              placeholder='Password'
              required
              fullWidth
              id='password'
              label='Password'
              name='password'
              type={passwordShown ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {!passwordShown ? (
                      <VisibilityIcon onClick={togglePassword} />
                    ) : (
                      <VisibilityOffIcon onClick={togglePassword} />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              placeholder='New password'
              required
              fullWidth
              id='newPassword'
              label='New password'
              name='newPassword'
              type={newPasswordShown ? 'text' : 'password'}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {!newPasswordShown ? (
                      <VisibilityIcon onClick={toggleNewPassword} />
                    ) : (
                      <VisibilityOffIcon onClick={toggleNewPassword} />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              placeholder='New password confirmation'
              required
              fullWidth
              id='newPasswordConf'
              label='New password confirmation'
              name='newPasswordConf'
              type={newPasswordConfShown ? 'text' : 'password'}
              error={errorText ? true : false}
              helperText={errorText}
              onChange={isMatchingNewPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {!newPasswordConfShown ? (
                      <VisibilityIcon onClick={togglePasswordConf} />
                    ) : (
                      <VisibilityOffIcon onClick={togglePasswordConf} />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid
            item
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
            xs={12}
          >
            <Button variant='contained' type='submit' disabled={loading}>
              {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
              Confirm
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}

export default ChangePasswordDialog;