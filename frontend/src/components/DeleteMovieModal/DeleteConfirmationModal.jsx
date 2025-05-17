import React from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ movieTitle, onConfirm, onCancel }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Delete Movie</h2>
                <p>Are you sure you want to delete <strong>{movieTitle}</strong>?</p>
                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                    <button className="delete-btn" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
