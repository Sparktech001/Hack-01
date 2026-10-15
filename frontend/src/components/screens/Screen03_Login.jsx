import React, { useState } from 'react';
import { useRouter, Link } from '../../router/Router.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Header } from '../common/Header.jsx';
import { Input } from '../common/Input.jsx';
import { Button } from '../common/Button.jsx';

export function Screen03_Login() {
  const { navigate } = useRouter();
  const { login } = useAuth();

  const [emailOrPhone, setEmailOrPhone] = useState('adekunle.johnson@unilag.edu.ng');
  const [password, setPassword] = useState('student123');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validate = () => {
    const errs = {};
    if (!emailOrPhone.trim()) {
      errs.emailOrPhone = 'Email or phone number is required';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGeneralError('');
    try {
      await login(emailOrPhone, password);
      navigate('/home');
    } catch (err) {
      setGeneralError(err.message || 'Invalid credentials. Please verify your email/phone and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDemo = async () => {
    setLoading(true);
    try {
      await login('adekunle.johnson@unilag.edu.ng', 'google_auth_demo');
      navigate('/home');
    } catch (err) {
      setGeneralError(err.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen screen--auth">
      <Header showBack onBack={() => navigate('/welcome')} />

      <div className="auth-card">
        <div className="auth-brand">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue your journey</p>
        </div>

        {generalError && (
          <div className="alert-box alert-box--error" role="alert">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <Input
            label="Email or phone number"
            name="emailOrPhone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder="e.g. 08123456789 or you@gmail.com"
            error={errors.emailOrPhone}
            required
          />

          <div className="auth-password-group">
            <Input
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              error={errors.password}
              required
            />
            <div className="auth-forgot-link-wrapper">
              <Link to="/forgot-password" className="auth-forgot-link">
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary-navy"
            size="lg"
            loading={loading}
          >
            Log in
          </Button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleGoogleDemo}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
            }
          >
            Continue with Google <small className="auth-demo-tag">(Demo)</small>
          </Button>

          <div className="auth-switch">
            New here?{' '}
            <Link to="/signup" className="auth-switch__link">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
