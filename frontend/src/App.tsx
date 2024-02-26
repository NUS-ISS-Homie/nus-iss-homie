import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';

import './App.css';
// import { useSockets } from './context/SocketContext';
import HomeRegisterPage from './pages/HomeRegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  // const { homeSocket: socket } = useSockets();
  // socket.on('connected', () => console.log("SOCKET CONNECTED"));

  const guestRoutes = (
    <Routes>
      <Route path='/signup' element={<HomeRegisterPage />}></Route>
      <Route path='/' element={<DashboardPage />}></Route>
    </Routes>
  );

  return (
    <div className='App'>
      <CssBaseline />
      <Box>
        <Router>{guestRoutes}</Router>
      </Box>
    </div>
  );
}

export default App;
