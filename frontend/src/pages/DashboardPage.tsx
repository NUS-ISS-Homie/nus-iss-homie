import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { useUser } from '../context/UserContext';

function DashboardPage() {
  const navigate = useNavigate();
  const user = useUser();
  return (
    <div>
      Homie Dashboard
      <Button onClick={() => navigate('/registerHome')}>Register Home</Button>
      <Button onClick={() => navigate('/join')}>Join Home</Button>
    </div>
  );
}

export default DashboardPage;
