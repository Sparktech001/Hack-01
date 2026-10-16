import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityTools } from './components/ActivityTools.jsx';
import { BmoniTools } from './components/BmoniTools.jsx';
import { WalletTools } from './components/WalletTools.jsx';
import './App.css';

const ROUTES = {
  Overview: ['/api/health', '/api/bootstrap', '/api/dashboard', '/api/wallet', '/api/score', '/api/transactions', '/api/approvals/pending'],
  Wallet: ['/api/wallet'],
  Loans: ['/api/loans'],
  Marketplace: ['/api/loans?role=open'],
  Activity: [],
  Approvals: ['/api/approvals/pending'],
  Advisory: [],
  'BMONI sandbox': [],
};

// Demo mode is disabled by default. Enable it only for a demo build.
const DEMO_MODE_ENABLED = import.meta.env.VITE_DEMO_MODE_ENABLED === 'true';
const DEMO_MODE_DEFAULT = import.meta.env.VITE_DEMO_MODE_DEFAULT === 'true';
let demoModeActive = false;

function initialDemoState() {
  return {
    wallet: { availableBalance: 42800, currency: 'NGN', label: 'Simulated balance', asOf: '2026-10-15T09:00:00Z' },
    score: { score: 72, band: 'Building', disclaimer: 'Simulated advisory score. It does not guarantee repayment or loan approval.' },
    loans: [
      { id: 'demo-loan-201', title: 'Course materials', purpose: 'Engineering textbooks and lab materials', amount: 65000, amountFunded: 42000, termMonths: 3, status: 'Open', createdAt: '2026-10-10T10:00:00Z' },
      { id: 'demo-loan-202', title: 'Accommodation deposit', purpose: 'Shared student accommodation deposit', amount: 90000, amountFunded: 54000, termMonths: 4, status: 'Open', createdAt: '2026-10-08T10:00:00Z' },
      { id: 'demo-loan-203', title: 'Laptop repair', purpose: 'Laptop screen repair for coursework', amount: 38000, amountFunded: 38000, termMonths: 2, status: 'Active', createdAt: '2026-09-21T10:00:00Z' },
    ],
    transactions: [
      { id: 'demo-tx-301', title: 'Simulated peer contribution', type: 'contribution', amount: 12000, status: 'Completed', createdAt: '2026-10-14T11:30:00Z' },
      { id: 'demo-tx-302', title: 'Simulated repayment', type: 'repayment', amount: 9500, status: 'Completed', createdAt: '2026-10-12T09:15:00Z' },
      { id: 'demo-tx-303', title: 'Simulated allowance', type: 'credit', amount: 30000, status: 'Completed', createdAt: '2026-10-08T12:00:00Z' },
    ],
    approvals: [{ id: 'demo-approval-401', action: 'Repayment request', amount: 9500, recipient: 'LMoni student loan', status: 'Pending' }],
    returns: [{ id: 'demo-return-501', loanId: 'demo-loan-203', principal: 25000, expectedReturn: 26250, status: 'Simulated' }],
    sandbox: { balances: [{ account: 'BMONI Sandbox NGN', balance: 150000, currency: 'NGN', environment: 'Sandbox' }], transactions: [{ id: 'demo-sandbox-601', type: 'Sandbox credit', amount: 150000, status: 'Simulated', createdAt: '2026-10-01T08:00:00Z' }] },
    schedules: { 'demo-loan-203': [{ installment: 1, dueDate: '2026-10-28T00:00:00Z', amount: 19500, status: 'Upcoming' }, { installment: 2, dueDate: '2026-11-28T00:00:00Z', amount: 19500, status: 'Upcoming' }] },
  };
}

function readDemoState() {
  try { return { ...initialDemoState(), ...JSON.parse(localStorage.getItem('bmoni_demo_data') || '{}') }; }
  catch { return initialDemoState(); }
}

function writeDemoState(state) { localStorage.setItem('bmoni_demo_data', JSON.stringify(state)); }

