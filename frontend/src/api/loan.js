/**
 * LMONI Borrow & Loan Service
 */
import { request, isLiveBackendConfigured } from './client.js';

export const loanService = {
  calculateRepayment(amount, months = 3, annualInterestRate = 12) {
    const principal = Number(amount) || 0;
    const interestTotal = (principal * (annualInterestRate / 100) * months) / 12;
    const totalRepayment = principal + interestTotal;
    const monthlyRepayment = months > 0 ? Math.round(totalRepayment / months) : 0;

    return {
      principal,
      annualInterestRate,
      months,
      interestTotal: Math.round(interestTotal),
      totalRepayment: Math.round(totalRepayment),
      monthlyRepayment,
    };
  },

  async checkEligibility(params) {
    const { amount, purpose, months, income = 30000, expenses = 15000, obligations = 0 } = params;

    if (isLiveBackendConfigured) {
      try {
        return await request('/loans/eligibility', {
          method: 'POST',
          body: JSON.stringify({ amount, purpose, months, income, expenses, obligations }),
        });
      } catch (err) {
        if (err.status !== 0) throw err;
      }
    }

    // Transparent Deterministic Eligibility Calculation
    await new Promise((r) => setTimeout(r, 450));
    const disposableIncome = Math.max(0, income - expenses - obligations);
    // Safe borrowing capacity: up to 50% of disposable income over requested repayment tenure
    const maxCapacity = Math.max(15000, Math.min(100000, disposableIncome * 0.5 * months));
    const requestedAmount = Number(amount) || 25000;
    const isEligible = requestedAmount <= maxCapacity * 1.25;

    const calculations = this.calculateRepayment(requestedAmount, months, 12);

    return {
      isEligible,
      requestedAmount,
      maxLimit: Math.round(maxCapacity),
      interestRate: 12,
      repaymentPeriodMonths: months,
      monthlyRepayment: calculations.monthlyRepayment,
      totalRepayment: calculations.totalRepayment,
      disclaimer: 'Preliminary eligibility assessment based on entered student profile. Not a guaranteed lending commitment.',
      isDemo: true,
    };
  },

  async submitApplication(applicationData) {
    if (isLiveBackendConfigured) {
      try {
        return await request('/loans/apply', {
          method: 'POST',
          body: JSON.stringify(applicationData),
        });
      } catch (err) {
        if (err.status !== 0) throw err;
      }
    }

    await new Promise((r) => setTimeout(r, 600));
    return {
      success: true,
      reference: `LN-NIG-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Under Review',
      submittedAt: new Date().toISOString(),
      amount: applicationData.amount,
      period: applicationData.period,
      monthlyRepayment: applicationData.monthlyRepayment,
      isDemo: true,
    };
  },
};
