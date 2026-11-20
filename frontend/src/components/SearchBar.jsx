import React from 'react';
import { Search, X, Filter } from 'lucide-react';

const STATUS_OPTIONS = ['All', 'New', 'Contacted', 'Qualified', 'Lost'];

const SearchBar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  totalCount,
  filteredCount
}) => {
  return (
    <div className="search-filter-card">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search leads by name, email, or company..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          id="lead-search-input"
        />
        {searchTerm && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => onSearchChange('')}
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="filter-group">
        <div className="filter-label">
          <Filter size={16} />
          <span>Status:</span>
        </div>
        <div className="status-pills">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              className={`status-pill ${statusFilter === status ? 'active' : ''} ${status.toLowerCase()}`}
              onClick={() => onStatusChange(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="results-counter">
        Showing <strong>{filteredCount}</strong> of {totalCount} leads
      </div>
    </div>
  );
};

export default SearchBar;
