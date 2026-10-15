import React, { useState } from 'react';
import { useRouter } from '../../router/Router.jsx';
import { useAppState } from '../../context/AppStateContext.jsx';
import { Header } from '../common/Header.jsx';
import { Button } from '../common/Button.jsx';
import { Modal } from '../common/Modal.jsx';
import { Input } from '../common/Input.jsx';
import { Screen12_PoolTermsGate } from './Screen12_PoolTermsGate.jsx';

export function Screen12_PoolOverview() {
  const { navigate } = useRouter();
  const { poolAccepted, poolContribution, addContribution } = useAppState();

  const [showGate, setShowGate] = useState(!poolAccepted);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [contributeAmount, setContributeAmount] = useState('5000');
  const [successMsg, setSuccessMsg] = useState('');

  // If terms have not been accepted yet, show the mandatory Pool Terms gate
  if (showGate) {
    return (
      <Screen12_PoolTermsGate
        onAcceptSuccess={() => setShowGate(false)}
        onDecline={() => navigate('/home')}
      />
    );
  }

  const handleJoinOrContribute = () => {
    setShowContributeModal(true);
  };

  const handleConfirmContribution = async () => {
    await addContribution(Number(contributeAmount));
    setSuccessMsg(`Contributed ₦${contributeAmount} to campus pool! (Simulated Demo Action)`);
    setTimeout(() => {
      setSuccessMsg('');
      setShowContributeModal(false);
    }, 1200);
  };

  return (
    <div className="screen screen--pool">
      <Header title="Collective Lending Pool" showBack={false} />

      <div className="pool-overview-card">
        {/* Total Pool Value Header */}
        <div className="pool-stat-hero">
          <div className="pool-stat-hero__label">Total Pool Value</div>
          <div className="pool-stat-hero__row">
            <span className="pool-stat-hero__amount">₦ 4,550,000</span>
            <span className="pool-badge-growth">+12% this month</span>
          </div>
          <small className="demo-disclaimer-text">Simulated campus aggregate pool value</small>
        </div>

        {/* 2-Column Stats: Total Contributors & Active Borrowers */}
        <div className="pool-stat-grid">
          <div className="pool-stat-box">
            <span className="pool-stat-box__label">Total Volunteers</span>
            <span className="pool-stat-box__val">342</span>
            <span className="pool-stat-box__sub">Contributors</span>
          </div>

          <div className="pool-stat-box">
            <span className="pool-stat-box__label">Active Borrowers</span>
            <span className="pool-stat-box__val">298</span>
            <span className="pool-stat-box__sub">Students funded</span>
          </div>
        </div>

        {/* User Contribution Navy Banner */}
        <div className="user-contribution-card">
          <div className="user-contribution-card__left">
            <span className="user-contribution-card__label">Your Contribution</span>
            <span className="user-contribution-card__amount">₦ {poolContribution.toLocaleString()}</span>
          </div>
          <button
            type="button"
            className="user-contribution-card__btn"
            onClick={() => navigate('/pool/statistics')}
          >
            View Details →
          </button>
        </div>

        {/* How the Pool Works Section */}
        <div className="pool-how-it-works">
          <h2 className="pool-section-title">How the Pool Works</h2>
          <div className="pool-steps-grid">
            <div className="pool-step-card">
              <div className="pool-step-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="pool-step-card__title">1. Students Lend</h3>
              <p className="pool-step-card__desc">Min ₦2k/session pooled into campus safe vault.</p>
            </div>

            <div className="pool-step-card">
              <div className="pool-step-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
              <h3 className="pool-step-card__title">2. Pool Funds</h3>
              <p className="pool-step-card__desc">Disburses to verified peers with fair 12% p.a. terms.</p>
            </div>

            <div className="pool-step-card">
              <div className="pool-step-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </div>
              <h3 className="pool-step-card__title">3. Repayments</h3>
              <p className="pool-step-card__desc">Yield & principal return directly to contributors.</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pool-actions mt-4">
          <Button
            variant="primary-navy"
            size="lg"
            onClick={handleJoinOrContribute}
          >
            Join My Pool
          </Button>
        </div>
      </div>

      {/* Contribution Modal */}
      <Modal
        isOpen={showContributeModal}
        onClose={() => setShowContributeModal(false)}
        title="Contribute to Campus Pool (Demo)"
      >
        {successMsg ? (
          <div className="alert-box alert-box--success">{successMsg}</div>
        ) : (
          <div>
            <p className="text-secondary mb-4">
              Enter amount to allocate from your available student balance into the UNILAG lending pool.
            </p>
            <Input
              label="Contribution Amount"
              type="number"
              prefix="₦"
              min="2000"
              value={contributeAmount}
              onChange={(e) => setContributeAmount(e.target.value)}
              helperText="Minimum demo contribution is ₦2,000"
            />
            <div className="mt-4">
              <Button variant="primary-navy" onClick={handleConfirmContribution}>
                Confirm Contribution ₦{Number(contributeAmount).toLocaleString()}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
