import React, { useEffect, useState } from 'react';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import { useHome } from '../../context/HomeContext';
import { boxShadow } from '../../styles';

enum Role {
  Admin = 'Admin',
  Member = 'Member',
}

interface Tenant {
  username: string;
  role: Role;
}

function TenantView(props: { tenant: Tenant }) {
  const { tenant } = props;

  return (
    <Box
      boxShadow={boxShadow}
      bgcolor='#f3f7fa'
      textAlign='left'
      padding='1rem'
      borderRadius='8px'
      display='flex'
      alignItems='center'
      justifyContent='center'
    >
      <Avatar
        sx={{
          bgcolor: tenant.role === Role.Admin ? 'primary.main' : 'secondary',
        }}
      >
        {tenant.username[0]}
      </Avatar>
      <Box marginLeft='1rem'>
        <Typography variant='h6'>{tenant.username}</Typography>
        <Typography variant='subtitle1' color='grey'>
          {tenant.role}
        </Typography>
      </Box>
    </Box>
  );
}

function TenantDetails() {
  const home = useHome();
  const [tenants, setTenants] = useState<Tenant[]>([]);

  useEffect(() => {
    if (!home) return;
    console.log('HOME', home);
    const tenants = [];
<<<<<<< HEAD
    console.log(home);
    home.adminUser.username &&
      tenants.push({ username: home.adminUser.username, role: Role.Admin });
    home.users.forEach(
      ({ username }) =>
        username && tenants.push({ username, role: Role.Member })
    );
    console.log(tenants);
=======
    tenants.push({ username: home.adminUser.username, role: Role.Admin });
    home.users.forEach(({ username }) =>
      tenants.push({ username, role: Role.Member })
    );
    console.log('tenants:', tenants);
>>>>>>> main
    setTenants(tenants);
  }, [home]);

  return (
    <Grid container columnGap={2} justifyContent='center' alignItems='center'>
      {tenants.map((t, i) => t && <TenantView tenant={t} key={i} />)}
    </Grid>
  );
}

export default TenantDetails;
