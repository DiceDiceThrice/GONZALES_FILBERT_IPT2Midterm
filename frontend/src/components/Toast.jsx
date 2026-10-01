import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="toast-container">
      <div className={`toast ${isSuccess ? 'success' : 'error'}`}>
        {isSuccess ? (
          <CheckCircle2 size={18} color="#48bb78" />
        ) : (
          <AlertCircle size={18} color="#f56565" />
        )}
        <span style={{ flex: 1 }}>{toast.message}</span>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
