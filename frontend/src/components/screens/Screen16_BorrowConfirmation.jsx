import React, { useState } from 'react';
import { useRouter } from '../../router/Router.jsx';
import { useAppState } from '../../context/AppStateContext.jsx';
import { loanService } from '../../api/loan.js';
import { Header } from '../common/Header.jsx';
import { Button } from '../common/Button.jsx';

export function Screen16_BorrowConfirmation() {
  const { navigate, routeState } = useRouter();
  const { addLoanApplication } = useAppState();

  const amount = routeState?.amount || 45000;
  const periodMonths = routeState?.periodMonths || 3;
  const interestRate = routeState?.interestRate || 12;

  const calculations = loanService.calculateRepayment(amount, periodMonths, interestRate);

  const [hasAgreed, setHasAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasAgreed) {
      setError('You must agree to the loan terms and repayment schedule before submitting.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await loanService.submitApplication({
        amount,
        period: periodMonths,
        monthlyRepayment: calculations.monthlyRepayment,
      });

      addLoanApplication({
        id: res.reference,
        amount,
        period: periodMonths,
        monthlyRepayment: calculations.monthlyRepayment,
        status: 'Submitted (Under Review)',
        date: new Date().toLocaleDateString(),
      });

      navigate('/state/success', {
        title: 'Application Submitted!',
        message: `Your loan application for ₦${amount.toLocaleString()} has been received and queued for pool disbursement review.`,
        reference: res.reference,
        nextPath: '/home',
      });
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen screen--borrow-confirm">
      <Header title="Confirm Application" showBack onBack={() => navigate('/borrow/eligibility')} />

      <div className="borrow-confirm-card">
        {/* Loan Summary Card */}
        <div className="loan-summary-box">
          <div className="loan-summary-row">
            <span className="loan-summary-label">Loan Amount</span>
            <span className="loan-summary-val font-semibold">₦ {amount.toLocaleString()}</span>
          </div>

          <div className="loan-summary-row">
            <span className="loan-summary-label">Interest Rate</span>
            <span className="loan-summary-val">12% p.a.</span>
          </div>

          <div className="loan-summary-row">
            <span className="loan-summary-label">Repayment Period</span>
            <span className="loan-summary-val">{periodMonths} months</span>
          </div>

          <div className="loan-summary-divider" />

          <div className="loan-summary-row loan-summary-row--highlight">
            <span className="loan-summary-label">Monthly Repayment</span>
            <span className="loan-summary-val font-bold text-lg">
              ₦ {calculations.monthlyRepayment.toLocaleString()}
            </span>
          </div>

          <div className="demo-disclaimer-tag">
            <small>Total repayment: ₦{calculations.totalRepayment.toLocaleString()} (including ₦{calculations.interestTotal.toLocaleString()} peer yield)</small>
          </div>
        </div>

        {/* Loan Terms Expandable Accordion */}
        <div className="loan-terms-accordion">
          <button
            type="button"
            className="loan-terms-accordion__header"
            onClick={() => setShowTerms((prev) => !prev)}
            aria-expanded={showTerms}
          >
            <span className="font-medium text-sm">Loan Terms & Conditions</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${showTerms ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showTerms && (
            <div className="loan-terms-accordion__body">
              <p>
                1. Repayments are due on the 28th day of each calendar month.
              </p>
              <p>
                2. On-time repayments improve your campus AI credit readiness score.
              </p>
              <p>
                3. Late payments will incur a 1% campus pool penalty and restrict future pool borrowing.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="alert-box alert-box--error" role="alert">
            {error}
          </div>
        )}

        {/* Agreement Checkbox */}
        <div className="borrow-agreement mt-4">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={hasAgreed}
              onChange={(e) => {
                setError('');
                setHasAgreed(e.target.checked);
              }}
              className="checkbox-control"
            />
            <span className="checkbox-text font-medium text-sm">
              I agree to the loan terms and monthly repayment schedule.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="borrow-actions mt-4">
          <Button
            type="button"
            variant="primary-navy"
            size="lg"
            disabled={!hasAgreed}
            loading={loading}
            onClick={handleSubmit}
          >
            Submit Application
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => navigate('/borrow/eligibility')}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