async function demoRequest(path, { method = 'GET', body } = {}) {
  await new Promise((resolve) => setTimeout(resolve, 180));
  const state = readDemoState();
  if (path === '/api/bootstrap') return { ready: true, accounts: [{ email: 'demo.student@bmoni.example', role: 'Student' }, { email: 'demo.lender@bmoni.example', role: 'Lender' }] };
  if (path === '/api/me') return { id: 'demo-student-1', fullName: 'Demo Student', role: 'Student' };
  if (path === '/api/dashboard') return { label: 'Simulated overview', nextAction: 'Review a pending simulated approval', environment: 'Demo' };
  if (path === '/api/wallet') return state.wallet;
  if (path === '/api/score') return state.score;
  if (path === '/api/transactions') return state.transactions;
  if (path === '/api/approvals/pending') return state.approvals.filter((item) => item.status === 'Pending');
  if (path === '/api/loans?role=open') return state.loans.filter((item) => item.status === 'Open');
  if (path === '/api/loans') return state.loans;
  if (path === '/api/lender/returns') return state.returns;
  if (path === '/api/bmoni/balances') return state.sandbox.balances;
  if (path === '/api/bmoni/transactions') return state.sandbox.transactions;
  const schedule = path.match(/^\/api\/loans\/([^/]+)\/schedule$/);
  if (schedule) return state.schedules[decodeURIComponent(schedule[1])] || [];
  const detail = path.match(/^\/api\/loans\/([^/]+)$/);
  if (detail && method === 'GET') return state.loans.find((item) => item.id === decodeURIComponent(detail[1])) || { id: detail[1], status: 'Simulated' };
  if (path === '/api/auth/login') return { token: 'simulated-session', user: { fullName: 'Demo Student' } };
  if (method === 'POST' && path === '/api/loans') {
    const loan = { id: `demo-loan-${Date.now()}`, title: body?.purpose || 'Student loan request', purpose: body?.purpose || 'Student expenses', amount: Number(body?.amount || 0), amountFunded: 0, termMonths: Number(body?.termMonths || 3), status: 'Open', createdAt: new Date().toISOString() };
    state.loans.unshift(loan); writeDemoState(state); return loan;
  }
  const contribution = path.match(/^\/api\/loans\/([^/]+)\/contributions$/);
  if (contribution && method === 'POST') {
    const loan = state.loans.find((item) => item.id === decodeURIComponent(contribution[1]));
    if (loan) loan.amountFunded = Math.min(loan.amount, loan.amountFunded + Number(body?.amount || 0));
    state.transactions.unshift({ id: `demo-tx-${Date.now()}`, title: 'Simulated peer contribution', amount: Number(body?.amount || 0), status: 'Completed', createdAt: new Date().toISOString() });
    writeDemoState(state); return { success: true, simulated: true };
  }
  const repayment = path.match(/^\/api\/loans\/([^/]+)\/repayments$/);
  if (repayment && method === 'POST') {
    state.approvals.unshift({ id: `demo-approval-${Date.now()}`, action: 'Repayment request', loanId: decodeURIComponent(repayment[1]), amount: Number(body?.amount || 0), recipient: 'LMoni student loan', status: 'Pending' });
    writeDemoState(state); return { success: true, status: 'Pending approval', simulated: true };
  }
  const approval = path.match(/^\/api\/approvals\/([^/]+)\/(confirm|reject)$/);
  if (approval && method === 'POST') {
    const item = state.approvals.find((row) => row.id === decodeURIComponent(approval[1]));
    if (item) item.status = approval[2] === 'confirm' ? 'Confirmed' : 'Rejected';
    if (item && approval[2] === 'confirm') state.transactions.unshift({ id: `demo-tx-${Date.now()}`, title: `Confirmed simulated ${String(item.action).toLowerCase()}`, amount: item.amount, status: 'Completed', createdAt: new Date().toISOString() });
    writeDemoState(state); return { success: true, status: item?.status || 'Updated', simulated: true };
  }
  if (path === '/api/scam-check' && method === 'POST') return { result: 'Advisory only', message: 'Pause before sharing money or personal information. Verify requests through an official channel.', simulated: true };
  if (path === '/api/assistant/chat' && method === 'POST') return { answer: 'I can explain loan terms and help you think through a budget. I cannot approve or authorize payments.', advisoryOnly: true, simulated: true };
  if (path === '/api/bmoni/transfers' && method === 'POST') {
    state.sandbox.transactions.unshift({ id: `demo-sandbox-${Date.now()}`, type: 'Sandbox transfer', amount: Number(body?.amount || 0), recipient: body?.recipient || 'Demo recipient', status: 'Simulated', createdAt: new Date().toISOString() });
    writeDemoState(state); return { success: true, status: 'Simulated sandbox transfer' };
  }
  if (path.startsWith('/api/loans/') && path.endsWith('/assess')) return { assessment: 'Simulated assessment', reasons: ['Demo profile data used', 'This result does not guarantee repayment or approval'], simulated: true };
  if (path.startsWith('/api/loans/') && path.endsWith('/accept-terms')) return { success: true, status: 'Simulated terms accepted' };
  if (path === '/api/bmoni/accounts/verify-nigerian' || path === '/api/bmoni/onboarding/nigeria') return { success: true, status: 'Sandbox only', simulated: true };
  return { success: true, simulated: true };
}

function apiRoot() {
  return (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '').replace(/\/api$/i, '');
}

