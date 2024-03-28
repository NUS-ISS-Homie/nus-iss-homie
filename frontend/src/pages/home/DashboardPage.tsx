import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useUser } from '../../context/UserContext';
import TenantDetails from './TenantDetails';
import { useHome } from '../../context/HomeContext';

function DashboardPage() {
  const navigate = useNavigate();
  const { user_id } = useUser();
  const home = useHome();

  const guestDashboard = (
    <>
      <Button onClick={() => navigate('/registerHome')}>Register Home</Button>
      <Button onClick={() => navigate('/join')}>Join Home</Button>
    </>
  );

  const dashboard = (
    <>
      <TenantDetails />
      {home?.adminUser._id === user_id && (
        <Button onClick={() => navigate('/invite')}>Invite Tenants</Button>
      )}
      <Button onClick={() => navigate('/expense')}>Expenses</Button>
      <Button onClick={() => navigate('/grocery-list')}>Grocery List</Button>
    </>
  );

  return <div>{home ? dashboard : guestDashboard}</div>;
}

export default DashboardPage;
