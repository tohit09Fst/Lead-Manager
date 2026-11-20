import React from 'react';
import { Search, X, Filter } from 'lucide-react';

const SearchBar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onClearStatus,
  totalCount,
  filteredCount
}) => {
  const isFiltered = statusFilter && statusFilter !== 'All';

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

      <div className="search-meta-group">
        {isFiltered && (
          <div className="active-filter-badge">
            <Filter size={14} />
            <span>Filter: <strong>{statusFilter}</strong></span>
            <button
              type="button"
              className="clear-filter-mini"
              onClick={onClearStatus}
              title="Remove status filter"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <div className="results-counter">
          Showing <strong>{filteredCount}</strong> of {totalCount} leads
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
