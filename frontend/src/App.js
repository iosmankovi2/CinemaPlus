
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import UserPage from './components/UserPage';
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <Router>
      <div>
        <Routes>
        <Route path="/" element={<Home />} />  {/* Home component */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<PrivateRoute element={<UserPage />} />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;