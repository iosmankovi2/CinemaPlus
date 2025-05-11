import React from "react";
import "../ConfirmDeleteModal/ConfirmDeleteModal.css"; // koristiš isti stil kao za Add/Edit

const ConfirmDeleteModal = ({ visible, onConfirm, onCancel, itemName }) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Are you sure?</h3>
        <p>You are about to cancel the screening <strong>{itemName}</strong>. This action cannot be undone.</p>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>Return</button>
          <button className="confirm-btn" onClick={onConfirm}>Yes, Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
