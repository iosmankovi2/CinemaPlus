import React from "react";
import "./UserRow.css";

const UserRow = ({ user }) => {
  return (
    <tr className="user-row">
      <td>
        <div>
          <div className="user-name">{user.name}</div>
          <div className="user-email">{user.email}</div>
        </div>
      </td>
      <td>
        <span className={`role-tag role-${user.role.toLowerCase()}`}>
          {user.role}
        </span>
      </td>
      <td>
        <span className={`status-tag status-${user.status.toLowerCase()}`}>
          {user.status}
        </span>
      </td>
      <td>{new Date(user.lastLogin).toLocaleString()}</td>
      <td>{user.bookings}</td>
      <td>
          <button className="edit-btn">Edit</button>
          <button className="delete-btn">Delete</button>
      </td>
    </tr>
  );
};

export default UserRow;
