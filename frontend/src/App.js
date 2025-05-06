import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/Login';
import UserPage from './components/UserPage';
import PrivateRoute from './components/PrivateRoute';
import Sale from './components/Hall/Hall';
import HallDetails from './components/Hall/HallDetails';
import MovieSection from './components/MovieSection/MovieSection';
import MovieDetails from './components/MovieDetails/MovieDetails';

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />  {/* Home component */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<PrivateRoute element={<UserPage />} />} />
          <Route path="sale" element={<Sale />} />
          <Route path="sale/:hallId" element={<HallDetails />} />
          <Route path="movies" element={<MovieSection />} />
          <Route path="movies/:id" element={<MovieDetails />} />
          <Route path="projections" element={<MovieDetails />} />
        </Route>
      </Routes>

    </Router>
  );
}

export default App;