import React, { useState } from "react";
import Filters from "../Filters/Filters"
import UserRow from "../UserRow/UserRow";
import "./UserTable.css";
const hardcodedUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Administrator",
    status: "Active",
    lastLogin: "2024-05-10T11:30:00",
    bookings: 12,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Staff",
    status: "Active",
    lastLogin: "2024-05-09T18:45:00",
    bookings: 8,
  },
  {
    id: 3,
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: "Customer",
    status: "Suspended",
    lastLogin: "2024-04-20T16:30:00",
    bookings: 5,
  },
  // Dodaj još po potrebi...
];

const UserTable = () => {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const filteredUsers = hardcodedUsers.filter((user) => {
    return (
      (role === "" || user.role === role) &&
      (status === "" || user.status === status)
    );
  });

  return (
    <div className="table-container">
      <Filters setRole={setRole} setStatus={setStatus} />
      <button className="add-user-btn">Add User</button>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Bookings</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
