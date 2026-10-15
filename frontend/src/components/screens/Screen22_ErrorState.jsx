import React from 'react';
import { useRouter } from '../../router/Router.jsx';
import { Button } from '../common/Button.jsx';

export function Screen22_ErrorState({
  title = 'Something went wrong',
  message = 'We could not complete your request. Please check your connection and try again.',
  onRetry,
}) {
  const { navigate, routeState } = useRouter();

  const finalTitle = routeState?.title || title;
  const finalMsg = routeState?.message || message;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="screen screen--state">
      <div className="state-card state-card--error">
        <div className="state-icon state-icon--error">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d33838" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1 className="state-title">{finalTitle}</h1>
        <p className="state-message">{finalMsg}</p>

        <div className="state-actions">
          <Button
            variant="primary-navy"
            size="lg"
            onClick={handleRetry}
          >
            Try Again
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={() => navigate('/home')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
