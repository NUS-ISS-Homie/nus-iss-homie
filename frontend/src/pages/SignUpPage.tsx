import React, { useState } from 'react';
import {
  Alert,
  AlertTitle,
  Button,
  TextField,
  Container,
  Box,
  Avatar,
  Grid,
  Typography,
  Link,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { AuthClient } from '../utils/auth-client';

enum RegisterStatus {
  SUCCESS = 1,
  FAILED = 2,
  IN_PROGRESS = 3,
}

function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [signUpStatus, setSignUpStatus] = useState<RegisterStatus>(
    RegisterStatus.IN_PROGRESS
  );
  const [signUpFailMessage, setSignUpFailMessage] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [passwordShown, setPasswordShown] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
    AuthClient.signUp(body)
      .then((resp) => {
        if (resp.status !== 201) throw new Error(resp.data.message);

        setSignUpStatus(RegisterStatus.SUCCESS);
      })
      .catch((err) => {
        setSignUpStatus(RegisterStatus.FAILED);
        setSignUpFailMessage(err);
      })
      .finally(() => {
        setShowAlert(true);
        setLoading(false);
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
          Sign up!!
        </Typography>

        <Box
          sx={{
            mt: 3,
          }}
          component='form'
          autoComplete={'off'}
          onSubmit={handleSubmit}
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
                type='password'
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
            Sign Up
          </Button>

          {showAlert && (
            <Alert
              onClose={() => setShowAlert(false)}
              severity={
                signUpStatus === RegisterStatus.SUCCESS ? 'success' : 'error'
              }
              sx={{ mb: 1 }}
            >
              <AlertTitle>
                {signUpStatus === RegisterStatus.SUCCESS
                  ? 'Account created'
                  : signUpFailMessage.toString()}
              </AlertTitle>

              {signUpStatus === RegisterStatus.SUCCESS && (
                <Link href='/login' variant='body2'>
                  Click here to sign in
                </Link>
              )}
            </Alert>
          )}

          <Grid container>
            <Grid item>
              <Link href='/login' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignUpPage;
