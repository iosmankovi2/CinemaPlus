import React from "react";
import "./UserRow.css";

const UserRow = ({ user, onDelete, onEdit}) => {
  return (
    <tr className="user-row">
      <td>
        <div>
          <div className="user-name">{user.firstName}</div>
          <div className="user-lastName">{user.lastName}</div>
          <div className="user-email">{user.email}</div>
        </div>
      </td>
      <td>
        <span className={`role-tag role-${user.role.toLowerCase()}`}>
          {user.role}
        </span>
      </td>
      <td>
        <span className={`status-tag status-${user.userStatus.toLowerCase()}`}>
          {user.userStatus.toLowerCase()}
        </span>
      </td>
      <td>{new Date(user.lastLogin).toLocaleString()}</td>
      <td>{user.bookings}</td>
      <td>
          <button className="edit-btn" onClick={()=>onEdit(user)}>Edit</button>
          <button className="delete-btn"onClick={() => onDelete(user.id)} >Delete</button>
      </td>
    </tr>
  );
};

export default UserRow;
