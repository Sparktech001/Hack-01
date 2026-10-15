import React from 'react';
import { useRouter } from '../../router/Router.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Header } from '../common/Header.jsx';
import { Button } from '../common/Button.jsx';

export function Screen17_AICheckLanding() {
  const { navigate } = useRouter();
  const { user } = useAuth();

  const displayName = user?.fullName?.split(' ')[0] || 'Adekunle';

  return (
    <div className="screen screen--ai-check">
      <Header title="AI Credit Readiness" showBack={false} />

      <div className="ai-landing-card">
        {/* Navy Hero Card with AI Mascot Illustration */}
        <div className="ai-landing-hero">
          <div className="ai-landing-hero__mascot">
            <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
              <circle cx="34" cy="34" r="30" fill="#1c2e44" stroke="#d8b56d" strokeWidth="2" />
              {/* Robot Face */}
              <rect x="22" y="24" width="24" height="20" rx="5" fill="#101c2c" stroke="#d8b56d" strokeWidth="1.5" />
              {/* Eyes */}
              <circle cx="28" cy="32" r="2.5" fill="#d8b56d" />
              <circle cx="40" cy="32" r="2.5" fill="#d8b56d" />
              {/* Smile / Antenna */}
              <path d="M29 38C31 40 37 40 39 38" stroke="#d8b56d" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="34" y1="24" x2="34" y2="18" stroke="#d8b56d" strokeWidth="2" strokeLinecap="round" />
              <circle cx="34" cy="17" r="2" fill="#d8b56d" />
            </svg>
          </div>

          <h2 className="ai-landing-hero__greeting">Hi {displayName} 👋</h2>
          <p className="ai-landing-hero__text">
            We evaluate financial credibility—helping you understand your credit readiness,
            improve your habits, and unlock higher campus pool limits.
          </p>

          <div className="ai-landing-hero__action">
            <Button
              variant="primary-gold"
              size="lg"
              onClick={() => navigate('/ai-check/score')}
            >
              Check My Readiness
            </Button>
          </div>
        </div>

        {/* Feature List: What can help with? */}
        <div className="ai-features-section">
          <h3 className="ai-features-title">What can help with?</h3>

          <div className="ai-features-list">
            <div className="ai-feature-item">
              <div className="ai-feature-item__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28785c" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="ai-feature-item__content">
                <div className="ai-feature-item__title">Credit readiness assessment</div>
                <div className="ai-feature-item__desc">Transparent scoring based on student income and discipline.</div>
              </div>
            </div>

            <div className="ai-feature-item">
              <div className="ai-feature-item__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#20334a" strokeWidth="2">
                  <path d="M18 20V10M12 20V4M6 20v-6" />
                </svg>
              </div>
              <div className="ai-feature-item__content">
                <div className="ai-feature-item__title">Financial health score</div>
                <div className="ai-feature-item__desc">Track expense ratios and disposable buffer monthly.</div>
              </div>
            </div>

            <div className="ai-feature-item">
              <div className="ai-feature-item__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8b56d" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="ai-feature-item__content">
                <div className="ai-feature-item__title">Loan eligibility insights</div>
                <div className="ai-feature-item__desc">Know your maximum borrowing capacity before applying.</div>
              </div>
            </div>

            <div className="ai-feature-item">
              <div className="ai-feature-item__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28785c" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="ai-feature-item__content">
                <div className="ai-feature-item__title">Actionable tips</div>
                <div className="ai-feature-item__desc">Specific steps to boost your campus reputation.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
