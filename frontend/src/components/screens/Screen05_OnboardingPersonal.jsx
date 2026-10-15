import React, { useState } from 'react';
import { useRouter } from '../../router/Router.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Header } from '../common/Header.jsx';
import { Input } from '../common/Input.jsx';
import { Select } from '../common/Select.jsx';
import { Button } from '../common/Button.jsx';

export function OnboardingProgress({ currentStep = 1, totalSteps = 6, label = 'Student Onboarding' }) {
  return (
    <div className="onboarding-progress">
      <div className="onboarding-progress__meta">
        <span className="onboarding-progress__title">{label}</span>
        <span className="onboarding-progress__step">Step {currentStep} of {totalSteps}</span>
      </div>
      <div className="onboarding-progress__dots">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div
            key={idx}
            className={`onboarding-progress__dot ${
              idx + 1 === currentStep
                ? 'onboarding-progress__dot--active'
                : idx + 1 < currentStep
                ? 'onboarding-progress__dot--completed'
                : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function Screen05_OnboardingPersonal() {
  const { navigate } = useRouter();
  const { onboardingData, updateOnboardingData } = useAuth();

  const [fullName, setFullName] = useState(onboardingData.fullName || '');
  const [dob, setDob] = useState(onboardingData.dob || '');
  const [gender, setGender] = useState(onboardingData.gender || 'Male');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!dob) errs.dob = 'Date of birth is required';
    if (!gender) errs.gender = 'Gender is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!validate()) return;

    updateOnboardingData({ fullName, dob, gender });
    navigate('/onboarding/institution');
  };

  return (
    <div className="screen screen--onboarding">
      <Header showBack onBack={() => navigate('/signup')} />

      <div className="onboarding-card">
        <OnboardingProgress currentStep={1} totalSteps={6} label="Student Onboarding" />

        <div className="onboarding-header">
          <h1 className="onboarding-title">Personal information</h1>
          <p className="onboarding-subtitle">Tell us a bit about yourself.</p>
        </div>

        <form onSubmit={handleNext} className="onboarding-form" noValidate>
          <Input
            label="Full name"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Adekunle Johnson"
            error={errors.fullName}
            required
          />

          <Input
            label="Date of birth"
            type="date"
            name="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            error={errors.dob}
            required
          />

          <Select
            label="Gender"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Prefer not to say' },
            ]}
            error={errors.gender}
            required
          />

          <div className="onboarding-actions">
            <Button type="submit" variant="primary-navy" size="lg">
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
