import React, { useState } from 'react';
import { useRouter } from '../../router/Router.jsx';
import { Header } from '../common/Header.jsx';
import { Badge } from '../common/Badge.jsx';
import { Button } from '../common/Button.jsx';

export function Screen24_SecurityStatus() {
  const { navigate, routeState } = useRouter();

  const [status, setStatus] = useState(routeState?.status || 'Successful');
  const amount = routeState?.amount || 25000;
  const reference = routeState?.reference || 'SEC-TX-849201';
  const timestamp = routeState?.timestamp || new Date().toLocaleString();

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Successful':
        return <Badge variant="success" size="md">Successful</Badge>;
      case 'Pending':
        return <Badge variant="warning" size="md">Pending Verification</Badge>;
      case 'Failed':
        return <Badge variant="danger" size="md">Failed</Badge>;
      default:
        return <Badge variant="neutral" size="md">{st}</Badge>;
    }
  };

  return (
    <div className="screen screen--security-status">
      <Header title="Transaction Status" showBack onBack={() => navigate('/home')} />

      <div className="security-card">
        {/* Shield Icon */}
        <div className="security-icon-wrapper">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#20334a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>

        <h1 className="security-title">Security & Transaction Record</h1>
        <div className="security-status-badge mt-2">
          {getStatusBadge(status)}
        </div>

        {/* Transaction Detail Card */}
        <div className="security-details-box mt-4">
          <div className="sec-detail-row">
            <span className="sec-detail-label">Amount</span>
            <span className="sec-detail-val font-bold">₦ {Number(amount).toLocaleString()}</span>
          </div>

          <div className="sec-detail-row">
            <span className="sec-detail-label">Reference</span>
            <span className="sec-detail-val font-mono">{reference}</span>
          </div>

          <div className="sec-detail-row">
            <span className="sec-detail-label">Channel</span>
            <span className="sec-detail-val">Collective Campus Pool</span>
          </div>

          <div className="sec-detail-row">
            <span className="sec-detail-label">Timestamp</span>
            <span className="sec-detail-val text-xs">{timestamp}</span>
          </div>

          <div className="demo-disclaimer-box mt-3">
            <small>Simulated transaction security receipt for hackathon prototype testing.</small>
          </div>
        </div>

        {/* Status Switcher for Reviewers to test states */}
        <div className="status-tester mt-4">
          <span className="text-xs text-muted block mb-1">Reviewer Quick-Test States:</span>
          <div className="status-tester__buttons">
            {['Successful', 'Pending', 'Failed'].map((st) => (
              <button
                key={st}
                type="button"
                className={`status-test-btn ${status === st ? 'status-test-btn--active' : ''}`}
                onClick={() => setStatus(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="security-actions mt-4">
          <Button
            variant="primary-navy"
            size="lg"
            onClick={() => navigate('/home')}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
