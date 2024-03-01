import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

function DashboardPage() {
  const navigate = useNavigate();
  return (
    <div>
      Homie Dashboard
      <Button onClick={() => navigate('/registerHome')}>Register Home</Button>
      <Button onClick={() => navigate('/join')}>Join Home</Button>
      <Button onClick={() => navigate('/expense')}>Expenses</Button>
    </div>
  );
}

export default DashboardPage;
