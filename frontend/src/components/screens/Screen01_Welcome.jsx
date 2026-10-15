import React from 'react';
import { useRouter } from '../../router/Router.jsx';
import { Button } from '../common/Button.jsx';

export function Screen01_Welcome() {
  const { navigate } = useRouter();

  return (
    <div className="screen screen--welcome">
      {/* Brand Monogram */}
      <div className="welcome-brand">
        <div className="welcome-brand__monogram">LM</div>
        <h1 className="welcome-brand__headline">Your money. Your trust. Your future.</h1>
      </div>

      {/* Visual Illustration */}
      <div className="welcome-hero">
        <div className="welcome-hero__graphic">
          <svg viewBox="0 0 320 200" fill="none" className="welcome-hero__svg">
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#182c44" />
                <stop offset="100%" stopColor="#101c2c" />
              </linearGradient>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e5c378" />
                <stop offset="100%" stopColor="#c29947" />
              </linearGradient>
            </defs>
            <rect width="320" height="200" rx="16" fill="url(#skyGrad)" />
            {/* University Campus silhouette */}
            <path d="M40 160h240v15H40z" fill="#0d1825" />
            <path d="M60 160V120h40v40zm50 0V95h60v65zm70 0V110h40v50zm50 0V135h30v25z" fill="#142337" opacity="0.8" />
            {/* Campus Dome */}
            <path d="M120 95c0-15 15-25 20-25s20 10 20 25z" fill="url(#goldGrad)" opacity="0.9" />
            <line x1="140" y1="70" x2="140" y2="60" stroke="#e5c378" strokeWidth="2" />
            {/* Student Silhouette */}
            <circle cx="160" cy="148" r="14" fill="#0b121b" />
            <path d="M142 185c0-15 12-23 18-23s18 8 18 23z" fill="#0b121b" />
            {/* Backpack strap */}
            <path d="M147 167c2 6 7 12 13 14" stroke="#d8b56d" strokeWidth="2" strokeLinecap="round" />
            <circle cx="160" cy="148" r="13" stroke="#d8b56d" strokeWidth="1" opacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Copy & Purpose */}
      <div className="welcome-footer">
        <h2 className="welcome-footer__subhead">Smart finance for Nigerian students.</h2>
        <p className="welcome-footer__text">
          Access collective campus peer pools, emergency loan funds, and build your credit readiness early.
        </p>

        {/* Action Buttons */}
        <div className="welcome-actions">
          <Button
            variant="primary-gold"
            size="lg"
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={() => navigate('/login')}
          >
            I already have an account
          </Button>
        </div>
      </div>
    </div>
  );
}
