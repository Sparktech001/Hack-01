import React, { useState } from 'react';
import { useRouter } from '../../router/Router.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { calculateCreditReadiness } from '../../api/aiAssessment.js';
import { Header } from '../common/Header.jsx';
import { CircularScore } from '../common/CircularScore.jsx';
import { Button } from '../common/Button.jsx';

export function Screen18_AICheckScore() {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const [showTips, setShowTips] = useState(false);

  // Deterministic scoring calculation
  const assessment = calculateCreditReadiness(user || {
    monthlyIncome: 45000,
    monthlyExpenses: 22000,
    existingObligations: 0,
    isVerified: true,
    institution: 'University of Lagos',
    studentId: '25/ENG/1517',
  });

  const { score = 72, category = 'Good', categoryDescription, factors = {}, tips = [] } = assessment;

  return (
    <div className="screen screen--ai-score">
      <Header title="Your Credit Readiness" showBack onBack={() => navigate('/ai-check')} />

      <div className="ai-score-card">
        {/* Large Circular Gauge matching Screen 18 */}
        <div className="score-hero">
          <CircularScore score={score} size={140} strokeWidth={12} />
          <div className="score-hero__category">{category}</div>
          <p className="score-hero__desc">
            {categoryDescription || "You're in good position for a campus pool loan."}
          </p>
        </div>

        {/* Key Factors Progress Bars */}
        <div className="key-factors-section">
          <div className="key-factors-header">
            <h3 className="key-factors-title">Key Factors</h3>
            <span className="key-factors-badge">Explainable Demo Model</span>
          </div>

          <div className="factor-bar-list">
            <div className="factor-bar-item">
              <div className="factor-bar-meta">
                <span className="factor-bar-label">Repayment Promptness</span>
                <span className="factor-bar-val">{factors.repaymentPromptness || 85}%</span>
              </div>
              <div className="factor-bar-track">
                <div
                  className="factor-bar-fill factor-bar-fill--green"
                  style={{ width: `${factors.repaymentPromptness || 85}%` }}
                />
              </div>
            </div>

            <div className="factor-bar-item">
              <div className="factor-bar-meta">
                <span className="factor-bar-label">Income Stability</span>
                <span className="factor-bar-val">{factors.incomeStability || 70}%</span>
              </div>
              <div className="factor-bar-track">
                <div
                  className="factor-bar-fill factor-bar-fill--blue"
                  style={{ width: `${factors.incomeStability || 70}%` }}
                />
              </div>
            </div>

            <div className="factor-bar-item">
              <div className="factor-bar-meta">
                <span className="factor-bar-label">Expense Management</span>
                <span className="factor-bar-val">{factors.expenseManagement || 75}%</span>
              </div>
              <div className="factor-bar-track">
                <div
                  className="factor-bar-fill factor-bar-fill--amber"
                  style={{ width: `${factors.expenseManagement || 75}%` }}
                />
              </div>
            </div>

            <div className="factor-bar-item">
              <div className="factor-bar-meta">
                <span className="factor-bar-label">Financial Profile</span>
                <span className="factor-bar-val">{factors.financialProfile || 78}%</span>
              </div>
              <div className="factor-bar-track">
                <div
                  className="factor-bar-fill factor-bar-fill--green"
                  style={{ width: `${factors.financialProfile || 78}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="score-actions mt-4">
          <Button
            variant="primary-navy"
            size="lg"
            onClick={() => setShowTips((prev) => !prev)}
          >
            {showTips ? 'Hide Improvement Tips' : 'See Improvement Tips'}
          </Button>
        </div>

        {/* Improvement Tips Accordion */}
        {showTips && (
          <div className="improvement-tips-card mt-3">
            <h4 className="tips-card-title">Personalized Improvement Tips</h4>
            <ul className="tips-list">
              {tips.map((tip, idx) => (
                <li key={idx} className="tip-item">
                  <span className="tip-bullet">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="demo-disclaimer-box mt-3">
          <small>
            Deterministic heuristic assessment based on student onboarding data. Not an external credit bureau report.
          </small>
        </div>
      </div>
    </div>
  );
}
