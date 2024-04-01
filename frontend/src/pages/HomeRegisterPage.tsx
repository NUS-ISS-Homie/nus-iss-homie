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
import React, { useEffect, useState } from 'react';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import APIHome from '../utils/api-home';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../context/SnackbarContext';
import { useAuth } from '../context/HomeContext';
import { useUser } from '../context/UserContext';
import { NOTIFICATION_INVITE, STATUS_CREATED, STATUS_OK } from '../constants';
import { AuthClient } from '../utils/auth-client';
import APINotification from '../utils/api-notification';
import { useSockets } from '../context/SocketContext';
import { homeSocketEvents as events } from '../constants';

export enum HomeFormType {
  Register = 'Register',
  Invite = 'Invite',
}

function TenantsField(props: {
  t: number;
  username: string;
  setTenant: (i: number, tenant: { username: string; error: boolean }) => void;
  addTenant: VoidFunction;
  deleteTenant: (i: number) => void;
  canDelete: boolean;
}) {
  const { t, username, setTenant, addTenant, deleteTenant, canDelete } = props;

  const user = useUser();

  const [tenantField, setTenantField] = useState(username);
  const [hasUser, setHasUser] = useState(false);

  const [errMessage, setErrMessage] = useState<string>('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (tenantField.length === 0) {
        setHasUser(false);
        setErrMessage('');
        setTenant(t - 1, { username: tenantField, error: false });
        return;
      }

      if (tenantField === user.username) {
        return setErrMessage('Cannot add yourself as tenant');
      }

      AuthClient.getUserId(tenantField).then(({ data, status }) => {
        setHasUser(status === STATUS_OK);
        setTenant(t - 1, {
          username: tenantField,
          error: status !== STATUS_OK,
        });
        setErrMessage(status === STATUS_OK ? '' : 'User does not exist');
      });
    }, 200);
    return () => clearTimeout(timeout);
  }, [tenantField, setTenant, t, user.username]);

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
          id={`tenant${t}`}
          label={`Tenant ${t} Username`}
          name={`tenant${t}`}
          value={tenantField}
          onChange={(e) => setTenantField(e.target.value)}
          error={errMessage.length > 0}
          helperText={errMessage}
        />
      </Grid>
      {hasUser && (
        <IconButton aria-label='add' onClick={addTenant}>
          <AddCircle />
        </IconButton>
      )}
      {canDelete && (
        <IconButton aria-label='delete' onClick={() => deleteTenant(t - 1)}>
          <RemoveCircle />
        </IconButton>
      )}
    </Grid>
  );
}

function HomeRegisterPage(props: { type: HomeFormType }) {
  const [tenants, setTenants] = useState([{ username: '', error: false }]);
  const [hasErrors, setHasErrors] = useState(false);
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { user_id, username } = useUser();
  const { joinHome, homeSocket } = useSockets();
  const homeClient = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

    // TODO: send invites to invitees
    const recipients = await Promise.all(
      tenants.map(
        async ({ username }) =>
          (await AuthClient.getUserId(username)).data.user_id
      )
    );

    const invites = {
      sender: user_id,
      recipients,
      message: {
        title: NOTIFICATION_INVITE,
        content: `${username} invites you to join their home.`,
      },
    };

    APINotification.createNotification(invites)
      .then(({ data, status }) => {
        if (status !== STATUS_CREATED)
          throw new Error('Failed to send invites');
        invites.recipients.forEach((r) =>
          homeSocket.emit(events.SEND_NOTIFICATION, r)
        );
        snackbar.setSuccess('Invitations sent');
      })
      .catch((err) => snackbar.setError(err.message));

    if (props.type === HomeFormType.Invite) {
      return navigate('/');
    }

    APIHome.createHome(user_id)
      .then(({ data: { home, message }, status }) => {
        if (status !== STATUS_CREATED) throw new Error(message);
        homeClient.setHome(home);
        joinHome(home._id);
        snackbar.setSuccess(message);
        navigate('/');
      })
      .catch((err) => snackbar.setError(err));
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
          {props.type === HomeFormType.Register
            ? 'Register Home'
            : 'Invite Tenants'}
        </Typography>
        <Box
          width='360px'
          sx={{ mt: 3 }}
          component='form'
          autoComplete={'off'}
          onSubmit={handleSubmit}
        >
          <Grid container rowGap={2}>
            {tenants.map(({ username }, t) => {
              t = t + 1;
              return (
                <TenantsField
                  t={t}
                  username={username}
                  key={t}
                  setTenant={(id, tenant) => {
                    const updated = tenants;
                    updated[id] = tenant;
                    setTenants(updated);
                    setHasErrors(
                      updated.findIndex(({ error }) => error) !== -1
                    );
                  }}
                  addTenant={() =>
                    setTenants([...tenants, { username: '', error: false }])
                  }
                  deleteTenant={(i) => {
                    tenants.splice(i, 1);
                    setTenants([...tenants]);
                  }}
                  canDelete={t > 1 && t === tenants.length}
                />
              );
            })}
          </Grid>

          <Button
            type='submit'
            fullWidth
            variant='contained'
            disabled={hasErrors}
            sx={{ mt: 3, mb: 2 }}
          >
            {props.type}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default HomeRegisterPage;
