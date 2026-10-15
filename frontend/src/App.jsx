import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

const ROUTES = {
  Overview: ['/api/dashboard', '/api/wallet', '/api/score', '/api/transactions', '/api/approvals/pending'],
  Loans: ['/api/loans'],
  Marketplace: ['/api/loans?role=open', '/api/lender/returns'],
  Activity: ['/api/transactions', '/api/wallet'],
  Approvals: ['/api/approvals/pending'],
  Advisory: [],
  'BMONI sandbox': ['/api/bmoni/balances', '/api/bmoni/transactions'],
};

function apiRoot() {
  return (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '').replace(/\/api$/i, '');
}

async function api(path, { method = 'GET', body, formData, idempotencyKey } = {}) {
  const root = apiRoot();
  if (!root) throw new Error('Set VITE_API_BASE_URL to connect to the B Moni API. No demo data is being shown.');
  const token = localStorage.getItem('bmoni_token');
  const headers = new Headers();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (body && !formData) headers.set('Content-Type', 'application/json');
  if (idempotencyKey) headers.set('Idempotency-Key', idempotencyKey);
  let response;
  try {
    response = await fetch(`${root}${path}`, {
      method,
      headers,
      body: formData || (body ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new Error('Could not reach the B Moni API. Check the API URL and your connection, then retry.');
  }
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('json') ? await response.json().catch(() => null) : await response.text().catch(() => '');
  if (response.status === 401) {
    localStorage.removeItem('bmoni_token');
    localStorage.removeItem('bmoni_user');
    window.dispatchEvent(new Event('bmoni:logout'));
  }
  if (!response.ok) {
    const message = typeof data === 'object' && data ? data.message || data.detail || data.title : data;
    throw new Error(message || `The request failed (${response.status}). Check the details and try again.`);
  }
  return data;
}

function safeValue(value, key = '') {
  if (value == null) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return Array.isArray(value) ? `${value.length} items` : '[details]';
  if (/amount|balance|principal|repayment|contribution|interest|returns?/i.test(key) && Number.isFinite(Number(value))) return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(Number(value));
  if (/(date|time|created|updated|dueAt|timestamp)/i.test(key) && typeof value === 'string' && !Number.isNaN(Date.parse(value))) return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  return String(value);
}

function formatLabel(key) {
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/^./, (c) => c.toUpperCase());
}

function RecordView({ data, title }) {
  if (data == null) return <Empty text="No information was returned by the API." />;
  const items = Array.isArray(data) ? data : typeof data === 'object' ? [data] : [{ result: data }];
  const filtered = items.map((row) => row && typeof row === 'object' ? Object.fromEntries(Object.entries(row).filter(([key]) => !/password|secret|token|key|credential/i.test(key))) : { result: row });
  if (!filtered.length) return <Empty text="Nothing to show yet." />;
  return <div className="record-list">{filtered.map((row, index) => <article className="record" key={row.id || row.loanId || row.transactionId || index}>
    <strong>{safeValue(row.title || row.name || row.description || row.purpose || `${title} ${index + 1}`)}</strong>
    <div className="record-fields">{Object.entries(row).filter(([key]) => !/title|name|description|purpose/i.test(key)).map(([key, value]) => <div className="record-field" key={key}><span>{formatLabel(key)}</span><b>{safeValue(value, key)}</b></div>)}</div>
    <span className="simulated-tag">{title.toLowerCase().includes('bmoni') ? 'BMONI sandbox · Simulated' : 'Peer-lending demo · Simulated'}</span>
  </article>)}</div>;
}

function Empty({ text }) { return <div className="empty-state"><span className="empty-mark" aria-hidden="true">—</span><p>{text}</p></div>; }

function usePanelData(paths, active) {
  const [state, setState] = useState({ loading: false, error: '', data: [] });
  const reload = useCallback(async () => {
    if (!active || !paths.length) return;
    setState((s) => ({ ...s, loading: true, error: '' }));
    const results = await Promise.all(paths.map(async (path) => {
      try { return { path, data: await api(path) }; }
      catch (error) { return { path, error: error.message }; }
    }));
    const errors = results.filter((result) => result.error);
    setState({ loading: false, error: errors.map((result) => `${result.path}: ${result.error}`).join(' '), data: results.filter((result) => !result.error) });
  }, [active, paths]);
  useEffect(() => { reload(); }, [reload]);
  return { ...state, reload };
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => { api('/api/bootstrap').then((data) => {
    const accounts = data?.accounts || data?.demoAccounts || [];
    setOptions(Array.isArray(accounts) ? accounts.map((account) => account.email || account.emailAddress).filter(Boolean) : []);
  }).catch(() => {}); }, []);
  async function submit(event) {
    event.preventDefault(); setError(''); setNotice(''); setBusy(true);
    try {
      const result = await api('/api/auth/login', { method: 'POST', body: { email, password } });
      const token = result?.token || result?.accessToken || result?.access_token;
      if (!token) throw new Error('The API did not return a session token. Check the login response contract.');
      localStorage.setItem('bmoni_token', token);
      const user = await api('/api/me').catch(() => result.user || null);
      if (user) localStorage.setItem('bmoni_user', JSON.stringify(user));
      onLogin(user);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <main className="login-wrap"><section className="login-card">
    <Brand /><div className="environment"><span />Demo environment</div>
    <p className="eyebrow">STUDENT FINANCE, TOGETHER</p><h1>Good to have you here.</h1><p className="muted">Sign in to manage your simulated student finance activity.</p>
    <form onSubmit={submit} className="form">
      {options.length > 0 && <label>Demo account<select value={email} onChange={(e) => setEmail(e.target.value)}><option value="">Choose an account</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>}
      <label>Email address<input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu.ng" /></label>
      <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      {error && <p className="message error" role="alert">{error}</p>}{notice && <p className="message success" role="status">{notice}</p>}
      <button className="button primary wide" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
    <p className="login-foot">This demo does not move real money. Demo credentials are provided by the connected API.</p>
  </section></main>;
}

function Brand() { return <a className="brand" href="#overview" aria-label="B Moni home"><span className="brand-symbol">b</span><span>B Moni</span></a>; }

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('bmoni_token'));
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('bmoni_user')); } catch { return null; } });
  const [active, setActive] = useState('Overview');
  const [flash, setFlash] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const nav = Object.keys(ROUTES);
  useEffect(() => { const logout = () => { setToken(null); setUser(null); }; window.addEventListener('bmoni:logout', logout); return () => window.removeEventListener('bmoni:logout', logout); }, []);
  useEffect(() => { const navigate = (event) => setActive(event.detail); window.addEventListener('bmoni:navigate', navigate); return () => window.removeEventListener('bmoni:navigate', navigate); }, []);
  if (!token) return <Login onLogin={(profile) => { setToken(localStorage.getItem('bmoni_token')); setUser(profile); setActive('Overview'); }} />;
  return <div className="app-shell">
    <aside className="sidebar"><Brand /><p className="nav-label">YOUR FINANCES</p><nav aria-label="Main navigation">{nav.map((item, index) => <button key={item} className={`nav-item ${active === item ? 'selected' : ''}`} onClick={() => setActive(item)}><span className="nav-icon">{['◫', '↗', '◎', '↔', '✓', '✳', '▦'][index]}</span>{item}</button>)}</nav><div className="sidebar-bottom"><div className="demo-note"><span className="dot" />Demo environment<p>Activity and balances shown here are simulated.</p></div><button className="nav-item logout" onClick={() => { localStorage.removeItem('bmoni_token'); localStorage.removeItem('bmoni_user'); setToken(null); setUser(null); }}>↗ <span>Sign out</span></button></div></aside>
    <main className="main-area"><header className="topbar"><div className="mobile-brand"><Brand /></div><div className="topbar-right"><span className="environment"><span />Demo environment</span><span className="avatar">{(user?.firstName || user?.name || user?.fullName || 'S').slice(0, 1).toUpperCase()}</span></div></header>
      <div className="page-content"><div className="page-heading"><div><p className="eyebrow">B MONI · STUDENT FINANCE</p><h1>{active === 'Overview' ? 'Your money, in view.' : active}</h1><p className="muted">{active === 'Overview' ? 'A clear picture of your simulated activity.' : descriptions[active]}</p></div>{active === 'Loans' && <button className="button primary" onClick={() => setPendingAction({ type: 'create-loan' })}>Request a loan <span>＋</span></button>}</div>
        {flash && <p className="message success" role="status">{flash}<button className="dismiss" onClick={() => setFlash('')} aria-label="Dismiss">×</button></p>}
        <Workspace active={active} onAction={setPendingAction} />
      </div>
    </main>
    <nav className="mobile-nav" aria-label="Main navigation">{nav.map((item) => <button key={item} className={active === item ? 'selected' : ''} onClick={() => setActive(item)}>{item}</button>)}</nav>
    {pendingAction && <ActionDialog action={pendingAction} close={() => setPendingAction(null)} done={(message) => { setPendingAction(null); setFlash(message); }} />}
  </div>;
}

