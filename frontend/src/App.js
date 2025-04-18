import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/Login';
import Sale from './components/Hall/Hall';
import HallDetails from './components/Hall/HallDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="sale" element={<Sale />} />
          <Route path="sale/:hallId" element={<HallDetails />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;