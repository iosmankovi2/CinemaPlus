import React from "react";
import "./Filters.css";
import { FaSearch} from "react-icons/fa";

const Filters = ({ setRole, setStatus, setSearchTerm }) => {
  return (
    <div className="filters-container">
    <div className="search-wrapper">
  <FaSearch className="search-icon" />
  <input
    type="text"
    placeholder="Search users..."
    className="filter-input"
    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
  />
</div>

      <select
        className="filter-select"
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">All Roles</option>
        <option value="Admin">Administrator</option>
        <option value="Guest">Guest</option>
        <option value="User">User</option>
      </select>
      <select
        className="filter-select"
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="ACTIVE">Active</option>
        <option value="SUSPENDED">Suspended</option>
      </select>
    </div>
  );
};

export default Filters;
