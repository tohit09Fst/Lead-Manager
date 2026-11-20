import React from 'react';
import { Users, Plus } from 'lucide-react';

const Header = ({ onAddLead }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <div className="header-icon">
            <Users size={24} />
          </div>
          <div>
            <h1 className="header-title">Lead Manager</h1>
            <p className="header-subtitle">Capture, track, and convert sales leads efficiently</p>
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={onAddLead}
          id="btn-add-lead"
        >
          <Plus size={18} />
          <span>Add Lead</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