const descriptions = {
  Loans: 'Track requests and repayments. Every figure comes from the connected API.',
  Marketplace: 'Explore open requests from the student community.',
  Activity: 'Review wallet activity returned by the API.',
  Approvals: 'Review the exact action and amount before confirming.',
  Advisory: 'Helpful guidance only. Advice never approves or initiates payments.',
  'BMONI sandbox': 'A separate sandbox for BMONI account activity; it is not the peer-lending ledger.',
};

function Workspace({ active, onAction }) {
  const paths = useMemo(() => ROUTES[active], [active]);
  const result = usePanelData(paths, active !== 'Advisory');
  if (active === 'Advisory') return <Advisory />;
  if (result.loading) return <div className="skeleton-list" aria-label="Loading"><div /><div /><div /></div>;
  return <>
    {result.error && <div className="message error" role="alert"><span>{result.error}</span><button className="button outline" onClick={result.reload}>Retry</button></div>}
    {active === 'Overview' && <div className="callout"><span className="callout-icon">i</span><p><strong>Simulated activity</strong><br />Balances, transactions, loans and repayments are demo records. They do not represent real cash.</p></div>}
    {active === 'Approvals' && <p className="disclosure">Confirm or reject only after reviewing the amount, action and recipient returned for each approval.</p>}
    {active === 'BMONI sandbox' && <p className="disclosure">Sandbox activity is separate from the simulated peer-lending ledger. Never enter a real BVN or upload real identity documents in this demo.</p>}
    {active === 'Marketplace' && <p className="disclosure">Review the API-provided loan terms carefully. A score or assessment is not a guarantee of repayment.</p>}
    {result.data.length > 0 ? result.data.map(({ path, data }) => <section className="data-section" key={path}><div className="section-title"><h2>{pathLabel(path)}</h2><span className="data-source">Connected API</span></div><RecordView data={data} title={pathLabel(path)} />
      {active === 'Marketplace' && Array.isArray(data) && data.map((loan, index) => { const id = loan?.id || loan?.loanId; return id ? <div className="approval-actions" key={id}><span>Support this simulated loan request</span><button className="button primary" onClick={() => onAction({ type: 'contribute', loanId: id, item: loan })}>Review contribution</button></div> : null; })}
      {active === 'Approvals' && Array.isArray(data) && data.map((item, index) => <ApprovalActions key={item.id || item.approvalId || index} item={item} onAction={onAction} />)}
    </section>) : !result.error ? <Empty text="No API data is available for this view yet. Connect the backend and retry." /> : null}
    {active === 'Loans' && <div className="inline-actions"><button className="button outline" onClick={() => onAction({ type: 'create-loan' })}>Request a loan</button></div>}
      {active === 'Overview' && <div className="next-step"><div><p className="eyebrow">A GOOD NEXT STEP</p><h2>Review open loan requests</h2><p className="muted">See the terms before choosing whether to participate.</p></div><button className="button primary" onClick={() => window.dispatchEvent(new CustomEvent('bmoni:navigate', { detail: 'Marketplace' }))}>Explore marketplace <span>→</span></button></div>}
  </>;
}

