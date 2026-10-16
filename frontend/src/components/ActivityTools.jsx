import { useCallback, useEffect, useState } from 'react';

function Records({ title, rows }) {
  if (!rows?.length) return <div className="empty-state"><p>No {title.toLowerCase()} on this page yet.</p></div>;
  return <div className="record-list">{rows.map((row, index) => <article className="record" key={row.id || `${title}-${index}`}><strong>{row.type || title}</strong><div className="record-fields">{Object.entries(row).map(([key, value]) => <div className="record-field" key={key}><span>{key.replace(/([a-z])([A-Z])/g,'$1 $2')}</span><b>{value == null ? '—' : typeof value === 'object' ? JSON.stringify(value) : String(value)}</b></div>)}</div></article>)}</div>;
}

export function ActivityTools({ api, canLend }) {
  const [filters, setFilters] = useState({ from: '', to: '', type: '', pageSize: '20' });
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [returns, setReturns] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (pageNumber, activeFilters) => {
    setBusy(true); setError('');
    const query = new URLSearchParams({ page: String(pageNumber), pageSize: activeFilters.pageSize });
    if (activeFilters.from) query.set('from', `${activeFilters.from}T00:00:00Z`);
    if (activeFilters.to) query.set('to', `${activeFilters.to}T23:59:59Z`);
    if (activeFilters.type.trim()) query.set('type', activeFilters.type.trim());
    const jobs = [api(`/api/transactions?${query.toString()}`)];
    if (canLend) jobs.push(api('/api/lender/returns'));
    const results = await Promise.allSettled(jobs);
    if (results[0].status === 'fulfilled') setTransactions(Array.isArray(results[0].value) ? results[0].value : []);
    else setError(results[0].reason?.message || 'Could not load transactions.');
    if (canLend && results[1].status === 'fulfilled') setReturns(results[1].value);
    else if (canLend && results[1].status === 'rejected') setError((current) => [current, results[1].reason?.message].filter(Boolean).join(' '));
    setPage(pageNumber); setBusy(false);
  }, [api, canLend]);

  useEffect(() => { load(1, { from: '', to: '', type: '', pageSize: '20' }); }, [load]);
  return <div className="activity-tools">
    <section className="backend-panel"><div className="section-title"><div><p className="eyebrow">LEDGER</p><h2>Transaction history</h2><p className="muted small">Filter the simulated platform ledger. BMONI activity is shown separately in the BMONI sandbox.</p></div><button type="button" className="button outline" onClick={() => load(page, filters)} disabled={busy}>{busy ? 'Loading…' : 'Refresh'}</button></div>
      <form className="backend-grid activity-filters" onSubmit={(event) => { event.preventDefault(); load(1, filters); }}>
        <label className="backend-field">From date<input type="date" value={filters.from} onChange={(event) => setFilters({ ...filters, from: event.target.value })} /></label>
        <label className="backend-field">To date<input type="date" value={filters.to} onChange={(event) => setFilters({ ...filters, to: event.target.value })} /></label>
        <label className="backend-field">Transaction type<input value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })} placeholder="For example, SandboxDeposit" /></label>
        <label className="backend-field">Rows per page<select value={filters.pageSize} onChange={(event) => setFilters({ ...filters, pageSize: event.target.value })}><option value="10">10</option><option value="20">20</option><option value="50">50</option><option value="100">100</option></select></label>
        <div className="activity-filter-actions"><button className="button primary" disabled={busy}>Apply filters</button><button type="button" className="button outline" onClick={() => { const reset = { from: '', to: '', type: '', pageSize: '20' }; setFilters(reset); load(1, reset); }}>Clear filters</button></div>
      </form>
      {error && <p className="message error" role="alert">{error}<button type="button" className="button outline" onClick={() => load(page, filters)}>Retry</button></p>}
      {busy ? <div className="skeleton-list" aria-label="Loading transactions"><div /><div /></div> : <Records title="Transactions" rows={transactions} />}
      <div className="pagination-controls"><button className="button outline" disabled={busy || page <= 1} onClick={() => load(page - 1, filters)}>Previous</button><span>Page {page}</span><button className="button outline" disabled={busy || transactions.length < Number(filters.pageSize)} onClick={() => load(page + 1, filters)}>Next</button></div>
    </section>
    {canLend && <section className="backend-panel"><div className="section-title"><div><p className="eyebrow">LENDER VIEW</p><h2>Returns</h2></div></div>{returns ? <Records title="Lender returns" rows={[returns]} /> : <p className="muted">Lender return summary is not available yet.</p>}</section>}
  </div>;
}
