import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import RentalTable from './components/RentalTable';
import RentalModal from './components/RentalModal';
import DeleteModal from './components/DeleteModal';
import Toast from './components/Toast';
import {
  getRentals,
  getRentalStats,
  createRental,
  updateRental,
  deleteRental,
  checkHealth,
} from './services/api';

export default function App() {
  // Application state
  const [rentals, setRentals] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, overdue: 0, returned: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal states
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [editingRental, setEditingRental] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRental, setDeletingRental] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // READ: Load rental records and dashboard statistics from Express backend
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [rentalsRes, statsRes, healthRes] = await Promise.all([
        getRentals({ search: searchQuery, size: selectedSize, status: selectedStatus }),
        getRentalStats(),
        checkHealth().catch(() => ({ status: 'offline' })),
      ]);

      setRentals(rentalsRes.data || []);
      setStats(statsRes.data || { total: 0, active: 0, overdue: 0, returned: 0 });
      setIsConnected(healthRes.status === 'online');
    } catch (error) {
      console.error('Failed to load rental data:', error);
      setIsConnected(false);
      showToast('Could not connect to backend server.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedSize, selectedStatus]);

  // Initial load and filter effect
  useEffect(() => {
    loadData();
  }, [loadData]);

  // CREATE: Handler for adding a new rental record
  const handleCreateSubmit = async (formData) => {
    await createRental(formData);
    showToast('Rental record created successfully.', 'success');
    await loadData();
  };

  // UPDATE: Handler for editing an existing rental record
  const handleUpdateSubmit = async (formData) => {
    if (!editingRental) return;
    await updateRental(editingRental.id, formData);
    showToast('Rental record updated successfully.', 'success');
    setEditingRental(null);
    await loadData();
  };

  // DELETE: Handler for deleting a rental record
  const handleDeleteConfirm = async (id) => {
    await deleteRental(id);
    showToast('Rental record deleted successfully.', 'success');
    setDeletingRental(null);
    await loadData();
  };

  // Modal triggers
  const handleOpenCreateModal = () => {
    setEditingRental(null);
    setIsRentalModalOpen(true);
  };

  const handleOpenEditModal = (rental) => {
    setEditingRental(rental);
    setIsRentalModalOpen(true);
  };

  const handleOpenDeleteModal = (rental) => {
    setDeletingRental(rental);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Navigation header with server status */}
      <Navbar
        isConnected={isConnected}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* Overview stats cards */}
      <StatsOverview stats={stats} />

      {/* Main interactive table view with search and filters (READ) */}
      <RentalTable
        rentals={rentals}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
      />

      {/* CREATE & UPDATE Modal */}
      <RentalModal
        isOpen={isRentalModalOpen}
        onClose={() => {
          setIsRentalModalOpen(false);
          setEditingRental(null);
        }}
        onSubmit={editingRental ? handleUpdateSubmit : handleCreateSubmit}
        initialData={editingRental}
      />

      {/* DELETE Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingRental(null);
        }}
        onConfirm={handleDeleteConfirm}
        rental={deletingRental}
      />

      {/* Toast Alert Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
