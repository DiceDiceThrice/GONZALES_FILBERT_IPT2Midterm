import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm, rental }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !rental) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm(rental.id);
      onClose();
    } catch (error) {
      console.error('Delete action failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} color="#fc8181" />
            <h2 className="modal-title">Confirm Deletion</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Are you sure you want to permanently delete this gown rental record?
          </p>
          <div
            style={{
              background: 'var(--bg-surface-elevated)',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {rental.gown_name} ({rental.size})
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Customer: {rental.customer} | Record ID: #{rental.id}
            </div>
          </div>
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
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Record'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
