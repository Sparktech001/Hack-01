import React from 'react';
import { useRouter } from '../../router/Router.jsx';
import { Button } from '../common/Button.jsx';

export function Screen21_SuccessState({
  title = 'Application Submitted!',
  message = 'Your loan application has been received and queued for pool disbursement review.',
  reference = 'LN-NIG-782194',
  nextPath = '/home',
  actionLabel = 'Back to Home',
}) {
  const { navigate, routeState } = useRouter();

  const finalTitle = routeState?.title || title;
  const finalMsg = routeState?.message || message;
  const finalRef = routeState?.reference || reference;
  const finalNext = routeState?.nextPath || nextPath;

  return (
    <div className="screen screen--state">
      <div className="state-card state-card--success">
        <div className="state-icon state-icon--success">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#28785c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h1 className="state-title">{finalTitle}</h1>
        <p className="state-message">{finalMsg}</p>

        {finalRef && (
          <div className="state-ref-box">
            <span className="state-ref-label">Reference ID</span>
            <span className="state-ref-code font-mono">{finalRef}</span>
          </div>
        )}

        <div className="state-actions">
          <Button
            variant="primary-navy"
            size="lg"
            onClick={() => navigate(finalNext)}
          >
            {actionLabel}
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={() => navigate('/transactions')}
          >
            View Transactions
          </Button>
        </div>
      </div>
    </div>
  );
}