async function api(path, { method = 'GET', body, formData, idempotencyKey, forceLive = false } = {}) {
  if (demoModeActive && !forceLive) return demoRequest(path, { method, body });
  const root = apiRoot();
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
    throw new Error('Could not reach the LMoni API. Check the API URL and your connection, then retry.');
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
  useEffect(() => {
    reload();
    window.addEventListener('bmoni:data-changed', reload);
    return () => window.removeEventListener('bmoni:data-changed', reload);
  }, [reload]);
  return { ...state, reload };
}

function DemoToggle({ active, onToggle, className = '' }) {
  if (!DEMO_MODE_ENABLED) return null;
  return <button type="button" className={`demo-toggle ${className}`} onClick={onToggle} aria-pressed={active} title={active ? 'Turn demo mode off' : 'Turn demo mode on'}><span className="demo-toggle-label">Demo</span><span className={`toggle-track ${active ? 'on' : ''}`} aria-hidden="true"><span /></span><span className="demo-toggle-state">{active ? 'On' : 'Off'}</span></button>;
}

function Login({ onLogin, onToggleDemo, demoMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [roles, setRoles] = useState('1');
  const [registering, setRegistering] = useState(false);
  const [options, setOptions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => { api('/api/bootstrap').then((data) => {
    const accounts = data?.accounts || data?.demoAccounts || [];
    setOptions(Array.isArray(accounts) ? accounts.filter((account) => account.email || account.emailAddress) : []);
  }).catch(() => {}); }, []);
  async function submit(event) {
    event.preventDefault(); setError(''); setNotice(''); setBusy(true);
    try {
      const result = await api(registering ? '/api/auth/register' : '/api/auth/login', { method: 'POST', body: registering ? { email, firstName, password, roles: Number(roles) } : { email, password } });
      const token = result?.token || result?.accessToken || result?.access_token;
      if (!token) throw new Error('The API did not return a session token. Check the login response contract.');
      localStorage.setItem('bmoni_token', token);
      const user = await api('/api/me').catch(() => result.user || null);
      if (user) localStorage.setItem('bmoni_user', JSON.stringify(user));
      onLogin(user);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <main className="login-wrap"><DemoToggle className="login-demo-toggle" active={demoMode} onToggle={onToggleDemo} /><section className="login-card">
    <Brand /><div className="environment"><span />Demo environment</div>
    <p className="eyebrow">STUDENT FINANCE, TOGETHER</p><h1>{registering ? 'Create your account.' : 'Good to have you here.'}</h1><p className="muted">{registering ? 'Choose how you want to use the LMoni sandbox.' : 'Sign in to manage your simulated student finance activity.'}</p>
    <form onSubmit={submit} className="form">
      {!registering && options.length > 0 && <label>Demo account<select value={email} onChange={(e) => { const selected = options.find((account) => (account.email || account.emailAddress) === e.target.value); setEmail(e.target.value); if (selected?.password) setPassword(selected.password); }}><option value="">Choose an account</option>{options.map((option) => <option key={option.email || option.emailAddress} value={option.email || option.emailAddress}>{option.firstName || option.name || 'Demo user'} · {option.email || option.emailAddress}</option>)}</select></label>}
      {registering && <label>First name<input autoComplete="given-name" required maxLength="80" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></label>}
      <label>Email address<input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu.ng" /></label>
      <label>Password<input type="password" autoComplete={registering ? 'new-password' : 'current-password'} minLength={registering ? 10 : undefined} maxLength="128" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      {registering && <label>Account role<select value={roles} onChange={(e) => setRoles(e.target.value)}><option value="1">Borrower</option><option value="2">Lender</option><option value="3">Borrower and lender</option></select></label>}
      {error && <p className="message error" role="alert">{error}</p>}{notice && <p className="message success" role="status">{notice}</p>}
      <button className="button primary wide" disabled={busy}>{busy ? (registering ? 'Creating account…' : 'Signing in…') : (registering ? 'Create account' : 'Sign in')}</button>
    </form>
    <p className="login-foot">{registering ? 'Already registered?' : 'New to LMoni?'} <button className="text-button" type="button" onClick={() => { setRegistering(!registering); setError(''); }}>{registering ? 'Sign in' : 'Create an account'}</button></p>
    <p className="login-foot">This demo does not move real money. Demo credentials are provided by the connected API.</p>
  </section></main>;
}

function Brand() { return <a className="brand" href="#overview" aria-label="LMoni home"><span className="brand-symbol">l</span><span>LMoni</span></a>; }

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('bmoni_token'));
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('bmoni_user')); } catch { return null; } });
  const [demoMode, setDemoMode] = useState(() => DEMO_MODE_ENABLED && (sessionStorage.getItem('bmoni_demo_mode') === 'true' || (sessionStorage.getItem('bmoni_demo_mode') == null && DEMO_MODE_DEFAULT)));
  const [active, setActive] = useState('Overview');
  const [flash, setFlash] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  demoModeActive = demoMode;
  const nav = Object.keys(ROUTES);
  useEffect(() => { const logout = () => { setToken(null); setUser(null); }; window.addEventListener('bmoni:logout', logout); return () => window.removeEventListener('bmoni:logout', logout); }, []);
  useEffect(() => { const navigate = (event) => setActive(event.detail); window.addEventListener('bmoni:navigate', navigate); return () => window.removeEventListener('bmoni:navigate', navigate); }, []);
  function toggleDemo() {
    const next = !demoMode;
    setDemoMode(next);
    sessionStorage.setItem('bmoni_demo_mode', String(next));
    if (next) {
      localStorage.removeItem('bmoni_token');
      localStorage.removeItem('bmoni_user');
      setToken(null);
      setUser({ fullName: 'Demo Student', role: 'Student' });
    } else {
      setToken(null);
      setUser(null);
    }
    setActive('Overview');
  }
  if (!token && !demoMode) return <Login demoMode={demoMode} onToggleDemo={toggleDemo} onLogin={(profile) => { setToken(localStorage.getItem('bmoni_token')); setUser(profile); setActive('Overview'); }} />;
  return <div className="app-shell">
    <aside className="sidebar"><Brand /><p className="nav-label">YOUR FINANCES</p><nav aria-label="Main navigation">{nav.map((item, index) => <button key={item} className={`nav-item ${active === item ? 'selected' : ''}`} onClick={() => setActive(item)}><span className="nav-icon">{['◫', '◉', '↗', '◎', '↔', '✓', '✳', '▦'][index]}</span>{item}</button>)}</nav><div className="sidebar-bottom"><div className="demo-note"><span className="dot" />{demoMode ? 'Demo mode is on' : 'Demo environment'}<p>{demoMode ? 'Actions and money values are simulated.' : 'Activity and balances shown here are simulated.'}</p></div><DemoToggle active={demoMode} onToggle={toggleDemo} /><button className="nav-item logout" onClick={() => { localStorage.removeItem('bmoni_token'); localStorage.removeItem('bmoni_user'); setToken(null); setUser(null); }}>↗ <span>Sign out</span></button></div></aside>
    <main className="main-area"><header className="topbar"><div className="mobile-brand"><Brand /></div><div className="topbar-right"><DemoToggle active={demoMode} onToggle={toggleDemo} /><span className="environment"><span />{demoMode ? 'Demo mode' : 'Demo environment'}</span><span className="avatar">{(user?.firstName || user?.name || user?.fullName || 'S').slice(0, 1).toUpperCase()}</span></div></header>
      <div className="page-content"><div className="page-heading"><div><p className="eyebrow">LMONI · STUDENT FINANCE</p><h1>{active === 'Overview' ? 'Your money, in view.' : active}</h1><p className="muted">{active === 'Overview' ? 'A clear picture of your simulated activity.' : descriptions[active]}</p></div>{active === 'Loans' && canBorrow(user) && <button className="button primary" onClick={() => setPendingAction({ type: 'create-loan' })}>Request a loan <span>＋</span></button>}</div>
        {flash && <p className="message success" role="status">{flash}<button className="dismiss" onClick={() => setFlash('')} aria-label="Dismiss">×</button></p>}
        <Workspace active={active} onAction={setPendingAction} demoMode={demoMode} user={user} />
      </div>
    </main>
    <nav className="mobile-nav" aria-label="Main navigation">{nav.map((item) => <button key={item} className={active === item ? 'selected' : ''} onClick={() => setActive(item)}>{item}</button>)}</nav>
    {pendingAction && <ActionDialog action={pendingAction} close={() => setPendingAction(null)} done={(message) => { setPendingAction(null); setFlash(message); window.dispatchEvent(new Event('bmoni:data-changed')); }} />}
  </div>;
}

