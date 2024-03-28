import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useUser } from '../../context/UserContext';
import TenantDetails from './TenantDetails';
import { useAuth, useHome } from '../../context/HomeContext';
import { useSockets } from '../../context/SocketContext';
import { homeSocketEvents as events } from '../../constants';

function DashboardPage() {
  const navigate = useNavigate();
  const { user_id } = useUser();
  const home = useHome();
  const homeClient = useAuth();
  const { homeSocket } = useSockets();

  useEffect(() => {
    homeSocket.on(events.UPDATE_HOME, homeClient.updateHome);
  }, [homeSocket, homeClient.updateHome]);

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
    </>
  );

  return <div>{home ? dashboard : guestDashboard}</div>;
}

export default DashboardPage;
