<<<<<<< Updated upstream
import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useSockets } from './context/SocketContext';

function App() {
  const { homeSocket: socket } = useSockets();

  // socket.on('connected', () => console.log("SOCKET CONNECTED"));
=======
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
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
      <Route path='/login' element={<LoginPage />} />
      <Route path='*' element={<Navigate replace to='/login' />} />
    </Routes>
  );
>>>>>>> Stashed changes

  return (
    <div className='App'>
      <CssBaseline />
      <Box>
        <Router>
          {guestRoutes}
        </Router>
      </Box>
    </div>
  );
}

export default App;