const descriptions = {
  Loans: 'Track requests and repayments. Every figure comes from the connected API.',
  Marketplace: 'Explore open requests from the student community.',
  Activity: 'Review wallet activity and lender returns returned by the API.',
  Approvals: 'Review the exact action and amount before confirming.',
  Advisory: 'Helpful guidance only. Advice never approves or initiates payments.',
  'BMONI sandbox': 'A separate sandbox for BMONI account activity; it is not the peer-lending ledger.',
};

function canLend(user) { return Boolean((Number(user?.roles ?? user?.role ?? 0) & 2) === 2 || String(user?.roles ?? user?.role ?? '').toLowerCase().includes('lender')); }
function canBorrow(user) { return Boolean((Number(user?.roles ?? user?.role ?? 0) & 1) === 1 || String(user?.roles ?? user?.role ?? '').toLowerCase().includes('borrower')); }

function Workspace({ active, onAction, demoMode, user }) {
  const lender = canLend(user); const borrower = canBorrow(user);
  const paths = useMemo(() => ROUTES[active], [active]);
  const result = usePanelData(paths, active !== 'Advisory');
  if (active === 'Advisory') return <Advisory />;
  if (active === 'Activity') return <ActivityTools api={api} canLend={lender} />;
  if (active === 'BMONI sandbox') return <BmoniTools api={api} user={user} onDataChanged={() => window.dispatchEvent(new Event('bmoni:data-changed'))} />;
  if (result.loading) return <div className="skeleton-list" aria-label="Loading"><div /><div /><div /></div>;
  return <>
    {result.error && <div className="message error" role="alert"><span>{result.error}</span><button className="button outline" onClick={result.reload}>Retry</button></div>}
    {active === 'Overview' && <div className="callout"><span className="callout-icon">i</span><p><strong>Simulated activity</strong><br />Peer-loan balances and repayments are simulated. BMONI sandbox wallet activity is separate.</p></div>}
    {active === 'Approvals' && <p className="disclosure">Confirm or reject only after reviewing the amount, action and recipient returned for each approval.</p>}
    {active === 'BMONI sandbox' && <p className="disclosure">Sandbox activity is separate from the simulated peer-lending ledger. Never enter a real BVN or upload real identity documents in this demo.</p>}
    {active === 'BMONI sandbox' && demoMode && <div className="sandbox-tools"><p><strong>Sandbox tools</strong><br />Try a simulated transfer to see how sandbox activity is kept separate from peer lending.</p><button className="button outline" onClick={() => onAction({ type: 'sandbox-transfer' })}>Try a demo transfer</button></div>}
    {active === 'Marketplace' && <p className="disclosure">Review the API-provided loan terms carefully. A score or assessment is not a guarantee of repayment.</p>}
    {active === 'Wallet' && <WalletTools api={api} onDataChanged={() => window.dispatchEvent(new Event('bmoni:data-changed'))} />}
    {result.data.length > 0 ? result.data.map(({ path, data }) => <section className="data-section" key={path}><div className="section-title"><h2>{pathLabel(path)}</h2><span className="data-source">Connected API</span></div><RecordView data={data} title={pathLabel(path)} />
      {(active === 'Loans' || active === 'Marketplace') && Array.isArray(data) && data.map((loan, index) => { const id = loan?.id || loan?.loanId; return id ? <LoanActions key={id} loan={loan} onAction={onAction} active={active} lender={lender} borrower={borrower} /> : null; })}
      {active === 'Approvals' && Array.isArray(data) && data.map((item, index) => <ApprovalActions key={item.id || item.approvalId || index} item={item} onAction={onAction} />)}
    </section>) : !result.error ? <Empty text="No API data is available for this view yet. Connect the backend and retry." /> : null}
    {active === 'Loans' && borrower && <div className="inline-actions"><button className="button outline" onClick={() => onAction({ type: 'create-loan' })}>Request a loan</button></div>}
      {active === 'Overview' && <div className="next-step"><div><p className="eyebrow">A GOOD NEXT STEP</p><h2>Review open loan requests</h2><p className="muted">See the terms before choosing whether to participate.</p></div><button className="button primary" onClick={() => window.dispatchEvent(new CustomEvent('bmoni:navigate', { detail: 'Marketplace' }))}>Explore marketplace <span>→</span></button></div>}
  </>;
}

