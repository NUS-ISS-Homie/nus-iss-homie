import { AddHome } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import APIHome from '../utils/api-home';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../context/SnackbarContext';
import { useSockets } from '../context/SocketContext';
import { useUser } from '../context/UserContext';
import { NOTIFICATION_JOIN_REQ, STATUS_CREATED, STATUS_OK } from '../constants';
import APINotification from '../utils/api-notification';
import { homeSocketEvents as events } from '../constants';

function HomeJoinPage() {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { user_id, username } = useUser();
  const { homeSocket } = useSockets();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const homeId = data.get('homeId');

    if (!homeId) return;

    if (!user_id) {
      navigate('/');
      return;
    }

    // TODO: send request to join
    APIHome.getHome(homeId.toString())
      .then(({ data: { home, message }, status }) => {
        if (status !== STATUS_OK) {
          throw new Error(message);
        }

        const joinReq = {
          sender: user_id,
          recipients: [home.adminUser._id],
          message: {
            title: NOTIFICATION_JOIN_REQ,
            content: `${username} wants to join your home.`,
          },
        };

        APINotification.createNotification(joinReq).then(
          ({ data: { notification, message }, status }) => {
            if (status !== STATUS_CREATED) throw Error(message);
            homeSocket.emit(events.SEND_NOTIFICATION, home.adminUser._id);
            snackbar.setSuccess('Join request sent!');
            navigate('/');
          }
        );
      })
      .catch((err: Error) => snackbar.setError(err.message));

    navigate('/');
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
        <Typography component='h1' variant='h5'>
          Join Home
        </Typography>
        <Box
          sx={{ mt: 3 }}
          component='form'
          autoComplete={'off'}
          onSubmit={handleSubmit}
        >
          <Grid item xs={12}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AddHome />
                  </InputAdornment>
                ),
              }}
              placeholder={`Home ID`}
              required
              fullWidth
              id='homeId'
              label='Home ID'
              name='homeId'
            />
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Join Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default HomeJoinPage;
