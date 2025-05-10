import React, { useState, useEffect } from "react";
import "./EditUserModal.css";

const EditUserModal = ({ visible, user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    userStatus: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
        role: user.role || "",
        userStatus: user.userStatus || ""
      });
    }
  }, [user]);
  
  if (!visible || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user.id, formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Edit User</h3>
        <form onSubmit={handleSubmit} className="edit-user-form">

          <label>First Name</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <label>Last Name</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            placeholder="Enter new password if you want to change it"
            onChange={handleChange}
          />

          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="Admin">Administrator</option>
            <option value="User">User</option>
            <option value="Guest">Guest</option>
          </select>

          <label>Status</label>
          <select
            name="userStatus"
            value={formData.userStatus}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="confirm-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
