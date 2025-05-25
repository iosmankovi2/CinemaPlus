import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/Login';
import Sale from './components/Hall/Hall';
import HallDetails from './components/Hall/HallDetails';
import MovieSection from './components/MovieSection/MovieSection';
import MovieDetails from './components/MovieDetails/MovieDetails';
import UserTable from './components/UserTable/UserTable';
import ScreeningsPage from './components/ScreeningPage/ScreeningPage';
import AdminDashboard from './components/AdminDashBoard/AdminDashboard';
import Profile from './components/Profile';
import RoleRoute from "./RoleRoute";
import AdminMovieManagement from "./components/AdminMovieSection/AdminMovieManagement";
import AdminLayout from "./components/AdminLayout";
import PaymentPage from './components/Payment/Payment';
import Success from './components/Payment/Success'
import Failed from './components/Payment/Failed'
import TicketsPage from "./components/TicketsPage/TicketsPage";
function App() {
  return (
    <Router>
      <Routes>
        {/* Sve stranice unutar Layouta imaju zajednički navbar */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
           <Route path="/user" element={<Profile />} /> 
          <Route path="sale" element={<Sale />} />
          <Route path="sale/:hallId" element={<HallDetails />} />
          <Route path="movies" element={<MovieSection />} />
          <Route path="movies/:id" element={<MovieDetails />} />
          <Route path="projections" element={<MovieDetails />} />
          <Route path="users/admin/:id" element={<UserTable/>} />
          <Route path="reviews" element={<MovieDetails />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="success" element={<Success/>} />
          <Route path="failed" element={<Failed/>} />

          </Route>

        {/* Admin Routes */}
        <Route path="admin/dashboard" element={<RoleRoute requiredRole="Admin" element={<AdminDashboard />} />} />
        <Route path="admin/screenings" element={<RoleRoute requiredRole="Admin" element={<ScreeningsPage />} />} />
        <Route path="admin/users" element={<RoleRoute requiredRole="Admin" element={<UserTable />} />} />
        <Route path="admin/movies" element={<RoleRoute requiredRole="Admin" element={<AdminMovieManagement />} />} />
        <Route path="admin/bookings" element={<RoleRoute requiredRole="Admin" element={<TicketsPage />} />} />
      </Routes>
    </Router>
  );
}
export default App;
