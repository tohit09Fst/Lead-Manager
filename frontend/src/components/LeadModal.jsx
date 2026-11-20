import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building, Compass, AlertCircle } from 'lucide-react';

const SOURCES = [
  'Website',
  'Referral',
  'Cold Call',
  'LinkedIn',
  'Email Campaign',
  'Other'
];

const STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'];

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  source: 'Website',
  status: 'New'
};

const LeadModal = ({ isOpen, onClose, onSubmit, leadToEdit, isSubmitting }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const isEditMode = Boolean(leadToEdit);

  useEffect(() => {
    if (leadToEdit) {
      setFormData({
        name: leadToEdit.name || '',
        email: leadToEdit.email || '',
        phone: leadToEdit.phone || '',
        company: leadToEdit.company || '',
        source: leadToEdit.source || 'Website',
        status: leadToEdit.status || 'New'
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
    setTouched({});
  }, [leadToEdit, isOpen]);

  if (!isOpen) return null;

  const validateField = (name, value) => {
    let error = '';
    const trimmed = typeof value === 'string' ? value.trim() : value;

    switch (name) {
      case 'name':
        if (!trimmed) {
          error = 'Full name is required';
        } else if (trimmed.length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!trimmed) {
          error = 'Email address is required';
        } else if (!emailRegex.test(trimmed)) {
          error = 'Please enter a valid email (e.g. name@company.com)';
        }
        break;
      case 'phone':
        const phoneRegex = /^[0-9+\s\-().]{7,20}$/;
        if (!trimmed) {
          error = 'Phone number is required';
        } else if (!phoneRegex.test(trimmed)) {
          error = 'Please enter a valid phone number (min 7 digits)';
        }
        break;
      case 'company':
        if (!trimmed) {
          error = 'Company name is required';
        }
        break;
      case 'source':
        if (!trimmed) {
          error = 'Source is required';
        }
        break;
      case 'status':
        if (!trimmed) {
          error = 'Status is required';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        name: true,
        email: true,
        phone: true,
        company: true,
        source: true,
        status: true
      });
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {isEditMode ? 'Edit Lead' : 'Add New Lead'}
            </h2>
            <p className="modal-subtitle">
              {isEditMode
                ? 'Update lead contact details and current pipeline status'
                : 'Enter lead contact information to track in your pipeline'}
            </p>
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

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="lead-name" className="form-label">
                Lead Name <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  id="lead-name"
                  name="name"
                  type="text"
                  placeholder="e.g. Sarah Connor"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.name ? 'is-invalid' : ''}`}
                  autoFocus
                />
              </div>
              {errors.name && (
                <div className="field-error">
                  <AlertCircle size={14} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Email & Phone grid */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="lead-email" className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="lead-email"
                    name="email"
                    type="email"
                    placeholder="sarah@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                  />
                </div>
                {errors.email && (
                  <div className="field-error">
                    <AlertCircle size={14} />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lead-phone" className="form-label">
                  Phone Number <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <Phone size={16} className="input-icon" />
                  <input
                    id="lead-phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 555-019-2834"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${errors.phone ? 'is-invalid' : ''}`}
                  />
                </div>
                {errors.phone && (
                  <div className="field-error">
                    <AlertCircle size={14} />
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Company */}
            <div className="form-group">
              <label htmlFor="lead-company" className="form-label">
                Company Name <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Building size={16} className="input-icon" />
                <input
                  id="lead-company"
                  name="company"
                  type="text"
                  placeholder="e.g. Cyberdyne Systems"
                  value={formData.company}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.company ? 'is-invalid' : ''}`}
                />
              </div>
              {errors.company && (
                <div className="field-error">
                  <AlertCircle size={14} />
                  <span>{errors.company}</span>
                </div>
              )}
            </div>

            {/* Source & Status grid */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="lead-source" className="form-label">
                  Source <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <Compass size={16} className="input-icon" />
                  <select
                    id="lead-source"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-select ${errors.source ? 'is-invalid' : ''}`}
                  >
                    {SOURCES.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.source && (
                  <div className="field-error">
                    <AlertCircle size={14} />
                    <span>{errors.source}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lead-status" className="form-label">
                  Status <span className="required">*</span>
                </label>
                <select
                  id="lead-status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <div className="field-error">
                    <AlertCircle size={14} />
                    <span>{errors.status}</span>
                  </div>
                )}
              </div>
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
              {isSubmitting ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>Saving...</span>
                </>
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Create Lead'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
