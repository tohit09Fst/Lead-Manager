import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, lead, isDeleting }) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content modal-content-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-danger">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 className="modal-title">Delete Lead</h2>
            <p className="modal-subtitle">Confirm lead removal</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="delete-warning-text">
            Are you sure you want to delete <strong>{lead.name}</strong> from <strong>{lead.company}</strong>?
          </p>
          <div className="delete-lead-summary">
            <div><span className="summary-label">Email:</span> {lead.email}</div>
            <div><span className="summary-label">Status:</span> {lead.status}</div>
          </div>
          <p className="delete-caution-note">
            This action is permanent and cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(lead._id)}
            disabled={isDeleting}
            id="btn-confirm-delete"
          >
            {isDeleting ? (
              <>
                <div className="btn-spinner"></div>
                <span>Deleting...</span>
              </>
            ) : (
              'Yes, Delete Lead'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
