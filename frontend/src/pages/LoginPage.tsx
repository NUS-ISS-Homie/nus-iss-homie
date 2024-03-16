import React, { useState } from 'react';
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { AuthClient } from '../utils/auth-client';
import { useNavigate } from 'react-router-dom';
import { STATUS_NOT_FOUND, STATUS_OK } from '../constants';
import { saveUserToLocalStorage, useAuth } from '../context/UserContext';
<<<<<<< HEAD
import {
  defaultHome,
  saveHomeInStorage,
  useAuth as useHomeAuth,
} from '../context/HomeContext';
=======
import { useAuth as useHomeAuth } from '../context/HomeContext';
>>>>>>> main
import APIHome from '../utils/api-home';
import { useSnackbar } from '../context/SnackbarContext';
import { useSockets } from '../context/SocketContext';

enum LoginStatus {
  SUCCESS = 1,
  FAILED = 2,
  IN_PROGRESS = 3,
}

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(
    LoginStatus.IN_PROGRESS
  );
  const [loginFailMessage, setLoginFailMessage] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();
  const authClient = useAuth();
  const homeClient = useHomeAuth();
  const snackbar = useSnackbar();
  const { homeSocket } = useSockets();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');

    if (!username || !password) {
      return;
    }

    const body = {
      username: username.toString(),
      password: password.toString(),
    };

    setLoading(true);
    console.log(body);
    AuthClient.login(body)
      .then(({ data: { username, user_id, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        authClient.setUser({ username, user_id });
        saveUserToLocalStorage({ username, user_id });

<<<<<<< HEAD
=======
        // Setup socket
        homeSocket.auth = { userId: user_id };
        homeSocket.connect();

        // Setup home
>>>>>>> main
        APIHome.getHomeByUserId(user_id).then(
          ({ data: { home, message }, status }) => {
            switch (status) {
              case STATUS_OK:
                homeClient.setHome(home);
                break;
              case STATUS_NOT_FOUND:
                homeClient.setHome(null);
                break;
              default:
                throw new Error(message);
            }
          }
        );

        setLoginStatus(LoginStatus.SUCCESS);
        navigate('/home');
      })
      .catch((err) => {
        snackbar.setError(err.message);
        setLoginStatus(LoginStatus.FAILED);
        setLoginFailMessage(err);
      })
      .finally(() => {
        setLoading(false);
        setShowAlert(true);
      });
  };

  return (
    <Container
      maxWidth='xs'
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 20,
        }}
      >
        <Avatar />

        <Typography component='h1' variant='h5'>
          Log in
        </Typography>

        <Box
          sx={{
            mt: 3,
          }}
          component='form'
          autoComplete={'off'}
          onSubmit={handleLogin}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountCircleOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
                placeholder={'Username'}
                required
                fullWidth
                id='username'
                label='Username'
                name='username'
              />
            </Grid>

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
                  startAdornment: (
                    <InputAdornment position='start'>
                      <ShieldOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Button
            type='submit'
            fullWidth
            variant='contained'
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
            Log in
          </Button>

          {showAlert && (
            <Alert
              onClose={() => setShowAlert(false)}
              severity={
                loginStatus === LoginStatus.SUCCESS ? 'success' : 'error'
              }
              sx={{ mb: 1 }}
            >
              <AlertTitle>
                {loginStatus === LoginStatus.SUCCESS
                  ? 'Sign in successful'
                  : loginFailMessage.toString()}
              </AlertTitle>
            </Alert>
          )}

          <Grid container>
            <Grid item>
              <Link href='/signup' variant='body2'>
                Don't have an account? Sign up here
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
