import React, { useState, useEffect } from 'react';
import { useRouter } from '../../router/Router.jsx';
import { transactionService } from '../../api/transactions.js';
import { Header } from '../common/Header.jsx';
import { Button } from '../common/Button.jsx';
import { Modal } from '../common/Modal.jsx';
import { Input } from '../common/Input.jsx';
import { Select } from '../common/Select.jsx';

export function Screen19_Transactions() {
  const { navigate } = useRouter();

  const [filter, setFilter] = useState('all'); // 'all' | 'income' | 'expenses'
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('Campus Cafe Lunch');
  const [newAmount, setNewAmount] = useState('1500');
  const [newType, setNewType] = useState('expense');

  useEffect(() => {
    let isMounted = true;
    transactionService.getTransactions(filter).then((data) => {
      if (isMounted) {
        setTransactions(data);
        setLoading(false);
      }
    }).catch((err) => {
      console.error(err);
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [filter]);

  const loadTransactions = async (activeFilter) => {
    setLoading(true);
    try {
      const data = await transactionService.getTransactions(activeFilter);
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    const num = Number(newAmount);
    if (!num) return;
    await transactionService.addTransaction({
      title: newTitle,
      type: newType,
      amount: num,
      category: newType === 'income' ? 'allowance' : 'food',
    });
    setShowAddModal(false);
    loadTransactions(filter);
  };

  const getCategoryIcon = (category, type) => {
    if (type === 'income') {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28785c" strokeWidth="2.2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      );
    }
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d33838" strokeWidth="2.2">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
        <polyline points="17 18 23 18 23 12" />
      </svg>
    );
  };

  return (
    <div className="screen screen--transactions">
      <Header
        title="Transaction History"
        showBack
        onBack={() => navigate('/home')}
        rightAction={
          <button
            type="button"
            className="tx-add-btn"
            onClick={() => setShowAddModal(true)}
            aria-label="Add demo transaction"
          >
            +
          </button>
        }
      />

      <div className="transactions-card">
        {/* Filter Chips */}
        <div className="tx-filter-chips">
          <button
            type="button"
            className={`tx-chip ${filter === 'all' ? 'tx-chip--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`tx-chip ${filter === 'income' ? 'tx-chip--active' : ''}`}
            onClick={() => setFilter('income')}
          >
            Income
          </button>
          <button
            type="button"
            className={`tx-chip ${filter === 'expenses' ? 'tx-chip--active' : ''}`}
            onClick={() => setFilter('expenses')}
          >
            Expenses
          </button>
        </div>

        {/* Transaction List */}
        {loading ? (
          <div className="tx-loading">
            <span className="btn__spinner" />
            <p className="text-secondary text-sm mt-2">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="tx-empty-state">
            <div className="tx-empty-icon">💸</div>
            <h3 className="tx-empty-title">No transactions found</h3>
            <p className="tx-empty-desc">
              You haven't recorded any {filter === 'all' ? '' : filter} transactions yet.
            </p>
          </div>
        ) : (
          <div className="tx-list">
            {transactions.map((tx) => (
              <div key={tx.id} className="tx-item">
                <div className={`tx-icon tx-icon--${tx.type}`}>
                  {getCategoryIcon(tx.category, tx.type)}
                </div>

                <div className="tx-info">
                  <div className="tx-title">{tx.title}</div>
                  <div className="tx-date">{tx.date}</div>
                </div>

                <div className={`tx-amount ${tx.type === 'income' ? 'tx-amount--income' : 'tx-amount--expense'}`}>
                  {tx.type === 'income' ? '+ ' : '- '}₦{Number(tx.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="demo-disclaimer-box mt-4">
          <small>Simulated student transaction ledger for prototype testing.</small>
        </div>
      </div>

      {/* Add Demo Transaction Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Demo Transaction"
      >
        <Input
          label="Description"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <Input
          label="Amount"
          type="number"
          prefix="₦"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
        />
        <Select
          label="Type"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          options={[
            { value: 'expense', label: 'Expense (-)' },
            { value: 'income', label: 'Income (+)' },
          ]}
        />
        <div className="mt-4">
          <Button variant="primary-navy" onClick={handleAddTransaction}>
            Record Transaction
          </Button>
        </div>
      </Modal>
    </div>
  );
}