function pathLabel(path) { const clean = path.split('?')[0]; if (clean.includes('lender/returns')) return 'Lender returns'; if (clean.includes('approvals')) return 'Pending approvals'; if (clean.includes('bmoni/')) return clean.split('/').slice(-1)[0].replace('-', ' '); return clean.split('/').pop().replace('-', ' ').replace(/^./, (c) => c.toUpperCase()); }

function ApprovalActions({ item, onAction }) { const id = item?.id || item?.approvalId; if (!id) return null; return <div className="approval-actions"><span>Review this simulated request</span><button className="button outline" onClick={() => onAction({ type: 'reject', id })}>Reject</button><button className="button primary" onClick={() => onAction({ type: 'confirm', id, item })}>Review & confirm</button></div>; }

function LoanActions({ loan, onAction, active, lender, borrower }) { const id = loan?.id || loan?.loanId; const status = String(loan?.status || ''); return <div className="loan-actions"><button className="button outline" onClick={() => onAction({ type: 'detail', loanId: id })}>View details</button><button className="button outline" onClick={() => onAction({ type: 'schedule', loanId: id })}>View repayment schedule</button>{borrower && active === 'Loans' && <button className="button outline" onClick={() => onAction({ type: 'assess', loanId: id })}>View assessment</button>}{lender && active === 'Marketplace' && status === 'OpenForFunding' && <button className="button primary" onClick={() => onAction({ type: 'contribute', loanId: id, item: loan })}>Contribute</button>}{borrower && status === 'AwaitingBorrowerAcceptance' && <button className="button primary" onClick={() => onAction({ type: 'accept', loanId: id, item: loan })}>Accept loan terms</button>}{borrower && ['Active', 'Defaulted'].includes(status) && <button className="button outline" onClick={() => onAction({ type: 'repayment', loanId: id })}>Request repayment</button>}{lender && active === 'Loans' && <button className="button outline" onClick={() => onAction({ type: 'withdraw', loanId: id })}>Withdraw contribution</button>}</div>; }

