import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/Login';
import Hall from './components/Hall/Hall';
import HallDetails from './components/Hall/HallDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="sale" element={<Hall />} />
          <Route path="sale/:hallId" element={<HallDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
