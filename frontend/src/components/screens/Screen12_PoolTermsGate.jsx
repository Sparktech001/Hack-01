import React, { useState } from 'react';
import { useRouter } from '../../router/Router.jsx';
import { useAppState } from '../../context/AppStateContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Header } from '../common/Header.jsx';
import { Button } from '../common/Button.jsx';
import { poolService } from '../../api/pool.js';

export function Screen12_PoolTermsGate({ onAcceptSuccess, onDecline }) {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const { acceptPoolTerms, declinePoolTerms } = useAppState();

  const [hasAgreed, setHasAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const termsVersion = poolService.getTermsVersion();

  const handleAccept = async () => {
    if (!hasAgreed) return;

    setLoading(true);
    setError('');
    try {
      await acceptPoolTerms(user?.id);
      if (onAcceptSuccess) {
        onAcceptSuccess();
      } else {
        navigate('/pool');
      }
    } catch (err) {
      setError(err.message || 'Could not record acceptance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = () => {
    declinePoolTerms();
    if (onDecline) {
      onDecline();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="screen screen--pool-terms">
      <Header
        title="Before You Join the Pool"
        showBack
        onBack={handleDecline}
      />

      <div className="pool-terms-card">
        {/* Illustrative Demo Notice */}
        <div className="pool-terms-demo-banner">
          <strong>Illustrative demo terms — not finalized legal terms.</strong>
          <span className="text-xs text-muted block mt-1">Version: {termsVersion}</span>
        </div>

        {error && (
          <div className="alert-box alert-box--error" role="alert">
            {error}
          </div>
        )}

        <div className="pool-terms-body">
          <p className="pool-terms-intro">
            Please carefully review the 9 core principles governing member participation in the LMONI Collective Campus Lending Pool.
          </p>

          <div className="pool-terms-sections">
            <div className="pool-terms-item">
              <h3 className="pool-terms-heading">1. Contributions</h3>
              <p className="pool-terms-text">
                Members contribute minimum ₦2,000 per academic session. Contributions remain locked in the collective vault for a minimum 6-month cycle.
              </p>
            </div>

            <div className="pool-terms-item">
              <h3 className="pool-terms-heading">2. Allocation of Funds</h3>
              <p className="pool-terms-text">
                Contributed capital is allocated solely to verified campus peers who pass automated deterministic credit readiness and identity checks.
              </p>
            </div>

            <div className="pool-terms-item">
              <h3 className="pool-terms-heading">3. Repayment Distribution</h3>
              <p className="pool-terms-text">
                Principal repayments and 12-14% p.a. earned peer interest are automatically credited pro-rata back to active contributors' available balances.
              </p>
            </div>

            <div className="pool-terms-item">
              <h3 className="pool-terms-heading">4. Defaults and Potential Losses</h3>
              <p className="pool-terms-text">
                Peer lending involves credit risk. A campus reserve fund buffers up to 5% default, but capital loss is possible if borrower defaults exceed reserves.
              </p>
            </div>

            <div className="pool-terms-item">
              <h3 className="pool-terms-heading">5. Withdrawal Conditions</h3>
              <p className="pool-terms-text">
                Contributors may withdraw surplus yield monthly. Full principal liquidation requires a 14-day notice at the end of each academic semester.
              </p>
            </div>

            <div className="pool-terms-item">
              <h3 className="pool-terms-heading">6. Fees & Administrative Charges</h3>
              <p className="pool-terms-text">
                A 1% administrative maintenance fee is deducted from earned peer interest only; no upfront deposit fees are ever assessed on student deposits.
              </p>
            </div>

            <div className="pool-terms-item">
              <h3 className="pool-terms-heading">7. Risks Disclosures</h3>
              <p className="pool-terms-text">
                Returns are variable and depend on peer repayment promptness. LMONI is a campus peer prototype and does not promise fixed or insured investment yields.
              </p>
            </div>

            <div className="pool-terms-item">
              <h3 className="pool-terms-heading">8. Member Responsibilities</h3>
              <p className="pool-terms-text">
                Members agree to provide authentic student matriculation documents and notify the platform immediately of any change in academic enrollment status.
              </p>
            </div>

            <div className="pool-terms-item">
              <h3 className="pool-terms-heading">9. Privacy and Data Handling</h3>
              <p className="pool-terms-text">
                Student personal and academic verification documents are encrypted and shared only for identity confirmation and collective security purposes.
              </p>
            </div>
          </div>

          {/* Mandatory Checkbox */}
          <div className="pool-terms-agreement">
            <label className="checkbox-label checkbox-label--terms">
              <input
                type="checkbox"
                checked={hasAgreed}
                onChange={(e) => setHasAgreed(e.target.checked)}
                className="checkbox-control"
              />
              <span className="checkbox-text font-medium">
                I have read, understood and agree to the Lending Pool Terms and Conditions.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pool-terms-actions">
            <Button
              type="button"
              variant="primary-navy"
              size="lg"
              disabled={!hasAgreed}
              loading={loading}
              onClick={handleAccept}
            >
              Accept & Continue
            </Button>

            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleDecline}
            >
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