function pathLabel(path) { const clean = path.split('?')[0]; if (clean.includes('lender/returns')) return 'Lender returns'; if (clean.includes('approvals')) return 'Pending approvals'; if (clean.includes('bmoni/')) return clean.split('/').slice(-1)[0].replace('-', ' '); return clean.split('/').pop().replace('-', ' ').replace(/^./, (c) => c.toUpperCase()); }

function ApprovalActions({ item, onAction }) { const id = item?.id || item?.approvalId; if (!id) return null; return <div className="approval-actions"><span>Review this simulated request</span><button className="button outline" onClick={() => onAction({ type: 'reject', id })}>Reject</button><button className="button primary" onClick={() => onAction({ type: 'confirm', id, item })}>Review & confirm</button></div>; }

function ActionDialog({ action, close, done }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [amount, setAmount] = useState(''); const [purpose, setPurpose] = useState(''); const [ack, setAck] = useState(false);
  const dialogRef = useRef(null);
  const idempotencyKey = useRef(crypto.randomUUID());
  useEffect(() => { dialogRef.current?.focus(); const handleKey = (event) => { if (event.key === 'Escape') close(); }; window.addEventListener('keydown', handleKey); return () => window.removeEventListener('keydown', handleKey); }, [close]);
  const destructive = action.type === 'confirm' || action.type === 'reject';
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      let path; let body = {}; let method = 'POST';
      if (action.type === 'create-loan') { path = '/api/loans'; body = { amount: Number(amount), purpose }; }
      if (action.type === 'contribute') { path = `/api/loans/${encodeURIComponent(action.loanId)}/contributions`; body = { amount: Number(amount), acceptedTerms: ack }; }
      if (action.type === 'confirm' || action.type === 'reject') { path = `/api/approvals/${encodeURIComponent(action.id)}/${action.type}`; body = {}; }
      await api(path, { method, body: Object.keys(body).length ? body : undefined, idempotencyKey: action.type === 'confirm' || action.type === 'contribute' ? idempotencyKey.current : undefined });
      done(action.type === 'confirm' ? 'Approval confirmed. The API accepted the action.' : action.type === 'reject' ? 'Approval rejected.' : action.type === 'contribute' ? 'Contribution sent to the API.' : 'Loan request sent to the API.');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && close()}><section ref={dialogRef} tabIndex={-1} className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><button className="dialog-close" onClick={close} aria-label="Close">×</button><p className="eyebrow">SIMULATED ACTIVITY</p><h2 id="dialog-title">{action.type === 'create-loan' ? 'Request a loan' : action.type === 'contribute' ? 'Contribute to a loan' : `${action.type === 'confirm' ? 'Confirm' : 'Reject'} approval`}</h2>
    {destructive && <div className="confirmation-detail"><strong>{action.type === 'confirm' ? 'Confirm this simulated action?' : 'Reject this simulated action?'}</strong><p>{action.item ? Object.entries(action.item).filter(([key]) => !/password|secret|token|key/i.test(key)).slice(0, 5).map(([key, value]) => `${formatLabel(key)}: ${safeValue(value, key)}`).join(' · ') : 'Review the pending approval details before continuing.'}</p><p>No real money will move through this demo.</p></div>}
    {(action.type === 'create-loan' || action.type === 'contribute') && <form className="form" onSubmit={submit}><label>Amount (NGN)<input type="number" min="1" required value={amount} onChange={(e) => setAmount(e.target.value)} /></label>{action.type === 'create-loan' && <label>Purpose<input required maxLength="180" value={purpose} onChange={(e) => setPurpose(e.target.value)} /></label>}<label className="checkbox-row"><input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} required />{action.type === 'create-loan' ? 'I understand this is a simulated request.' : 'I reviewed the loan terms and understand returns are not guaranteed.'}</label>{error && <p className="message error" role="alert">{error}</p>}<button className="button primary wide" disabled={!ack || busy}>{busy ? 'Sending…' : action.type === 'create-loan' ? 'Send simulated request' : 'Confirm simulated contribution'}</button></form>}
    {destructive && <form onSubmit={submit}>{error && <p className="message error" role="alert">{error}</p>}<div className="dialog-actions"><button type="button" className="button outline" onClick={close}>Go back</button><button className="button primary" disabled={busy}>{busy ? 'Processing…' : `Confirm ${action.type}`}</button></div></form>}
    <button type="button" className="text-button" onClick={close}>Cancel</button></section></div>;
}

