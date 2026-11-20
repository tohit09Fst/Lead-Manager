import React from 'react';
import {
  Edit2,
  Trash2,
  Mail,
  Phone,
  Building,
  Calendar,
  Inbox,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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
  pagination,
  onPageChange,
  onLimitChange,
  sortBy,
  sortOrder,
  onSortChange,
  onEditLead,
  onDeleteLead,
  onOpenAddModal
}) => {
  const renderSortIndicator = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown size={14} className="sort-icon-neutral" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={14} className="sort-icon-active" />
    ) : (
      <ArrowDown size={14} className="sort-icon-active" />
    );
  };

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
            No leads match your current search or filter criteria. Create a new lead to populate your pipeline.
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
              <th
                className="sortable-header"
                onClick={() => onSortChange('name')}
                title="Sort by Name"
              >
                <div className="th-content">
                  <span>Lead Name & Company</span>
                  {renderSortIndicator('name')}
                </div>
              </th>
              <th>Contact Info</th>
              <th
                className="sortable-header"
                onClick={() => onSortChange('source')}
                title="Sort by Source"
              >
                <div className="th-content">
                  <span>Source</span>
                  {renderSortIndicator('source')}
                </div>
              </th>
              <th
                className="sortable-header"
                onClick={() => onSortChange('status')}
                title="Sort by Status"
              >
                <div className="th-content">
                  <span>Status</span>
                  {renderSortIndicator('status')}
                </div>
              </th>
              <th
                className="sortable-header"
                onClick={() => onSortChange('createdAt')}
                title="Sort by Creation Date"
              >
                <div className="th-content">
                  <span>Created Date</span>
                  {renderSortIndicator('createdAt')}
                </div>
              </th>
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

      {/* Pagination Footer */}
      {pagination && (
        <div className="pagination-footer">
          <div className="pagination-size-selector">
            <label htmlFor="limit-select">Rows per page:</label>
            <select
              id="limit-select"
              value={pagination.limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="pagination-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="pagination-info">
            Showing{' '}
            <strong>
              {pagination.total === 0
                ? 0
                : (pagination.page - 1) * pagination.limit + 1}
            </strong>{' '}
            to{' '}
            <strong>
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </strong>{' '}
            of <strong>{pagination.total}</strong> leads
          </div>

          <div className="pagination-controls">
            <button
              type="button"
              className="pagination-btn"
              disabled={!pagination.hasPrevPage}
              onClick={() => onPageChange(pagination.page - 1)}
              title="Previous Page"
            >
              <ChevronLeft size={16} />
              <span>Prev</span>
            </button>

            <span className="pagination-current-page">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              type="button"
              className="pagination-btn"
              disabled={!pagination.hasNextPage}
              onClick={() => onPageChange(pagination.page + 1)}
              title="Next Page"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadTable;
