/**
 * LMONI Collective Lending Pool Service
 */
import { request, isLiveBackendConfigured } from './client.js';

const POOL_TERMS_VERSION = '2025.1.0-demo';

export const poolService = {
  getTermsVersion() {
    return POOL_TERMS_VERSION;
  },

  async getPoolOverview() {
    if (isLiveBackendConfigured) {
      try {
        return await request('/pool/overview');
      } catch (err) {
        if (err.status !== 0) throw err;
      }
    }

    // Demo Statistics (explicitly labelled as demo data)
    return {
      totalPoolValue: 4550000,
      growthRate: '+12% this month',
      totalContributors: 342,
      activeBorrowers: 298,
      userContribution: 12000,
      isDemo: true,
      lastUpdated: new Date().toISOString(),
    };
  },

  async getPoolStatistics() {
    if (isLiveBackendConfigured) {
      try {
        return await request('/pool/statistics');
      } catch (err) {
        if (err.status !== 0) throw err;
      }
    }

    return {
      totalPoolStatistics: 8450000,
      growthRate: '+12% this month',
      monthlyTrend: [
        { month: 'Jan', value: 4200000 },
        { month: 'Feb', value: 5100000 },
        { month: 'Mar', value: 6400000 },
        { month: 'Apr', value: 7300000 },
        { month: 'May', value: 8450000 },
      ],
      performance: {
        onTimeRepaymentRate: 90,
        defaultRate: 2.4,
        interestRateAnnual: 14,
      },
      members: [
        { id: 1, name: 'Chinedu O.', campus: 'UNILAG', role: 'Contributor', amount: 15000 },
        { id: 2, name: 'Amina B.', campus: 'OAU', role: 'Contributor', amount: 20000 },
        { id: 3, name: 'Tunde W.', campus: 'UI', role: 'Contributor', amount: 10000 },
        { id: 4, name: 'Fatima Z.', campus: 'FUTA', role: 'Borrower', amount: 25000 },
      ],
      isDemo: true,
    };
  },

  async acceptPoolTerms(userId) {
    const acceptanceRecord = {
      userId,
      version: POOL_TERMS_VERSION,
      acceptedAt: new Date().toISOString(),
      agreed: true,
    };

    if (isLiveBackendConfigured) {
      try {
        return await request('/pool/terms/accept', {
          method: 'POST',
          body: JSON.stringify(acceptanceRecord),
        });
      } catch (err) {
        if (err.status !== 0) throw err;
      }
    }

    // Store in localStorage for client persistence during demo session
    localStorage.setItem('lmoni_pool_terms_accepted', JSON.stringify(acceptanceRecord));
    return {
      success: true,
      data: acceptanceRecord,
      isDemo: true,
    };
  },

  checkLocalTermsAcceptance() {
    try {
      const record = localStorage.getItem('lmoni_pool_terms_accepted');
      if (!record) return false;
      const parsed = JSON.parse(record);
      return parsed.version === POOL_TERMS_VERSION && parsed.agreed === true;
    } catch {
      return false;
    }
  },

  clearTermsAcceptance() {
    localStorage.removeItem('lmoni_pool_terms_accepted');
  },
};
