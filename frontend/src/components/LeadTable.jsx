import React from 'react';
import { Edit2, Trash2, Mail, Phone, Building, Calendar, Inbox } from 'lucide-react';

const STATUS_BADGE_CLASSES = {
  New: 'badge-new',
  Contacted: 'badge-contacted',
  Qualified: 'badge-qualified',
  Lost: 'badge-lost'
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const LeadTable = ({
  leads,
  isLoading,
  onEditLead,
  onDeleteLead,
  onOpenAddModal
}) => {
  if (isLoading) {
    return (
      <div className="table-card">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading leads...</p>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="table-card">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Inbox size={48} />
          </div>
          <h3 className="empty-state-title">No leads found</h3>
          <p className="empty-state-text">
            No leads match your current search and filter criteria, or no leads have been added yet.
          </p>
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            Add Your First Lead
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Lead Name & Company</th>
              <th>Contact Info</th>
              <th>Source</th>
              <th>Status</th>
              <th>Created Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const badgeClass = STATUS_BADGE_CLASSES[lead.status] || 'badge-new';
              return (
                <tr key={lead._id} className="lead-row">
                  <td>
                    <div className="lead-name-cell">
                      <span className="lead-name">{lead.name}</span>
                      <span className="lead-company">
                        <Building size={14} className="cell-icon" />
                        {lead.company}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="lead-contact-cell">
                      <a href={`mailto:${lead.email}`} className="contact-link">
                        <Mail size={14} className="cell-icon" />
                        {lead.email}
                      </a>
                      <a href={`tel:${lead.phone}`} className="contact-link phone">
                        <Phone size={14} className="cell-icon" />
                        {lead.phone}
                      </a>
                    </div>
                  </td>
                  <td>
                    <span className="source-tag">{lead.source}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${badgeClass}`}>
                      <span className="status-dot"></span>
                      {lead.status}
                    </span>
                  </td>
                  <td>
                    <span className="lead-date">
                      <Calendar size={14} className="cell-icon" />
                      {formatDate(lead.createdAt)}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="actions-cell">
                      <button
                        type="button"
                        className="action-btn edit-btn"
                        title="Edit lead"
                        onClick={() => onEditLead(lead)}
                        aria-label={`Edit ${lead.name}`}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        className="action-btn delete-btn"
                        title="Delete lead"
                        onClick={() => onDeleteLead(lead)}
                        aria-label={`Delete ${lead.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
