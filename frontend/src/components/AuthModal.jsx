import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, AlertCircle, Sparkles } from 'lucide-react';
import * as authService from '../services/authService';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    setErrors({});
    try {
      const data = await authService.login('demo@merutechno.com', 'password123');
      onAuthSuccess(data);
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Demo login failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      let data;
      if (isLogin) {
        data = await authService.login(formData.email, formData.password);
      } else {
        data = await authService.register(formData.name, formData.email, formData.password);
      }
      onAuthSuccess(data);
      onClose();
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ form: err.message || 'Authentication failed' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content modal-content-sm auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-header">
          <div className="auth-icon-badge">
            {isLogin ? <LogIn size={24} /> : <UserPlus size={24} />}
          </div>
          <h2 className="auth-title">
            {isLogin ? 'Welcome Back' : 'Create Sales Account'}
          </h2>
          <p className="auth-subtitle">
            {isLogin
              ? 'Log in to view and manage your assigned sales leads'
              : 'Sign up to start tracking and organizing your lead pipeline'}
          </p>
        </div>

        {/* 1-Click Demo Login option for quick testing */}
        <div className="quick-demo-box">
          <div className="quick-demo-info">
            <Sparkles size={16} className="text-warning" />
            <span>Fast Reviewer Access:</span>
          </div>
          <button
            type="button"
            className="btn btn-demo"
            onClick={handleDemoLogin}
            disabled={isSubmitting}
          >
            One-Click Login as Demo User
          </button>
        </div>

        <div className="auth-divider">
          <span>OR {isLogin ? 'ENTER CREDENTIALS' : 'ENTER DETAILS'}</span>
        </div>

        {errors.form && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-body">
            {!isLogin && (
              <div className="form-group">
                <label className="form-label" htmlFor="auth-name">
                  Full Name <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    id="auth-name"
                    name="name"
                    type="text"
                    placeholder="e.g. Tohit Khan"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input ${errors.name ? 'is-invalid' : ''}`}
                  />
                </div>
                {errors.name && (
                  <div className="field-error">
                    <AlertCircle size={14} />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">
                Email Address <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                />
              </div>
              {errors.email && (
                <div className="field-error">
                  <AlertCircle size={14} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">
                Password <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  id="auth-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'is-invalid' : ''}`}
                />
              </div>
              {errors.password && (
                <div className="field-error">
                  <AlertCircle size={14} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>
          </div>

          <div className="auth-footer">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                </>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>

            <div className="auth-switch">
              {isLogin ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setIsLogin(false);
                      setErrors({});
                    }}
                  >
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setIsLogin(true);
                      setErrors({});
                    }}
                  >
                    Sign in
                  </button>
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
