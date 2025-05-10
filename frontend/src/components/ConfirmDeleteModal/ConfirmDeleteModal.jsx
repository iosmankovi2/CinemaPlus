import React from "react";
import "./ConfirmDeleteModal.css";

const ConfirmDeleteModal = ({ visible, onConfirm, onCancel, user }) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Delete User</h3>
        <p>Are you sure you want to delete <strong>{user.firstName}</strong>?</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="confirm-btn" onClick={() => onConfirm(user.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
