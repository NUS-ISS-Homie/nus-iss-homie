import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';

import './App.css';
// import { useSockets } from './context/SocketContext';
import HomeRegisterPage from './pages/HomeRegisterPage';
import DashboardPage from './pages/home/DashboardPage';
import HomeJoinPage from './pages/HomeJoinPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ExpenseMainPage from './pages/expenses/ExpenseMainPage';
import { useUser } from './context/UserContext';
import Navbar from './components/Navbar';

function App() {
  // const { homeSocket: socket } = useSockets();
  // socket.on('connected', () => console.log("SOCKET CONNECTED"));

  const user = useUser();

  const registeredRoutes = (
    <Routes>
      <Route path='/' element={<DashboardPage />}></Route>
      <Route path='/home' element={<DashboardPage />}></Route>
      <Route path='/join' element={<HomeJoinPage />}></Route>
      <Route path='/registerHome' element={<HomeRegisterPage />}></Route>
      <Route path='/expense' element={<ExpenseMainPage />}></Route>
      <Route path='*' element={<Navigate replace to='/home' />} />
    </Routes>
  );

  const guestRoutes = (
    <Routes>
      <Route path='/' element={<Navigate replace to='/signup' />}></Route>
      <Route path='/signup' element={<SignUpPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='*' element={<Navigate replace to='/login' />} />
    </Routes>
  );

  return (
    <div className='App'>
      <CssBaseline />
      <Box>
        <Router>
          {user.username && <Navbar />}
          {user.username ? registeredRoutes : guestRoutes}
        </Router>
      </Box>
    </div>
  );
}

export default App;
