import React, { useState } from 'react';
import { useRouter, Link } from '../../router/Router.jsx';
import { authService } from '../../api/auth.js';
import { Header } from '../common/Header.jsx';
import { Input } from '../common/Input.jsx';
import { Button } from '../common/Button.jsx';

export function Screen04_ForgotPassword() {
  const { navigate } = useRouter();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError('Please enter your registered email or phone number');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(emailOrPhone);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Could not send reset link. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen screen--auth">
      <Header showBack onBack={() => navigate('/login')} />

      <div className="auth-card">
        <div className="auth-brand">
          <h1 className="auth-title">Reset your password</h1>
          <p className="auth-subtitle">
            Enter your email or phone number and we'll send a link to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="forgot-success-state">
            <div className="forgot-illustration">
              <svg width="120" height="90" viewBox="0 0 120 90" fill="none">
                {/* Envelope */}
                <rect x="20" y="30" width="80" height="50" rx="8" fill="#d8b56d" />
                <path d="M20 35L60 62L100 35" stroke="#101c2c" strokeWidth="2.5" />
                {/* Paper Airplane */}
                <path d="M75 10L95 28L82 32L78 40L75 32L65 24Z" fill="#101c2c" />
                <path d="M75 32L95 28" stroke="#ffffff" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="alert-box alert-box--success">
              <strong>Reset link sent! (Demo Simulation)</strong>
              <p>
                A simulated password reset link has been dispatched to <b>{emailOrPhone}</b>.
                Please check your inbox or SMS.
              </p>
            </div>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/login')}
            >
              Back to login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <Input
              label="Email or phone number"
              name="emailOrPhone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="e.g. 08123456789 or you@gmail.com"
              error={error}
              required
            />

            <Button
              type="submit"
              variant="primary-navy"
              size="lg"
              loading={loading}
            >
              Send Reset Link
            </Button>

            <div className="auth-switch">
              <Link to="/login" className="auth-switch__link">
                Back to login
              </Link>
            </div>

            {/* Visual envelope matching screen 4 */}
            <div className="forgot-illustration">
              <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
                <rect x="15" y="25" width="70" height="45" rx="6" fill="#f0e6ce" stroke="#d8b56d" strokeWidth="2" />
                <path d="M15 28L50 50L85 28" stroke="#d8b56d" strokeWidth="2" />
                <path d="M60 12L78 26L67 29L64 36L61 29L53 23Z" fill="#101c2c" />
              </svg>
              <p className="forgot-caption">Check your email or SMS for reset guidance.</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
