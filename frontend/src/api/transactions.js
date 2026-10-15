/**
 * LMONI Transactions Service
 */
import { request, isLiveBackendConfigured } from './client.js';

const INITIAL_TRANSACTIONS = [
  {
    id: 'tx_1',
    title: 'Food & Groceries',
    category: 'food',
    type: 'expense',
    amount: 12300,
    date: 'Apr 24, 2025 • 12:04 AM',
    timestamp: '2025-04-24T00:04:00Z',
    status: 'Completed',
    isDemo: true,
  },
  {
    id: 'tx_2',
    title: 'Pool Loan Repayment',
    category: 'loan',
    type: 'income',
    amount: 2550,
    date: 'Apr 23, 2025 • 03:42 AM',
    timestamp: '2025-04-23T03:42:00Z',
    status: 'Completed',
    isDemo: true,
  },
  {
    id: 'tx_3',
    title: 'Campus Transport',
    category: 'transport',
    type: 'expense',
    amount: 3500,
    date: 'Apr 23, 2025 • 01:30 AM',
    timestamp: '2025-04-23T01:30:00Z',
    status: 'Completed',
    isDemo: true,
  },
  {
    id: 'tx_4',
    title: 'Course Software License',
    category: 'education',
    type: 'expense',
    amount: 5500,
    date: 'Apr 22, 2025 • 11:30 AM',
    timestamp: '2025-04-22T11:30:00Z',
    status: 'Completed',
    isDemo: true,
  },
  {
    id: 'tx_5',
    title: 'Books & Stationery',
    category: 'education',
    type: 'expense',
    amount: 1300,
    date: 'Apr 22, 2025 • 02:18 AM',
    timestamp: '2025-04-22T02:18:00Z',
    status: 'Completed',
    isDemo: true,
  },
  {
    id: 'tx_6',
    title: 'Monthly Allowance Credit',
    category: 'allowance',
    type: 'income',
    amount: 15000,
    date: 'Apr 21, 2025 • 12:56 AM',
    timestamp: '2025-04-21T00:56:00Z',
    status: 'Completed',
    isDemo: true,
  },
];

export const transactionService = {
  async getTransactions(filter = 'all') {
    if (isLiveBackendConfigured) {
      try {
        return await request(`/transactions?filter=${filter}`);
      } catch (err) {
        if (err.status !== 0) throw err;
      }
    }

    const stored = localStorage.getItem('lmoni_transactions');
    const list = stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS;

    if (filter === 'income') {
      return list.filter((t) => t.type === 'income');
    }
    if (filter === 'expenses') {
      return list.filter((t) => t.type === 'expense');
    }
    return list;
  },

  async addTransaction(newTx) {
    const stored = localStorage.getItem('lmoni_transactions');
    const list = stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS;
    const tx = {
      id: `tx_${Date.now()}`,
      ...newTx,
      date: 'Just now',
      timestamp: new Date().toISOString(),
      isDemo: true,
    };
    list.unshift(tx);
    localStorage.setItem('lmoni_transactions', JSON.stringify(list));
    return tx;
  },
};
