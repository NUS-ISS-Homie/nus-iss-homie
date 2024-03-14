import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import React, { useState } from 'react';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import APIHome from '../utils/api-home';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../context/SnackbarContext';
import { useAuth } from '../context/HomeContext';
import { useUser } from '../context/UserContext';
import { STATUS_CREATED } from '../constants';
import { useSockets } from '../context/SocketContext';

function HomeRegisterPage() {
  const [tenants, setTenants] = useState(['']);
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { user_id } = useUser();
  const homeClient = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const invitees = [];
    for (let i = 0; i < tenants.length; i++) {
      invitees.push(data.get(`tenant${i + 1}`));
    }

    if (!user_id) {
      navigate('/');
      return;
    }

    APIHome.createHome(user_id)
      .then(({ data: { home, message }, status }) => {
        if (status !== STATUS_CREATED) throw new Error(message);
        homeClient.setHome(home);
        // TODO: send invites to invitees
        snackbar.setSuccess(message);
        navigate('/');
      })
      .catch((err) => snackbar.setError(err));
  };

  const TenantsField = (props: { t: number; username: string | null }) => {
    const { t, username } = props;
    return (
      <Grid display='flex'>
        <Grid item xs={12}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AccountCircleOutlinedIcon />
                </InputAdornment>
              ),
            }}
            placeholder={`Tenant ${t}`}
            fullWidth
            defaultValue={username ? username : null}
            id={`tenant${t}`}
            label={`Tenant ${t} Username`}
            name={`tenant${t}`}
            onBlur={(e) => {
              tenants[t - 1] = e.target.value;
              setTenants([...tenants]);
            }}
          />
        </Grid>
        {username && (
          <IconButton
            aria-label='add'
            onClick={() => setTenants([...tenants, ''])}
          >
            <AddCircle />
          </IconButton>
        )}
        {t > 1 && (
          <IconButton
            aria-label='delete'
            onClick={() => {
              tenants.splice(t - 1, 1);
              console.log(tenants);
              setTenants([...tenants]);
            }}
          >
            <RemoveCircle />
          </IconButton>
        )}
      </Grid>
    );
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
          Register Home
        </Typography>
        <Box
          sx={{ mt: 3 }}
          component='form'
          autoComplete={'off'}
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2}>
            {tenants.map((username, t) => {
              t = t + 1;
              return <TenantsField t={t} username={username} key={t} />;
            })}
          </Grid>

          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Register Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default HomeRegisterPage;
