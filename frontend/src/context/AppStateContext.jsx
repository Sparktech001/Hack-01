import React, { createContext, useContext, useState } from 'react';
import { poolService } from '../api/pool.js';
import { transactionService } from '../api/transactions.js';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [balance, setBalance] = useState(45000);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [poolAccepted, setPoolAccepted] = useState(() => {
    return poolService.checkLocalTermsAcceptance();
  });
  const [poolContribution, setPoolContribution] = useState(12000);
  const [activeLoans, setActiveLoans] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(1);

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden((prev) => !prev);
  };

  const acceptPoolTerms = async (userId) => {
    const res = await poolService.acceptPoolTerms(userId || 'usr_adekunle_01');
    setPoolAccepted(true);
    return res;
  };

  const declinePoolTerms = () => {
    poolService.clearTermsAcceptance();
    setPoolAccepted(false);
  };

  const addLoanApplication = (loan) => {
    setActiveLoans((prev) => [loan, ...prev]);
  };

  const addContribution = async (amount) => {
    const num = Number(amount) || 0;
    if (num <= 0) return;
    setBalance((prev) => Math.max(0, prev - num));
    setPoolContribution((prev) => prev + num);
    await transactionService.addTransaction({
      title: 'Pool Contribution',
      category: 'pool',
      type: 'expense',
      amount: num,
    });
  };

  const addFunds = async (amount) => {
    const num = Number(amount) || 0;
    if (num <= 0) return;
    setBalance((prev) => prev + num);
    await transactionService.addTransaction({
      title: 'Wallet Deposit (Demo)',
      category: 'allowance',
      type: 'income',
      amount: num,
    });
  };

  return (
    <AppStateContext.Provider
      value={{
        balance,
        isBalanceHidden,
        toggleBalanceVisibility,
        poolAccepted,
        acceptPoolTerms,
        declinePoolTerms,
        poolContribution,
        activeLoans,
        addLoanApplication,
        addContribution,
        addFunds,
        unreadNotificationsCount,
        setUnreadNotificationsCount,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
