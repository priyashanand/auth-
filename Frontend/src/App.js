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
import CheckChannel from './components/CheckChannel/CheckChannel';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/create-channel" element={<CreateChannelForm />} />
          <Route path="/dashboard/:id" element={<ChannelDashboard />} />
          <Route path="/channels/:channelId/entries" element={<ChannelEntriesForm />} /> {/* New route for entries */}
          <Route path="/check-channel" element={<CheckChannel/>} />
          {/* <Route path="/data-entry" element={<ChannelEntriesForm />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