function ActionDialog({ action, close, done }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [amount, setAmount] = useState(''); const [purpose, setPurpose] = useState(''); const [statement, setStatement] = useState(''); const [repaymentDays, setRepaymentDays] = useState('30'); const [installments, setInstallments] = useState('4'); const [recipient, setRecipient] = useState(''); const [description, setDescription] = useState('Sandbox transfer'); const [contributionId, setContributionId] = useState(''); const [ack, setAck] = useState(false); const [detailResult, setDetailResult] = useState(null);
  const dialogRef = useRef(null);
  const idempotencyKey = useRef(crypto.randomUUID());
  useEffect(() => { dialogRef.current?.focus(); const handleKey = (event) => { if (event.key === 'Escape') close(); }; window.addEventListener('keydown', handleKey); return () => window.removeEventListener('keydown', handleKey); }, [close]);
  useEffect(() => {
    if (!['detail', 'schedule', 'assess'].includes(action.type)) return;
    let cancelled = false; setBusy(true); setError('');
    const path = `/api/loans/${encodeURIComponent(action.loanId)}${action.type === 'schedule' ? '/schedule' : action.type === 'assess' ? '/assess' : ''}`;
    api(path, { method: action.type === 'assess' ? 'POST' : 'GET' }).then((data) => { if (!cancelled) setDetailResult(data); }).catch((err) => { if (!cancelled) setError(err.message); }).finally(() => { if (!cancelled) setBusy(false); });
    return () => { cancelled = true; };
  }, [action.type, action.loanId]);
  const destructive = action.type === 'confirm' || action.type === 'reject';
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      let path; let body = {}; let method = 'POST';
      if (action.type === 'create-loan') { path = '/api/loans'; body = { amount: Number(amount), purpose, statement, repaymentDays: Number(repaymentDays), installments: Number(installments) }; }
      if (action.type === 'contribute') { path = `/api/loans/${encodeURIComponent(action.loanId)}/contributions`; body = { amount: Number(amount), acknowledgedTerms: ack }; }
      if (action.type === 'repayment') { path = `/api/loans/${encodeURIComponent(action.loanId)}/repayments`; body = { amount: Number(amount) }; }
      if (action.type === 'sandbox-transfer') { path = '/api/bmoni/transfers'; body = { toBmoniUserId: recipient, amount: Number(amount), description }; }
      if (action.type === 'confirm' || action.type === 'reject') { path = `/api/approvals/${encodeURIComponent(action.id)}/${action.type}`; body = {}; }
      if (action.type === 'schedule' || action.type === 'detail') { setDetailResult(await api(`/api/loans/${encodeURIComponent(action.loanId)}${action.type === 'schedule' ? '/schedule' : ''}`)); setBusy(false); return; }
      if (action.type === 'assess') { setDetailResult(await api(`/api/loans/${encodeURIComponent(action.loanId)}/assess`, { method: 'POST' })); setBusy(false); return; }
      if (action.type === 'accept') { path = `/api/loans/${encodeURIComponent(action.loanId)}/accept-terms`; body = {}; }
      if (action.type === 'withdraw') { method = 'DELETE'; path = `/api/loans/${encodeURIComponent(action.loanId)}/contributions/${encodeURIComponent(contributionId)}`; }
      await api(path, { method, body: Object.keys(body).length ? body : undefined, idempotencyKey: ['confirm', 'contribute', 'repayment', 'sandbox-transfer', 'accept', 'withdraw'].includes(action.type) ? idempotencyKey.current : undefined });
      done(action.type === 'confirm' ? 'Approval confirmed.' : action.type === 'reject' ? 'Approval rejected.' : action.type === 'contribute' ? 'Contribution submitted.' : action.type === 'repayment' ? 'Repayment request sent for approval.' : action.type === 'accept' ? 'Loan terms accepted.' : action.type === 'withdraw' ? 'Contribution withdrawn.' : action.type === 'sandbox-transfer' ? 'BMONI transfer request sent for approval.' : 'Loan request submitted.');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && close()}><section ref={dialogRef} tabIndex={-1} className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><button className="dialog-close" onClick={close} aria-label="Close">×</button><p className="eyebrow">SIMULATED ACTIVITY</p><h2 id="dialog-title">{action.type === 'create-loan' ? 'Request a loan' : action.type === 'contribute' ? 'Contribute to a loan' : action.type === 'repayment' ? 'Request a repayment' : action.type === 'withdraw' ? 'Withdraw a contribution' : action.type === 'accept' ? 'Accept loan terms' : action.type === 'assess' ? 'Credit assessment' : action.type === 'detail' ? 'Loan details' : action.type === 'sandbox-transfer' ? 'Sandbox transfer' : action.type === 'schedule' ? 'Repayment schedule' : `${action.type === 'confirm' ? 'Confirm' : 'Reject'} approval`}</h2>
    {destructive && <div className="confirmation-detail"><strong>{action.type === 'confirm' ? 'Confirm this simulated action?' : 'Reject this simulated action?'}</strong><p>{action.item ? Object.entries(action.item).filter(([key]) => !/password|secret|token|key/i.test(key)).slice(0, 5).map(([key, value]) => `${formatLabel(key)}: ${safeValue(value, key)}`).join(' · ') : 'Review the pending approval details before continuing.'}</p><p>No real money will move through this demo.</p></div>}
    {(action.type === 'create-loan' || action.type === 'contribute' || action.type === 'repayment' || action.type === 'sandbox-transfer' || action.type === 'withdraw' || action.type === 'accept') && <form className="form" onSubmit={submit}>{['create-loan', 'contribute', 'repayment', 'sandbox-transfer'].includes(action.type) && <label>Amount (NGN)<input type="number" min="0.01" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} /></label>}{action.type === 'create-loan' && <><label>Purpose<input required maxLength="80" value={purpose} onChange={(e) => setPurpose(e.target.value)} /></label><label>Loan statement<textarea required maxLength="1000" rows="3" value={statement} onChange={(e) => setStatement(e.target.value)} /></label><label>Repayment period in days<input type="number" min="7" max="120" required value={repaymentDays} onChange={(e) => setRepaymentDays(e.target.value)} /></label><label>Installments<select value={installments} onChange={(e) => setInstallments(e.target.value)}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></label></>}{action.type === 'withdraw' && <label>Contribution ID<input required value={contributionId} onChange={(e) => setContributionId(e.target.value)} /><small>Use the contribution Reference ID shown in Activity after you contribute.</small></label>}{action.type === 'sandbox-transfer' && <><label>Recipient BMONI user ID<input required maxLength="128" value={recipient} onChange={(e) => setRecipient(e.target.value)} /></label><label>Description<input required maxLength="180" value={description} onChange={(e) => setDescription(e.target.value)} /></label></>}{!['repayment', 'withdraw'].includes(action.type) && <label className="checkbox-row"><input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} required />{action.type === 'create-loan' ? 'I understand this is a simulated request.' : action.type === 'contribute' ? 'I reviewed the loan terms and understand returns are not guaranteed.' : action.type === 'accept' ? 'I reviewed these terms and understand the platform wallet movement is simulated.' : 'I understand this stays within the BMONI sandbox.'}</label>}{action.type === 'repayment' && <p className="muted">This creates a simulated repayment request for approval. No funds move now.</p>}{error && <p className="message error" role="alert">{error}</p>}<button className="button primary wide" disabled={busy || (!['repayment', 'withdraw'].includes(action.type) && !ack)}>{busy ? 'Sending…' : action.type === 'create-loan' ? 'Send loan request' : action.type === 'contribute' ? 'Confirm contribution' : action.type === 'repayment' ? 'Request approval' : action.type === 'withdraw' ? 'Withdraw contribution' : action.type === 'accept' ? 'Accept loan terms' : 'Run sandbox transfer'}</button></form>}
    {['detail', 'schedule', 'assess'].includes(action.type) && busy && <div className="skeleton-list" aria-label="Loading loan details"><div /></div>}
    {error && ['detail', 'schedule', 'assess'].includes(action.type) && <p className="message error" role="alert">{error}</p>}
    {detailResult && <div className="advisory-result"><RecordView data={detailResult} title={action.type === 'assess' ? 'Credit assessment' : action.type === 'detail' ? 'Loan details' : 'Repayment schedule'} /></div>}
    {(action.type === 'accept') && <div className="confirmation-detail"><p>Accepting these terms marks the loan active and records its disbursement in the simulated platform wallet.</p></div>}
    {destructive && <form onSubmit={submit}>{error && <p className="message error" role="alert">{error}</p>}<div className="dialog-actions"><button type="button" className="button outline" onClick={close}>Go back</button><button className="button primary" disabled={busy}>{busy ? 'Processing…' : `Confirm ${action.type}`}</button></div></form>}
    <button type="button" className="text-button" onClick={close}>Cancel</button></section></div>;
}

