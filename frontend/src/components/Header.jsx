import React from 'react';
import { Users, Plus, LogOut, UserCheck } from 'lucide-react';

const Header = ({ user, onAddLead, onLogout, onOpenAuth }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <div className="header-icon">
            <Users size={24} />
          </div>
          <div>
            <h1 className="header-title">Lead Manager</h1>
            <p className="header-subtitle">Sales pipeline & lead tracking system</p>
          </div>
        </div>

        <div className="header-actions">
          {user ? (
            <>
              <div className="user-profile-badge" title={`Signed in as ${user.email}`}>
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : <UserCheck size={16} />}
                </div>
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className="user-email">{user.email}</span>
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

              <button
                className="btn btn-secondary btn-icon"
                onClick={onLogout}
                title="Log out"
                aria-label="Log out"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onOpenAuth}>
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
