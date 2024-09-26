import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
// import Documentation from './components/documentation/Documentation';
// import Support from './components/support/Support';
// import SignIn from './components/signin/SignIn';
import SignIn from './components/Signin/Signin';
import SignUp from './components/Signup/Signup';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard/:id" element={<Dashboard/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
