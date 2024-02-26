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

function HomeJoinPage() {
  const navigate = useNavigate();
  const userId = '507f1f77bcf86cd799439011';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const homeId = data.get('homeId');

    if (!homeId) return;

    // TODO: get current userId
    APIHome.joinHome(homeId.toString(), userId);

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
