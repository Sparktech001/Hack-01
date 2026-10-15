import React from 'react';
import { useRouter } from '../../router/Router.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Header } from '../common/Header.jsx';
import { Button } from '../common/Button.jsx';

export function Screen15_BorrowEligibility() {
  const { navigate, routeState } = useRouter();
  const { user } = useAuth();

  const requestedAmount = routeState?.amount || 25000;
  const purpose = routeState?.purpose || 'Books & Gadgets';
  const periodMonths = routeState?.periodMonths || 3;

  // Transparent calculation based on monthly income
  const income = user?.monthlyIncome || 45000;
  const calculatedLimit = Math.max(requestedAmount, Math.min(75000, Math.round(income * 1.5)));

  const handleContinue = () => {
    navigate('/borrow/confirm', {
      amount: requestedAmount,
      purpose,
      periodMonths,
      loanLimit: calculatedLimit,
      interestRate: 12,
    });
  };

  return (
    <div className="screen screen--eligibility">
      <Header title="Loan Eligibility" showBack onBack={() => navigate('/borrow')} />

      <div className="eligibility-card">
        {/* Positive Eligibility Green Banner */}
        <div className="eligibility-banner">
          <div className="eligibility-banner__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="eligibility-banner__content">
            <h2 className="eligibility-banner__title">You're eligible!</h2>
            <p className="eligibility-banner__text">
              Based on your verified student profile and pool liquidity for up to ₦{calculatedLimit.toLocaleString()}.
            </p>
          </div>
        </div>

        {/* Loan Offer Details Card */}
        <div className="eligibility-offer-card">
          <div className="eligibility-offer-header">
            <span className="eligibility-offer-label">Your approved loan limit</span>
            <div className="eligibility-offer-amount">₦ {calculatedLimit.toLocaleString()}</div>
          </div>

          <div className="eligibility-offer-divider" />

          <div className="eligibility-offer-meta">
            <div className="eligibility-meta-row">
              <span className="eligibility-meta-label">Interest rate</span>
              <span className="eligibility-meta-val font-semibold">12% p.a.</span>
            </div>
            <div className="eligibility-meta-row">
              <span className="eligibility-meta-label">Repayment period</span>
              <span className="eligibility-meta-val">2 – 6 months</span>
            </div>
            <div className="eligibility-meta-row">
              <span className="eligibility-meta-label">Requested amount</span>
              <span className="eligibility-meta-val font-semibold">₦ {requestedAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="demo-disclaimer-tag">
            <small>Demo assessment: Subject to final collective pool disbursement rules.</small>
          </div>
        </div>

        {/* Next Steps 1, 2, 3 */}
        <div className="eligibility-steps-section">
          <h3 className="eligibility-steps-title">Next Steps</h3>
          <div className="eligibility-steps-list">
            <div className="eligibility-step-item">
              <div className="eligibility-step-number">1</div>
              <div className="eligibility-step-text">Review and agree to peer loan repayment schedule.</div>
            </div>

            <div className="eligibility-step-item">
              <div className="eligibility-step-number">2</div>
              <div className="eligibility-step-text">Confirm your application and submit for campus review.</div>
            </div>

            <div className="eligibility-step-item">
              <div className="eligibility-step-number">3</div>
              <div className="eligibility-step-text">Receive funds in your campus balance upon approval.</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="eligibility-actions mt-4">
          <Button
            variant="primary-navy"
            size="lg"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
