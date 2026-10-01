import React from 'react';
import { Search, Filter, Edit2, Trash2, Inbox, Loader2 } from 'lucide-react';

export default function RentalTable({
  rentals,
  isLoading,
  searchQuery,
  onSearchChange,
  selectedSize,
  onSizeChange,
  selectedStatus,
  onStatusChange,
  onEdit,
  onDelete,
}) {
  // Helper to format ISO date string to readable YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Helper for rendering status styling class
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'badge-active';
      case 'Returned':
        return 'badge-returned';
      case 'Overdue':
        return 'badge-overdue';
      default:
        return 'badge-active';
    }
  };

  return (
    <section>
      {/* Search and Filters Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by gown name or customer..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="select-control"
            value={selectedSize}
            onChange={(e) => onSizeChange(e.target.value)}
          >
            <option value="ALL">All Sizes</option>
            <option value="XS">Size XS</option>
            <option value="S">Size S</option>
            <option value="M">Size M</option>
            <option value="L">Size L</option>
            <option value="XL">Size XL</option>
            <option value="Custom">Custom Size</option>
          </select>

          <select
            className="select-control"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Returned">Returned</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="table-container">
        {isLoading ? (
          <div className="loading-spinner">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : rentals.length === 0 ? (
          <div className="empty-state">
            <Inbox className="empty-state-icon" size={48} />
            <h3 className="empty-state-title">No Rental Records Found</h3>
            <p>Try adjusting your search criteria or register a new rental record.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Gown Name</th>
                <th>Size</th>
                <th>Customer</th>
                <th>Rental Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((item) => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--text-muted)' }}>#{item.id}</td>
                  <td className="gown-cell-name">{item.gown_name}</td>
                  <td>
                    <span className="size-badge">{item.size}</span>
                  </td>
                  <td className="customer-cell">{item.customer}</td>
                  <td>{formatDate(item.rental_date)}</td>
                  <td>{formatDate(item.return_date)}</td>
                  <td>
                    <span className={`badge ${getBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-secondary btn-icon"
                        title="Edit Record"
                        onClick={() => onEdit(item)}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="btn btn-danger btn-icon"
                        title="Delete Record"
                        onClick={() => onDelete(item)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
