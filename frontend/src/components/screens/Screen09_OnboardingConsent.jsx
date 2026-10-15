import React, { useState } from 'react';
import { useRouter, Link } from '../../router/Router.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Header } from '../common/Header.jsx';
import { Button } from '../common/Button.jsx';
import { OnboardingProgress } from './Screen05_OnboardingPersonal.jsx';

export function Screen09_OnboardingConsent() {
  const { navigate } = useRouter();
  const { onboardingData, updateOnboardingData, completeOnboarding } = useAuth();

  const [privacyAgreed, setPrivacyAgreed] = useState(onboardingData.privacyAgreed || false);
  const [consentAgreed, setConsentAgreed] = useState(onboardingData.consentAgreed || false);
  const [withdrawalUnderstood, setWithdrawalUnderstood] = useState(onboardingData.withdrawalUnderstood || false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComplete = async (e) => {
    e.preventDefault();
    if (!privacyAgreed || !consentAgreed || !withdrawalUnderstood) {
      setError('Please review and check all consent statements before completing onboarding.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      updateOnboardingData({ privacyAgreed, consentAgreed, withdrawalUnderstood });
      await completeOnboarding();
      navigate('/verification/success');
    } catch (err) {
      setError(err.message || 'Failed to complete onboarding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen screen--onboarding">
      <Header showBack onBack={() => navigate('/onboarding/financial-profile')} />

      <div className="onboarding-card">
        <OnboardingProgress currentStep={5} totalSteps={6} label="Consent & Privacy" />

        <div className="onboarding-header">
          <h1 className="onboarding-title">Consent & Privacy</h1>
          <p className="onboarding-subtitle">
            We need your consent to protect your information and help you access LMONI services.
          </p>
        </div>

        {error && (
          <div className="alert-box alert-box--error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleComplete} className="onboarding-form" noValidate>
          <div className="consent-list">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={privacyAgreed}
                onChange={(e) => setPrivacyAgreed(e.target.checked)}
                className="checkbox-control"
              />
              <span className="checkbox-text">
                I agree to the <Link to="/terms">Terms of Privacy</Link> and data handling policies.
              </span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={consentAgreed}
                onChange={(e) => setConsentAgreed(e.target.checked)}
                className="checkbox-control"
              />
              <span className="checkbox-text">
                I consent to the collection and use of my personal and financial information
                for verification and relevant LMONI services.
              </span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={withdrawalUnderstood}
                onChange={(e) => setWithdrawalUnderstood(e.target.checked)}
                className="checkbox-control"
              />
              <span className="checkbox-text">
                I understand that I can withdraw my consent at any time via Profile Settings.
              </span>
            </label>
          </div>

          <div className="onboarding-actions">
            <Button
              type="submit"
              variant="primary-navy"
              size="lg"
              loading={loading}
              disabled={!privacyAgreed || !consentAgreed || !withdrawalUnderstood}
            >
              Complete Onboarding
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => navigate('/onboarding/financial-profile')}
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
