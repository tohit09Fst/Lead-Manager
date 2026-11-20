import React from 'react';
import { Layers, PlusCircle, CheckCircle, Clock, AlertOctagon } from 'lucide-react';

const DashboardMetrics = ({ metrics, activeStatus, onSelectStatus }) => {
  if (!metrics) return null;

  const cards = [
    {
      id: 'All',
      label: 'Total Leads',
      count: metrics.total || 0,
      icon: <Layers size={18} />,
      colorClass: 'metric-all'
    },
    {
      id: 'New',
      label: 'New',
      count: metrics.new || 0,
      icon: <PlusCircle size={18} />,
      colorClass: 'metric-new'
    },
    {
      id: 'Contacted',
      label: 'Contacted',
      count: metrics.contacted || 0,
      icon: <Clock size={18} />,
      colorClass: 'metric-contacted'
    },
    {
      id: 'Qualified',
      label: 'Qualified',
      count: metrics.qualified || 0,
      icon: <CheckCircle size={18} />,
      colorClass: 'metric-qualified'
    },
    {
      id: 'Lost',
      label: 'Lost',
      count: metrics.lost || 0,
      icon: <AlertOctagon size={18} />,
      colorClass: 'metric-lost'
    }
  ];

  return (
    <div className="metrics-grid">
      {cards.map((card) => {
        const isSelected = activeStatus === card.id;
        return (
          <div
            key={card.id}
            className={`metric-card ${card.colorClass} ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelectStatus(card.id)}
            role="button"
            tabIndex={0}
            title={`Filter by ${card.label}`}
          >
            <div className="metric-header">
              <span className="metric-icon">{card.icon}</span>
              <span className="metric-label">{card.label}</span>
            </div>
            <div className="metric-count">{card.count}</div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardMetrics;
