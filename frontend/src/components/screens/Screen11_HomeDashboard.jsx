import React, { useState } from 'react';
import { useRouter } from '../../router/Router.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppState } from '../../context/AppStateContext.jsx';
import { VerifiedBadge } from '../common/Badge.jsx';
import { CircularScore } from '../common/CircularScore.jsx';
import { Modal } from '../common/Modal.jsx';
import { Input } from '../common/Input.jsx';
import { Button } from '../common/Button.jsx';

export function Screen11_HomeDashboard() {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const {
    balance,
    isBalanceHidden,
    toggleBalanceVisibility,
    unreadNotificationsCount,
    addFunds,
  } = useAppState();

  const [activeModal, setActiveModal] = useState(null); // 'add' | 'withdraw' | 'send' | 'more'
  const [modalAmount, setModalAmount] = useState('5000');
  const [modalMsg, setModalMsg] = useState('');

  const displayName = user?.fullName?.split(' ')[0] || 'Adekunle';

  const formatNaira = (amt) => {
    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amt);
  };

  const handleDeposit = async () => {
    await addFunds(Number(modalAmount));
    setModalMsg(`Successfully credited ₦${modalAmount} (Simulated Demo Action)`);
    setTimeout(() => {
      setModalMsg('');
      setActiveModal(null);
    }, 1200);
  };

  return (
    <div className="screen screen--home">
      {/* Top Header */}
      <div className="home-topbar">
        <div className="home-topbar__user">
          <div className="home-topbar__greeting">
            Good morning, {displayName} ✌️
          </div>
          <div className="home-topbar__status">
            <VerifiedBadge label="Verified Student" />
          </div>
        </div>

        <button
          type="button"
          className="home-topbar__notif-btn"
          onClick={() => navigate('/notifications')}
          aria-label="View notifications"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadNotificationsCount > 0 && (
            <span className="home-topbar__notif-badge" />
          )}
        </button>
      </div>

      {/* Available Balance Navy Card */}
      <div className="balance-card">
        <div className="balance-card__header">
          <span className="balance-card__label">Available Balance</span>
          <button
            type="button"
            className="balance-card__toggle-btn"
            onClick={toggleBalanceVisibility}
            aria-label={isBalanceHidden ? 'Show balance' : 'Hide balance'}
          >
            {isBalanceHidden ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        <div className="balance-card__amount">
          {isBalanceHidden ? '₦ •••••••' : `₦ ${formatNaira(balance)}`}
        </div>

        {/* 4 Action Buttons matching Screen 11 */}
        <div className="balance-card__actions">
          <div className="balance-card__action-item">
            <button
              type="button"
              className="balance-action-btn"
              onClick={() => setActiveModal('send')}
              aria-label="Send money"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
            <span className="balance-action-label">Send</span>
          </div>

          <div className="balance-card__action-item">
            <button
              type="button"
              className="balance-action-btn"
              onClick={() => setActiveModal('add')}
              aria-label="Add money"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <span className="balance-action-label">Add Money</span>
          </div>

          <div className="balance-card__action-item">
            <button
              type="button"
              className="balance-action-btn"
              onClick={() => setActiveModal('withdraw')}
              aria-label="Withdraw"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
            <span className="balance-action-label">Withdraw</span>
          </div>

          <div className="balance-card__action-item">
            <button
              type="button"
              className="balance-action-btn"
              onClick={() => setActiveModal('more')}
              aria-label="More actions"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
            <span className="balance-action-label">More</span>
          </div>
        </div>
      </div>

      {/* Your Financial Habits Card */}
      <div
        className="habits-card"
        onClick={() => navigate('/ai-check/score')}
        role="button"
        tabIndex="0"
      >
        <div className="habits-card__header">
          <span className="habits-card__title">Your Financial Habits</span>
        </div>

        <div className="habits-card__body">
          <CircularScore score={72} size={70} strokeWidth={7} />
          <div className="habits-card__info">
            <div className="habits-card__status">Good</div>
            <div className="habits-card__desc">
              Keep paying bills on time to boost your score.
            </div>
          </div>
          <div className="habits-card__arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <button
            type="button"
            className="quick-action-card"
            onClick={() => navigate('/pool')}
          >
            <div className="quick-action-card__icon quick-action-card__icon--pool">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="quick-action-card__label">Join Pool</span>
          </button>

          <button
            type="button"
            className="quick-action-card"
            onClick={() => navigate('/borrow')}
          >
            <div className="quick-action-card__icon quick-action-card__icon--borrow">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <span className="quick-action-card__label">Borrow</span>
          </button>

          <button
            type="button"
            className="quick-action-card"
            onClick={() => navigate('/profile')}
          >
            <div className="quick-action-card__icon quick-action-card__icon--profile">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="quick-action-card__label">Profile</span>
          </button>
        </div>
      </div>

      {/* Collective Pool Teaser Card */}
      <div className="pool-summary-banner" onClick={() => navigate('/pool')}>
        <div className="pool-summary-banner__header">
          <span className="pool-summary-banner__badge">Campus Lending Pool</span>
          <span className="pool-summary-banner__stats">342 active contributors</span>
        </div>
        <div className="pool-summary-banner__body">
          <div className="pool-summary-banner__val">₦ 4,550,000</div>
          <p className="pool-summary-banner__text">
            Pool funds student peer loans at 12% p.a. Repayments return directly to contributors.
          </p>
        </div>
      </div>

      {/* Modals for Add Money / Withdraw / Send */}
      <Modal
        isOpen={Boolean(activeModal)}
        onClose={() => setActiveModal(null)}
        title={
          activeModal === 'add'
            ? 'Add Money (Demo)'
            : activeModal === 'withdraw'
            ? 'Withdraw Funds (Demo)'
            : activeModal === 'send'
            ? 'Send Money (Demo)'
            : 'More Features'
        }
      >
        {modalMsg ? (
          <div className="alert-box alert-box--success">{modalMsg}</div>
        ) : (
          <div>
            <p className="text-secondary mb-4">
              {activeModal === 'add' && 'Simulate depositing funds to your demo student balance.'}
              {activeModal === 'withdraw' && 'Simulate withdrawing funds to your campus bank account.'}
              {activeModal === 'send' && 'Transfer funds to another peer on campus.'}
              {activeModal === 'more' && 'Additional campus finance tools coming soon.'}
            </p>

            {['add', 'withdraw', 'send'].includes(activeModal) && (
              <Input
                label="Amount"
                type="number"
                prefix="₦"
                value={modalAmount}
                onChange={(e) => setModalAmount(e.target.value)}
              />
            )}

            <div className="mt-4 flex gap-2">
              {activeModal === 'add' && (
                <Button variant="primary-navy" onClick={handleDeposit}>
                  Confirm Add ₦{modalAmount}
                </Button>
              )}
              {activeModal !== 'add' && (
                <Button
                  variant="primary-navy"
                  onClick={() => {
                    setModalMsg('Simulated demo action completed');
                    setTimeout(() => {
                      setModalMsg('');
                      setActiveModal(null);
                    }, 1200);
                  }}
                >
                  Proceed (Demo)
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
