import React, { useState } from "react";
import "../EditUserModal/EditUserModal.css"; // koristi isti stil

const AddUserModal = ({ visible, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    userStatus: ""
  });

  const [errors, setErrors] = useState({});

  if (!visible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Add New User</h3>
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
          {errors.email && <p className="error-message">{errors.email}</p>}

          <label>Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error-message">{errors.password}</p>}

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
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
