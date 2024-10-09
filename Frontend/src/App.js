import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import SignIn from './components/Signin/Signin';
import SignUp from './components/Signup/Signup';
import ChannelDashboard from './components/NewDashboard/NewDashboard';
import LandingPage from './components/LandingPage/LandingPage';
import CreateChannelForm from './components/CreateChannelForm/CreateChannelForm';
import ChannelEntriesForm from './components/ChannelEntriesForm/ChannelEntriesForm';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected Routes */}
          <Route path="/landing" element={
            <PrivateRoute>
              <LandingPage />
            </PrivateRoute>
          } />
          <Route path="/create-channel" element={
            <PrivateRoute>
              <CreateChannelForm />
            </PrivateRoute>
          } />
          <Route path="/dashboard/:id" element={
            <PrivateRoute>
              <ChannelDashboard />
            </PrivateRoute>
          } />
          <Route path="/channels/:channelId/entries" element={
            <PrivateRoute>
              <ChannelEntriesForm />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;