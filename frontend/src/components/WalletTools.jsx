import { useState } from 'react';

export function WalletTools({ api, onDataChanged }) {
  const [depositAmount, setDepositAmount] = useState('');
  const [spendAmount, setSpendAmount] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  async function act(event, type) {
    event.preventDefault(); setBusy(type); setError(''); setResult(null);
    try {
      const response = await api(type === 'deposit' ? '/api/wallet/deposit' : '/api/wallet/spends', {
        method: 'POST', body: type === 'deposit' ? { amount: Number(depositAmount) } : { amount: Number(spendAmount), description }, idempotencyKey: crypto.randomUUID(),
      });
      setResult(response); if (type === 'deposit') setDepositAmount(''); else { setSpendAmount(''); setDescription(''); } onDataChanged?.();
    } catch (err) { setError(err.message); }
    finally { setBusy(''); }
  }

  return <section className="backend-panel wallet-tools"><div className="section-title"><div><p className="eyebrow">SIMULATED WALLET</p><h2>Manage your wallet</h2><p className="muted small">Deposits are sandbox credits. A spend creates a pending approval; it is not debited until confirmed.</p></div></div>
    {error && <p className="message error" role="alert">{error}</p>}
    <div className="backend-two-col">
      <form className="form backend-form" onSubmit={(event) => act(event, 'deposit')}><h3>Add simulated funds</h3><label className="backend-field">Amount (NGN)<input type="number" min="0.01" step="0.01" required value={depositAmount} onChange={(event) => setDepositAmount(event.target.value)} /></label><button className="button primary" disabled={!!busy}>{busy === 'deposit' ? 'Adding funds…' : 'Add funds'}</button></form>
      <form className="form backend-form" onSubmit={(event) => act(event, 'spend')}><h3>Request a spend</h3><label className="backend-field">Amount (NGN)<input type="number" min="0.01" step="0.01" required value={spendAmount} onChange={(event) => setSpendAmount(event.target.value)} /></label><label className="backend-field">What is this for?<input maxLength="180" required value={description} onChange={(event) => setDescription(event.target.value)} /></label><button className="button outline" disabled={!!busy}>{busy === 'spend' ? 'Creating approval…' : 'Request spend approval'}</button></form>
    </div>
    {result && <div className="activity-result" role="status"><h3>API response</h3><pre>{JSON.stringify(result, null, 2)}</pre><p className="muted small">Pending requests can be reviewed in Approvals.</p></div>}
  </section>;
}
