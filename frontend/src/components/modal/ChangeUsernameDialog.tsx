import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { AuthClient } from '../../utils/auth-client';
import { saveUsername, useAuth } from '../../context/UserContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { useUser } from '../../context/UserContext';

type ChangeUsernameDialogProps = {
  dialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
};

function ChangeUsernameDialog(props: ChangeUsernameDialogProps) {
  const { dialogOpen, setDialogOpen } = props;
  const [loading, setLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);

  const authClient = useAuth();
  const snackBar = useSnackbar();
  const user = useUser();

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = user.username;
    const password = data.get('password');
    const newUsername = data.get('newUsername');

    if (!username || !password || !newUsername) {
      return;
    }

    const body = {
      username: username.toString(),
      password: password.toString(),
      newUsername: newUsername.toString(),
    };

    setLoading(true);
    AuthClient.changeUsername(body)
      .then((resp) => {
        if (resp.status !== 200) throw new Error(resp.data.message);

        // success
        saveUsername(newUsername.toString());
        authClient.setUser({
          username: newUsername.toString(),
          user_id: user.user_id,
        }); // save in context

        setDialogOpen(false);
        snackBar.setSuccess('Change username success', 2000);
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
      <DialogTitle>Change username</DialogTitle>

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
              placeholder='New username'
              required
              fullWidth
              id='newUsername'
              label='New Username'
              name='newUsername'
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

export default ChangeUsernameDialog;