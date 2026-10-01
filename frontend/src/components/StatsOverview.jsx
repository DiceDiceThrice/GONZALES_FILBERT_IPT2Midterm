import React from 'react';
import { Layers, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function StatsOverview({ stats }) {
  const cards = [
    {
      label: 'Total Rentals',
      value: stats.total || 0,
      icon: Layers,
    },
    {
      label: 'Active Rentals',
      value: stats.active || 0,
      icon: Clock,
    },
    {
      label: 'Overdue Returns',
      value: stats.overdue || 0,
      icon: AlertTriangle,
    },
    {
      label: 'Returned Items',
      value: stats.returned || 0,
      icon: CheckCircle,
    },
  ];

  return (
    <section className="stats-grid">
      {cards.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div key={index} className="stat-card">
            <div className="stat-icon-wrapper">
              <IconComponent size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{item.value}</span>
              <span className="stat-label">{item.label}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
