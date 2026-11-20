import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import DashboardMetrics from './components/DashboardMetrics';
import SearchBar from './components/SearchBar';
import LeadTable from './components/LeadTable';
import LeadModal from './components/LeadModal';
import DeleteModal from './components/DeleteModal';
import AuthModal from './components/AuthModal';
import Notification from './components/Notification';
import * as leadService from './services/leadService';
import * as authService from './services/authService';

export function App() {
  // Auth state
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Leads & UI state
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pagination & Sorting state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Metrics breakdown
  const [metrics, setMetrics] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    lost: 0
  });

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notifications
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Restore authenticated session on mount
  useEffect(() => {
    const token = localStorage.getItem('lead_token');
    const storedUser = localStorage.getItem('lead_user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        authService
          .getMe(token)
          .then((verified) => setUser(verified))
          .catch(() => {
            // Token invalid or expired
            localStorage.removeItem('lead_token');
            localStorage.removeItem('lead_user');
            setUser(null);
            setIsAuthModalOpen(true);
          });
      } catch (e) {
        setUser(null);
        setIsAuthModalOpen(true);
      }
    } else {
      setIsAuthModalOpen(true);
      setIsLoading(false);
    }
  }, []);

  // Fetch leads from backend
  const fetchLeads = useCallback(
    async (
      search = searchTerm,
      status = statusFilter,
      page = pagination.page,
      limit = pagination.limit,
      field = sortBy,
      order = sortOrder
    ) => {
      const token = localStorage.getItem('lead_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await leadService.getLeads({
          search,
          status,
          page,
          limit,
          sortBy: field,
          sortOrder: order
        });

        setLeads(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
        if (res.metrics) {
          setMetrics(res.metrics);
        }
      } catch (err) {
        if (err.status === 401) {
          handleLogout();
        } else {
          showNotification(err.message || 'Failed to fetch leads from server', 'error');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, statusFilter, pagination.page, pagination.limit, sortBy, sortOrder]
  );

  // Debounced search trigger & reactive filter
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      fetchLeads(searchTerm, statusFilter, pagination.page, pagination.limit, sortBy, sortOrder);
    }, 200);

    return () => clearTimeout(timer);
  }, [user, searchTerm, statusFilter, pagination.page, pagination.limit, sortBy, sortOrder, fetchLeads]);

  // Auth handlers
  const handleAuthSuccess = (data) => {
    localStorage.setItem('lead_token', data.token);
    localStorage.setItem('lead_user', JSON.stringify(data));
    setUser(data);
    setIsAuthModalOpen(false);
    showNotification(`Welcome, ${data.name}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('lead_token');
    localStorage.removeItem('lead_user');
    setUser(null);
    setLeads([]);
    setIsAuthModalOpen(true);
    showNotification('You have been signed out.');
  };

  // Status Filter Change
  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Search Change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Sorting
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Pagination Change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  // Add / Edit Modal handlers
  const handleOpenAddModal = () => {
    setLeadToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lead) => {
    setLeadToEdit(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setLeadToEdit(null);
  };

  const handleSaveLead = async (formData) => {
    setIsSubmitting(true);
    try {
      if (leadToEdit) {
        await leadService.updateLead(leadToEdit._id, formData);
        showNotification('Lead updated successfully!');
      } else {
        await leadService.createLead(formData);
        showNotification('Lead created successfully!');
      }
      handleCloseModal();
      fetchLeads(searchTerm, statusFilter, pagination.page, pagination.limit, sortBy, sortOrder);
    } catch (err) {
      showNotification(err.message || 'Failed to save lead', 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handlers
  const handleOpenDeleteModal = (lead) => {
    setLeadToDelete(lead);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setLeadToDelete(null);
  };

  const handleConfirmDelete = async (leadId) => {
    setIsDeleting(true);
    try {
      await leadService.deleteLead(leadId);
      showNotification('Lead deleted successfully');
      handleCloseDeleteModal();
      fetchLeads(searchTerm, statusFilter, pagination.page, pagination.limit, sortBy, sortOrder);
    } catch (err) {
      showNotification(err.message || 'Failed to delete lead', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-container">
      <Header
        user={user}
        onAddLead={handleOpenAddModal}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <main className="main-content">
        {user ? (
          <>
            <DashboardMetrics
              metrics={metrics}
              activeStatus={statusFilter}
              onSelectStatus={handleStatusChange}
            />

            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              statusFilter={statusFilter}
              onStatusChange={handleStatusChange}
              totalCount={metrics.total}
              filteredCount={pagination.total}
            />

            <LeadTable
              leads={leads}
              isLoading={isLoading}
              pagination={pagination}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              onEditLead={handleOpenEditModal}
              onDeleteLead={handleOpenDeleteModal}
              onOpenAddModal={handleOpenAddModal}
            />
          </>
        ) : (
          <div className="table-card">
            <div className="empty-state">
              <h3 className="empty-state-title">Welcome to Lead Manager</h3>
              <p className="empty-state-text">
                Please sign in to access your sales leads pipeline and dashboard.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Sign In / Register
              </button>
            </div>
          </div>
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <LeadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveLead}
        leadToEdit={leadToEdit}
        isSubmitting={isSubmitting}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        lead={leadToDelete}
        isDeleting={isDeleting}
      />

      <Notification
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}

export default App;
