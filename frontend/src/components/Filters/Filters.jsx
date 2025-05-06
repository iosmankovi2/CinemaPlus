import React from "react";
import "./Filters.css";

const Filters = ({ setRole, setStatus }) => {
  return (
    <div className="filters-container">
      <input
        type="text"
        placeholder="Search users..."
        className="filter-input"
        onChange={(e) => {
          // Ovdje možeš dodati search logiku ako želiš
        }}
      />
      <select
        className="filter-select"
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">All Roles</option>
        <option value="Administrator">Administrator</option>
        <option value="Staff">Staff</option>
        <option value="Customer">Customer</option>
      </select>
      <select
        className="filter-select"
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Suspended">Suspended</option>
      </select>
    </div>
  );
};

export default Filters;
