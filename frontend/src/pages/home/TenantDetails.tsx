import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { useHome } from '../../context/HomeContext';
import { useUser } from '../../context/UserContext';

function Tenant(props: { tenant: string }) {
  const { tenant } = props;

  return (
    <div>
      <Typography variant='h6'>{tenant}</Typography>
    </div>
  );
}

function TenantDetails() {
  const user = useUser();
  const home = useHome();
  const [tenants, setTenants] = useState(user ? [user.username] : []);

  useEffect(() => {
    if (!home._id) return;
    setTenants([user.username, ...home.users]);
  }, [home, user.username]);

  return <div>{tenants.map((t, i) => t && <Tenant tenant={t} key={i} />)}</div>;
}

export default TenantDetails;
