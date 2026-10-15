import React from 'react';
import { useRouter } from '../../router/Router.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../common/Button.jsx';
import { VerifiedBadge } from '../common/Badge.jsx';

export function Screen10_VerificationSuccess() {
  const { navigate } = useRouter();
  const { user, onboardingData } = useAuth();

  const institution = user?.institution || onboardingData.institutionName || 'University of Lagos';
  const studentId = user?.studentId || onboardingData.studentId || '25/ENG/1517';
  const verificationDate = user?.verificationDate || 'Apr 24, 2025';

  return (
    <div className="screen screen--verification-success">
      <div className="verification-success__content">
        {/* Animated Green Badge */}
        <div className="verification-success__badge-wrapper">
          <div className="verification-success__badge">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <h1 className="verification-success__title">Verification Complete!</h1>
        <p className="verification-success__subtitle">
          Your student details have been verified. You're now ready to use LMONI.
        </p>

        {/* Verification Record Card */}
        <div className="verification-record-card">
          <div className="verification-record-row">
            <span className="verification-record-label">Student Status</span>
            <span className="verification-record-val">
              <VerifiedBadge label="Verified" />
            </span>
          </div>

          <div className="verification-record-divider" />

          <div className="verification-record-row">
            <span className="verification-record-label">Institution</span>
            <span className="verification-record-val font-semibold">{institution}</span>
          </div>

          <div className="verification-record-row">
            <span className="verification-record-label">Student ID</span>
            <span className="verification-record-val font-mono">{studentId}</span>
          </div>

          <div className="verification-record-row">
            <span className="verification-record-label">Verification Date</span>
            <span className="verification-record-val">{verificationDate}</span>
          </div>

          <div className="verification-record-demo-tag">
            <small>Demo Simulation: verified for prototype review</small>
          </div>
        </div>

        <div className="verification-success__action">
          <Button
            variant="primary-gold"
            size="lg"
            onClick={() => navigate('/home')}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
