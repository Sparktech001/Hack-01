import React, { useState } from 'react';
import { useRouter } from '../../router/Router.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Header } from '../common/Header.jsx';
import { Input } from '../common/Input.jsx';
import { Button } from '../common/Button.jsx';
import { OnboardingProgress } from './Screen05_OnboardingPersonal.jsx';

export function Screen08_OnboardingFinancial() {
  const { navigate } = useRouter();
  const { onboardingData, updateOnboardingData } = useAuth();

  const [monthlyIncome, setMonthlyIncome] = useState(
    onboardingData.monthlyIncome !== undefined ? String(onboardingData.monthlyIncome) : '45000'
  );
  const [monthlyExpenses, setMonthlyExpenses] = useState(
    onboardingData.monthlyExpenses !== undefined ? String(onboardingData.monthlyExpenses) : '22000'
  );
  const [existingObligations, setExistingObligations] = useState(
    onboardingData.existingObligations !== undefined ? String(onboardingData.existingObligations) : '0'
  );
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    const incomeNum = Number(monthlyIncome);
    const expensesNum = Number(monthlyExpenses);
    const obligationsNum = Number(existingObligations);

    if (isNaN(incomeNum) || incomeNum <= 0) {
      errs.monthlyIncome = 'Enter a valid monthly income or allowance (greater than 0)';
    }
    if (isNaN(expensesNum) || expensesNum < 0) {
      errs.monthlyExpenses = 'Enter valid typical monthly expenses (0 or greater)';
    }
    if (isNaN(obligationsNum) || obligationsNum < 0) {
      errs.existingObligations = 'Enter valid existing obligations (0 or greater)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!validate()) return;

    updateOnboardingData({
      monthlyIncome: Number(monthlyIncome),
      monthlyExpenses: Number(monthlyExpenses),
      existingObligations: Number(existingObligations),
    });
    navigate('/onboarding/consent');
  };

  return (
    <div className="screen screen--onboarding">
      <Header showBack onBack={() => navigate('/onboarding/verification')} />

      <div className="onboarding-card">
        <OnboardingProgress currentStep={4} totalSteps={6} label="Financial Profile" />

        <div className="onboarding-header">
          <h1 className="onboarding-title">Financial Profile</h1>
          <p className="onboarding-subtitle">
            Help us understand your financial situation to calculate fair credit limits.
          </p>
        </div>

        <form onSubmit={handleNext} className="onboarding-form" noValidate>
          <Input
            label="Monthly monthly / allowance"
            name="monthlyIncome"
            type="number"
            min="0"
            prefix="₦"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            placeholder="e.g. 45,000"
            error={errors.monthlyIncome}
            helperText="Include parental stipends, part-time wages or campus earnings"
            required
          />

          <Input
            label="Typical monthly payment / expenses"
            name="monthlyExpenses"
            type="number"
            min="0"
            prefix="₦"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(e.target.value)}
            placeholder="e.g. 20,000"
            error={errors.monthlyExpenses}
            helperText="Food, books, mobile data, campus transport"
            required
          />

          <Input
            label="Existing financial obligations"
            name="existingObligations"
            type="number"
            min="0"
            prefix="₦"
            value={existingObligations}
            onChange={(e) => setExistingObligations(e.target.value)}
            placeholder="e.g. 0"
            error={errors.existingObligations}
            helperText="Outstanding repayments or pending borrowings"
            required
          />

          <div className="onboarding-actions">
            <Button type="submit" variant="primary-navy" size="lg">
              Next
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => navigate('/onboarding/verification')}
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
