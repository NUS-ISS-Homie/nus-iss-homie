import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';

import './App.css';
import HomeRegisterPage, { HomeFormType } from './pages/HomeRegisterPage';
import DashboardPage from './pages/home/DashboardPage';
import HomeJoinPage from './pages/HomeJoinPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import GroceryListPage from './pages/GroceryListPage';
import ExpenseMainPage from './pages/expenses/ExpenseMainPage';
import ChoreMainPage from './pages/chores/ChoreMainPage';
import { useUser } from './context/UserContext';
import Navbar from './components/Navbar';

function App() {
  const user = useUser();

  const registeredRoutes = (
    <Routes>
      <Route path='/' element={<DashboardPage />}></Route>
      <Route path='/home' element={<DashboardPage />}></Route>
      <Route path='/join' element={<HomeJoinPage />}></Route>
      <Route
        path='/registerHome'
        element={<HomeRegisterPage type={HomeFormType.Register} />}
      ></Route>
      <Route
        path='/invite'
        element={<HomeRegisterPage type={HomeFormType.Invite} />}
      ></Route>
      <Route path='/expense' element={<ExpenseMainPage />}></Route>
      <Route path='/chore' element={<ChoreMainPage />}></Route>
      <Route path='/grocery-list' element={<GroceryListPage />} />
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
