<<<<<<< Updated upstream
import React from 'react';
=======
>>>>>>> Stashed changes
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
<<<<<<< Updated upstream

import './App.css';
// import { useSockets } from './context/SocketContext';
import HomeRegisterPage from './pages/HomeRegisterPage';
import DashboardPage from './pages/home/DashboardPage';
import HomeJoinPage from './pages/HomeJoinPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ExpenseMainPage from './pages/expenses/ExpenseMainPage';
import { useUser, getUsername } from './context/UserContext';
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
=======
import { useUser } from './context/UserContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  const user = useUser();

  const guestRoutes = (
    <Routes>
      <Route path='/' element={<Navigate replace to='/signup' />}></Route>
      <Route path='/signup' element={<SignUpPage/>} />
>>>>>>> Stashed changes
      <Route path='/login' element={<LoginPage />} />
      <Route path='*' element={<Navigate replace to='/login' />} />
    </Routes>
  );

  return (
    <div className='App'>
      <CssBaseline />
      <Box>
        <Router>
<<<<<<< Updated upstream
          {user.username && <Navbar />}
          {user.username ? registeredRoutes : guestRoutes}
=======
          {guestRoutes}
>>>>>>> Stashed changes
        </Router>
      </Box>
    </div>
  );
}

export default App;