import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'Custom'];

export default function RentalModal({ isOpen, onClose, onSubmit, initialData }) {
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState({
    gown_name: '',
    size: 'M',
    customer: '',
    rental_date: '',
    return_date: '',
    status: 'Active',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync form state when editing existing record or opening modal
  useEffect(() => {
    if (initialData) {
      const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toISOString().split('T')[0];
      };

      setFormData({
        gown_name: initialData.gown_name || '',
        size: initialData.size || 'M',
        customer: initialData.customer || '',
        rental_date: formatDateForInput(initialData.rental_date),
        return_date: formatDateForInput(initialData.return_date),
        status: initialData.status || 'Active',
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      setFormData({
        gown_name: '',
        size: 'M',
        customer: '',
        rental_date: today,
        return_date: nextWeek,
        status: 'Active',
      });
    }
    setErrorMessage('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeSelect = (size) => {
    setFormData((prev) => ({ ...prev, size }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Field validations
    if (!formData.gown_name.trim()) {
      setErrorMessage('Gown name is required.');
      return;
    }
    if (!formData.customer.trim()) {
      setErrorMessage('Customer name is required.');
      return;
    }
    if (!formData.rental_date) {
      setErrorMessage('Rental date is required.');
      return;
    }
    if (!formData.return_date) {
      setErrorMessage('Return date is required.');
      return;
    }
    if (new Date(formData.return_date) < new Date(formData.rental_date)) {
      setErrorMessage('Return date cannot be earlier than rental date.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save rental record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditMode ? `Edit Rental Record #${initialData.id}` : 'Register New Gown Rental'}
          </h2>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMessage && (
              <div style={{ color: '#fc8181', marginBottom: '16px', fontSize: '0.875rem' }}>
                {errorMessage}
              </div>
            )}

            {/* Field 1: Gown Name */}
            <div className="form-group">
              <label>Gown Name</label>
              <input
                type="text"
                name="gown_name"
                className="form-input"
                placeholder="e.g., Emerald Velvet Gala Gown"
                value={formData.gown_name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Field 2: Size */}
            <div className="form-group">
              <label>Gown Size</label>
              <div className="size-selector">
                {AVAILABLE_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`size-pill ${formData.size === s ? 'selected' : ''}`}
                    onClick={() => handleSizeSelect(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 3: Customer Name */}
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                name="customer"
                className="form-input"
                placeholder="e.g., Sophia Hernandez"
                value={formData.customer}
                onChange={handleChange}
                required
              />
            </div>

            {/* Field 4 & 5: Rental Date and Return Date */}
            <div className="form-row">
              <div className="form-group">
                <label>Rental Date</label>
                <input
                  type="date"
                  name="rental_date"
                  className="form-input"
                  value={formData.rental_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Return Date</label>
                <input
                  type="date"
                  name="return_date"
                  className="form-input"
                  value={formData.return_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Status Field */}
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                className="form-input select-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Returned">Returned</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <Check size={16} />
              <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Update Record' : 'Save Rental'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