function Advisory() {
  const [mode, setMode] = useState('scam-check'); const [input, setInput] = useState(''); const [result, setResult] = useState(null); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(event) { event.preventDefault(); setBusy(true); setError(''); setResult(null); try { setResult(await api(mode === 'scam-check' ? '/api/scam-check' : '/api/assistant/chat', { method: 'POST', body: mode === 'scam-check' ? { message: input } : { message: input } })); } catch (err) { setError(err.message); } finally { setBusy(false); } }
  return <section className="advisory-box"><div className="advisory-icon">✳</div><h2>Guidance for your next step</h2><p className="muted">This tool offers general advice only. It cannot approve, initiate or authorize payments.</p><div className="segmented"><button className={mode === 'scam-check' ? 'active' : ''} onClick={() => setMode('scam-check')}>Check a message</button><button className={mode === 'chat' ? 'active' : ''} onClick={() => setMode('chat')}>Ask a question</button></div><form className="form" onSubmit={submit}><label>{mode === 'scam-check' ? 'Paste a message you want to check' : 'What would you like help with?'}<textarea rows="4" required maxLength="2000" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Do not include passwords, BVN or account secrets." /></label>{error && <div className="message error" role="alert">{error}<button className="button outline" type="button" onClick={submit}>Retry</button></div>}<button className="button primary" disabled={busy || !input.trim()}>{busy ? 'Checking…' : mode === 'scam-check' ? 'Check message' : 'Ask B Moni'}</button></form>{result && <div className="advisory-result"><h3>Advisory response</h3><RecordView data={result} title="Advisory" /></div>}</section>;
}

export default App;
