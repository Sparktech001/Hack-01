import React from 'react';
import { useRouter } from '../../router/Router.jsx';
import { Button } from '../common/Button.jsx';

export function Screen23_LoadingState({
  message = 'Loading your information...',
  subtext = "This won't take long",
}) {
  const { navigate, routeState } = useRouter();

  const finalMsg = routeState?.message || message;
  const finalSub = routeState?.subtext || subtext;

  return (
    <div className="screen screen--state" role="status" aria-live="polite">
      <div className="state-card state-card--loading">
        <div className="loading-spinner-ring">
          <svg width="60" height="60" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="#edf0f4"
              strokeWidth="4"
            />
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="#20334a"
              strokeWidth="4"
              strokeDasharray="80"
              strokeDashoffset="60"
              strokeLinecap="round"
              className="spinner-circle-animate"
            />
          </svg>
        </div>

        <h1 className="state-title">{finalMsg}</h1>
        <p className="state-message">{finalSub}</p>

        <div className="state-actions mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/home')}
          >
            Cancel & Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
