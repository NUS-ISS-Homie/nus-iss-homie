import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useUser } from '../../context/UserContext';
import TenantDetails from './TenantDetails';
import { useHome } from '../../context/HomeContext';

function DashboardPage() {
  const navigate = useNavigate();
  const { username } = useUser();
  const { _id } = useHome();

  const guestDashboard = (
    <>
      <Button onClick={() => navigate('/registerHome')}>Register Home</Button>
      <Button onClick={() => navigate('/join')}>Join Home</Button>
    </>
  );

  const dashboard = (
    <>
      <TenantDetails />
      <Button onClick={() => navigate('/expense')}>Expenses</Button>
    </>
  );

  return <div>{_id ? dashboard : guestDashboard}</div>;
}

export default DashboardPage;