function Advisory() {
  const [mode, setMode] = useState('scam-check');
  const [input, setInput] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [expectedAccountName, setExpectedAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (mode === 'scam-check' && Boolean(bankCode.trim()) !== Boolean(accountNumber.trim())) {
      setError('Enter both a bank code and account number, or leave both blank.');
      return;
    }
    setBusy(true); setError(''); setResult(null);
    try {
      const body = mode === 'scam-check'
        ? { message: input, bankCode: bankCode.trim() || null, accountNumber: accountNumber.trim() || null, expectedAccountName: expectedAccountName.trim() || null, amount: amount === '' ? null : Number(amount) }
        : { question: input };
      setResult(await api(mode === 'scam-check' ? '/api/scam-check' : '/api/assistant/chat', { method: 'POST', body }));
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <section className="advisory-box">
    <div className="advisory-icon">✳</div><h2>Guidance for your next step</h2>
    <p className="muted">This tool offers general advice only. It cannot approve, initiate or authorize payments.</p>
    <div className="segmented"><button type="button" className={mode === 'scam-check' ? 'active' : ''} onClick={() => { setMode('scam-check'); setResult(null); setError(''); }}>Check a message</button><button type="button" className={mode === 'chat' ? 'active' : ''} onClick={() => { setMode('chat'); setResult(null); setError(''); }}>Ask a question</button></div>
    <form className="form" onSubmit={submit}>
      <label>{mode === 'scam-check' ? 'Paste a message you want to check' : 'What would you like help with?'}<textarea rows="4" required maxLength={mode === 'scam-check' ? 5000 : 2000} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Do not include passwords, BVN or account secrets." /></label>
      {mode === 'scam-check' && <>
        <p className="muted small">Optional: check a recipient account and payment amount. Use sandbox details only.</p>
        <div className="backend-grid advisory-fields">
          <label className="backend-field">Bank code<input inputMode="numeric" maxLength={20} value={bankCode} onChange={(e) => setBankCode(e.target.value)} placeholder="Bank code" /></label>
          <label className="backend-field">Account number<input inputMode="numeric" maxLength={20} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Account number" /></label>
          <label className="backend-field">Expected account name<input maxLength={120} value={expectedAccountName} onChange={(e) => setExpectedAccountName(e.target.value)} placeholder="Name you were given" /></label>
          <label className="backend-field">Amount (NGN)<input type="number" min="0" max="10000000" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Optional" /></label>
        </div>
      </>}
      {error && <div className="message error" role="alert">{error}<button className="button outline" type="button" onClick={submit}>Retry</button></div>}
      <button className="button primary" disabled={busy || !input.trim()}>{busy ? (mode === 'scam-check' ? 'Checking…' : 'Thinking…') : mode === 'scam-check' ? 'Check message' : 'Ask LMoni'}</button>
    </form>
    {result && mode === 'scam-check' && <section className={`scam-result risk-${String(result.riskLevel || 'unknown').toLowerCase()}`} aria-live="polite">
      <div className="scam-result__top"><div><p className="eyebrow">SCAM CHECK</p><h3>{String(result.riskLevel || 'Assessment').toUpperCase()} RISK</h3></div><span>{result.isAiGenerated ? 'AI assisted' : 'Rule based'}{result.isSimulated ? ' · Sandbox' : ''}</span></div>
      <p className="scam-result__action">{result.recommendedAction || 'Review the details carefully.'}</p>
      {result.verifiedAccountName && <p><strong>Verified account name:</strong> {result.verifiedAccountName}</p>}
      {Array.isArray(result.reasons) && result.reasons.length > 0 && <ul>{result.reasons.map((reason, index) => <li key={`${reason.type}-${index}`}><strong>{reason.type?.replaceAll('_', ' ') || 'Warning'}:</strong> {reason.text}</li>)}</ul>}
      {result.disclaimer && <p className="scam-result__disclaimer">{result.disclaimer}</p>}
    </section>}
    {result && mode === 'chat' && <div className="advisory-result"><h3>Advisory response</h3><p>{result.answer || 'No answer was returned.'}</p><p className="muted small">{result.isSimulated ? 'Uses simulated account data.' : ''}</p></div>}
  </section>;
}
export default App;
