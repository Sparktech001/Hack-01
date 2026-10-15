import React, { useState } from 'react';
import { useRouter } from '../../router/Router.jsx';
import { Header } from '../common/Header.jsx';
import { Input } from '../common/Input.jsx';
import { Select } from '../common/Select.jsx';
import { Button } from '../common/Button.jsx';

export function Screen14_BorrowApply() {
  const { navigate } = useRouter();

  const [amount, setAmount] = useState('25000');
  const [purpose, setPurpose] = useState('Books & Gadgets');
  const [periodMonths, setPeriodMonths] = useState('3');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedChips = [
    { label: '₦ 5k', value: '5000' },
    { label: '₦ 10k', value: '10000' },
    { label: '₦ 25k', value: '25000' },
    { label: '₦ 50k', value: '50000' },
  ];

  const handleCheckEligibility = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num < 5000 || num > 100000) {
      setError('Please select an amount between ₦5,000 and ₦100,000');
      return;
    }
    if (!purpose) {
      setError('Please select a loan purpose');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/borrow/eligibility', {
        amount: num,
        purpose,
        periodMonths: Number(periodMonths),
      });
    }, 350);
  };

  return (
    <div className="screen screen--borrow">
      <Header title="Apply for a Loan" showBack={false} />

      <div className="borrow-card">
        <div className="borrow-header">
          <p className="borrow-subtitle">
            Get funds from the collective pool when you need it most.
          </p>
        </div>

        {error && (
          <div className="alert-box alert-box--error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleCheckEligibility} className="borrow-form" noValidate>
          <div className="loan-amount-section">
            <div className="loan-amount-header">
              <label htmlFor="loanAmount" className="loan-amount-label">
                Loan Amount
              </label>
              <span className="loan-amount-range">₦ 10,000 – ₦ 100,000</span>
            </div>

            <Input
              name="loanAmount"
              type="number"
              prefix="₦"
              min="5000"
              max="100000"
              value={amount}
              onChange={(e) => {
                setError('');
                setAmount(e.target.value);
              }}
              placeholder="Enter amount"
              required
            />

            {/* Suggested Chips */}
            <div className="suggested-chips-row">
              {suggestedChips.map((chip) => (
                <button
                  key={chip.value}
                  type="button"
                  className={`chip-btn ${amount === chip.value ? 'chip-btn--active' : ''}`}
                  onClick={() => {
                    setError('');
                    setAmount(chip.value);
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <Select
            label="Purpose"
            name="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            options={[
              'School fees & registration',
              'Accommodation & Hostel dues',
              'Books & Gadgets',
              'Project / Final Year Research',
              'Personal / Medical Emergency',
            ]}
            required
          />

          <Select
            label="Expected Repayment Period"
            name="periodMonths"
            value={periodMonths}
            onChange={(e) => setPeriodMonths(e.target.value)}
            options={[
              { value: '1', label: '1 month' },
              { value: '2', label: '2 months' },
              { value: '3', label: '3 months' },
              { value: '6', label: '6 months' },
            ]}
            required
          />

          <div className="borrow-actions">
            <Button
              type="submit"
              variant="primary-navy"
              size="lg"
              loading={loading}
            >
              Check Eligibility
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
