/**
 * LMONI AI Credit Readiness Assessment Engine
 * 
 * SCORING METHODOLOGY (Deterministic Demo Model):
 * -------------------------------------------------------------
 * This utility computes an explainable student credit readiness score (0-100)
 * based strictly on verified student onboarding inputs and in-app financial ratios.
 * 
 * FACTOR WEIGHTS:
 * 1. Financial Profile Completeness & Verification (30% weight):
 *    - Valid verified institution and matriculation status: +18 pts
 *    - Full profile information provided: +12 pts
 * 
 * 2. Expense-to-Income Ratio (30% weight):
 *    - Expense ratio < 50% of income: 30 pts
 *    - Expense ratio 50% - 75%: 22 pts
 *    - Expense ratio 76% - 90%: 15 pts
 *    - Expense ratio > 90%: 5 pts
 * 
 * 3. Income Stability & Buffer (25% weight):
 *    - Monthly disposable buffer > ₦15,000: 25 pts
 *    - Monthly disposable buffer ₦5,000 - ₦15,000: 18 pts
 *    - Monthly disposable buffer < ₦5,000: 10 pts
 * 
 * 4. Repayment / Obligation Discipline (15% weight):
 *    - No existing debt obligations: 15 pts
 *    - Obligations < 20% of monthly income: 10 pts
 *    - Obligations >= 20% of monthly income: 4 pts
 * 
 * DISCLAIMER:
 * This is a transparent demo readiness heuristic. It is NOT a credit bureau score
 * and does not use an external black-box machine learning model.
 */

export function calculateCreditReadiness(profile) {
  if (!profile || typeof profile !== 'object') {
    return {
      available: false,
      reason: 'No financial profile data provided. Please complete onboarding first.',
    };
  }

  const {
    monthlyIncome = 0,
    monthlyExpenses = 0,
    existingObligations = 0,
    isVerified = false,
    institution = '',
    studentId = '',
  } = profile;

  const income = Number(monthlyIncome) || 0;
  const expenses = Number(monthlyExpenses) || 0;
  const obligations = Number(existingObligations) || 0;

  if (income <= 0) {
    return {
      available: false,
      reason: 'Monthly income or allowance is required to assess credit readiness.',
    };
  }

  // 1. Verification & Profile (30%)
  let verificationScore;
  if (isVerified && institution && studentId) {
    verificationScore = 30;
  } else if (institution || studentId) {
    verificationScore = 18;
  } else {
    verificationScore = 10;
  }

  // 2. Expense Management (30%)
  let expenseScore;
  const expenseRatio = expenses / income;
  if (expenseRatio <= 0.5) {
    expenseScore = 30;
  } else if (expenseRatio <= 0.75) {
    expenseScore = 22;
  } else if (expenseRatio <= 0.9) {
    expenseScore = 15;
  } else {
    expenseScore = 5;
  }

  // 3. Income Stability & Buffer (25%)
  let stabilityScore;
  const buffer = income - expenses - obligations;
  if (buffer >= 15000) {
    stabilityScore = 25;
  } else if (buffer >= 5000) {
    stabilityScore = 18;
  } else {
    stabilityScore = 10;
  }

  // 4. Obligations & Promptness (15%)
  let obligationScore;
  const obligationRatio = obligations / income;
  if (obligations === 0) {
    obligationScore = 15;
  } else if (obligationRatio <= 0.2) {
    obligationScore = 10;
  } else {
    obligationScore = 4;
  }

  const totalScore = Math.min(100, Math.max(0, Math.round(
    verificationScore + expenseScore + stabilityScore + obligationScore
  )));

  let category = 'Fair';
  let categoryDescription = 'Moderate readiness. Keeping expenses in check will improve eligibility.';

  if (totalScore >= 80) {
    category = 'Excellent';
    categoryDescription = 'Exceptional readiness. You qualify for prime peer-lending rates.';
  } else if (totalScore >= 65) {
    category = 'Good';
    categoryDescription = "You're in a good position for a campus pool loan.";
  } else if (totalScore < 50) {
    category = 'Needs Attention';
    categoryDescription = 'Consider reducing non-essential expenses to build a stronger financial buffer.';
  }

  // Normalized Factor percentages (0-100% for progress bars)
  const factors = {
    repaymentPromptness: Math.round((obligationScore / 15) * 100),
    incomeStability: Math.round((stabilityScore / 25) * 100),
    expenseManagement: Math.round((expenseScore / 30) * 100),
    financialProfile: Math.round((verificationScore / 30) * 100),
  };

  const tips = [
    'Save at least 15% of your monthly allowance before allocating discretionary spending.',
    'Always repay pool loans 2 days before the due date to unlock higher future limits.',
    'Keep your student identification documents updated each academic session.',
  ];

  return {
    available: true,
    score: totalScore,
    category,
    categoryDescription,
    factors,
    tips,
    isDemo: true,
    evaluatedAt: new Date().toISOString(),
  };
}
