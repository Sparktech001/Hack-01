import React, { useState } from 'react';
import { Header } from '../common/Header.jsx';
import { Button } from '../common/Button.jsx';

export function Screen26_ExpandableTerms() {

  // Track open accordion indexes (default section 1 open)
  const [openSections, setOpenSections] = useState({ 0: true });

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const sections = [
    {
      title: '1. Contributions',
      content:
        'Members contribute a minimum of ₦2,000 per academic session. Contributions form the collective liquidity pool used exclusively to disburse peer micro-loans to verified university students.',
    },
    {
      title: '2. Loan Terms',
      content:
        'Loan amounts range from ₦5,000 to ₦100,000 based on verified student standing and disposable income ratio. Repayment tenures are scheduled across 1 to 6 monthly installments due on the 28th of each calendar month.',
    },
    {
      title: '3. Interest or Charges',
      content:
        'A transparent peer interest rate of 12% to 14% p.a. is assessed on disbursed principal. 100% of collected peer interest is returned pro-rata to student contributors minus a 1% platform custodial maintenance fee.',
    },
    {
      title: '4. Risks & Responsibilities',
      content:
        'All members agree to provide authentic student credentials. Peer lending carries inherent credit default risk. A 5% platform campus reserve is maintained, but capital returns are not guaranteed or insured by NDIC.',
    },
    {
      title: '5. Privacy & Data Handling',
      content:
        'Personal, academic, and financial information collected during onboarding is encrypted in transit and at rest. We never sell student data or disclose matriculation records to unauthorized third parties.',
    },
  ];

  return (
    <div className="screen screen--terms">
      <Header title="Terms & Conditions" showBack onBack={() => window.history.back()} />

      <div className="terms-card">
        <div className="terms-header">
          <h2 className="terms-subtitle">Campus Collective Lending Charter</h2>
          <p className="terms-caption">
            Comprehensive operational guidelines and risk disclosures governing student participation.
          </p>
        </div>

        <div className="terms-accordion-list">
          {sections.map((sec, idx) => {
            const isOpen = Boolean(openSections[idx]);
            return (
              <div key={idx} className="terms-accordion-item">
                <button
                  type="button"
                  className="terms-accordion-trigger"
                  onClick={() => toggleSection(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="terms-accordion-heading">{sec.title}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="terms-accordion-content">
                    <p>{sec.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="terms-footer mt-4">
          <Button
            variant="primary-navy"
            size="md"
            onClick={() => window.history.back()}
          >
            I Understand
          </Button>
        </div>
      </div>
    </div>
  );
}
