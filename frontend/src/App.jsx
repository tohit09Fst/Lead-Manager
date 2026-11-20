import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import LeadTable from './components/LeadTable';
import LeadModal from './components/LeadModal';
import DeleteModal from './components/DeleteModal';
import Notification from './components/Notification';
import * as leadService from './services/leadService';

export function App() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

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

  // Fetch leads from backend
  const fetchLeads = useCallback(async (search = '', status = 'All') => {
    try {
      setIsLoading(true);
      const data = await leadService.getLeads(search, status);
      setLeads(data);
    } catch (err) {
      console.error('Error fetching leads:', err);
      showNotification(err.message || 'Failed to fetch leads from server', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search / filter trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads(searchTerm, statusFilter);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, fetchLeads]);

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
        // Update existing lead
        await leadService.updateLead(leadToEdit._id, formData);
        showNotification('Lead updated successfully!');
      } else {
        // Create new lead
        await leadService.createLead(formData);
        showNotification('Lead created successfully!');
      }
      handleCloseModal();
      fetchLeads(searchTerm, statusFilter);
    } catch (err) {
      console.error('Error saving lead:', err);
      showNotification(err.message || 'Failed to save lead', 'error');
      throw err; // re-throw so modal can display validation errors if any
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
      fetchLeads(searchTerm, statusFilter);
    } catch (err) {
      console.error('Error deleting lead:', err);
      showNotification(err.message || 'Failed to delete lead', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-container">
      <Header onAddLead={handleOpenAddModal} />

      <main className="main-content">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          totalCount={leads.length}
          filteredCount={leads.length}
        />

        <LeadTable
          leads={leads}
          isLoading={isLoading}
          onEditLead={handleOpenEditModal}
          onDeleteLead={handleOpenDeleteModal}
          onOpenAddModal={handleOpenAddModal}
        />
      </main>

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
