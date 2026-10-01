import React from 'react';
import { Sparkles, Plus, Database, AlertCircle } from 'lucide-react';

export default function Navbar({ isConnected, onOpenCreateModal }) {
  return (
    <header className="navbar">
      <div className="brand-section">
        <div className="brand-icon">
          <Sparkles size={22} />
        </div>
        <div>
          <h1 className="brand-title">Royal Silk Boutique</h1>
          <p className="brand-subtitle">Gown Rental Management</p>
        </div>
      </div>

      <div className="nav-actions">
        <div className={`connection-badge ${isConnected ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          {isConnected ? (
            <span>Backend Online</span>
          ) : (
            <span>Backend Offline</span>
          )}
        </div>

        <button className="btn btn-primary" onClick={onOpenCreateModal}>
          <Plus size={16} />
          <span>New Rental</span>
        </button>
      </div>
    </header>
  );
}
