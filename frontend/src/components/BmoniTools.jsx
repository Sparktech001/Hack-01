import { useState } from 'react';

const PERSONAS = [
  { label: 'Bunch Dillon · sandbox persona', firstName: 'Bunch', lastName: 'Dillon', phoneNumber: '+2348000000000', bvn: '95888168924' },
  { label: 'Samson Jabo · sandbox persona', firstName: 'Samson', lastName: 'Jabo', phoneNumber: '+2348000000001', bvn: '22222222222' },
];

const INITIAL_PROFILE = {
  firstName: '', lastName: '', email: '', phoneNumber: '', bvn: '',
  identificationType: '', identificationNumber: '', identificationIssuingCountry: 'NGA',
  proofOfAddressType: '', dateOfBirth: '', gender: 'Male', nationality: 'Nigerian', occupation: '',
  streetLine1: '', city: '', state: '', postalCode: '',
};

const STEPS = ['Sandbox profile', 'Identity documents', 'Personal details'];

function Field({ label, name, value, onChange, type = 'text', required = true, hint, ...props }) {
  return <label className="backend-field">{label}<input name={name} type={type} value={value ?? ''} onChange={onChange} required={required} {...props} />{hint && <small>{hint}</small>}</label>;
}

function ResultCard({ title, value }) {
  if (!value) return null;
  return <section className="backend-result" aria-live="polite"><div className="backend-result__heading"><span className="result-check">✓</span><div><h3>{title}</h3><p>Returned by the BMONI API</p></div></div><div className="backend-result__grid">{Object.entries(value).filter(([key]) => !/password|secret|token|key/i.test(key)).map(([key, item]) => <div key={key}><span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}</span><strong>{String(item ?? '—')}</strong></div>)}</div></section>;
}

function ErrorMessage({ children }) { return children ? <p className="message error" role="alert">{children}</p> : null; }

export function BmoniTools({ api, user, onDataChanged }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ ...INITIAL_PROFILE, email: user?.email || '' });
  const [idFile, setIdFile] = useState(null);
  const [addressFile, setAddressFile] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [onboarding, setOnboarding] = useState(null);
  const [bank, setBank] = useState({ bankCode: '', accountNumber: '' });
  const [verification, setVerification] = useState(null);
  const [transfer, setTransfer] = useState({ toBmoniUserId: '', amount: '', description: '' });
  const [transferApproval, setTransferApproval] = useState(null);
  const [balances, setBalances] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [refreshError, setRefreshError] = useState('');

  function update(field, value) { setProfile((current) => ({ ...current, [field]: value })); }
  function changeField(event) { update(event.target.name, event.target.value); }
  function choosePersona(event) {
    const persona = PERSONAS[Number(event.target.value)];
    if (persona) setProfile((current) => ({ ...current, ...persona, email: current.email || user?.email || '' }));
  }
  function moveStep(direction) {
    const form = document.getElementById('nigeria-kyc-form');
    if (direction > 0 && !form?.reportValidity()) return;
    setError('');
    setStep((current) => Math.min(STEPS.length - 1, Math.max(0, current + direction)));
  }
  function validateFile(file, label) {
    if (!file) return `${label} is required.`;
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) return `${label} must be a JPEG, PNG or PDF.`;
    if (file.size > 10 * 1024 * 1024) return `${label} must be 10 MB or smaller.`;
    return '';
  }
  async function submitKyc(event) {
    event.preventDefault(); setError(''); setSuccess('');
    const fileError = validateFile(idFile, 'Identification document') || validateFile(addressFile, 'Proof of address');
    if (fileError) { setError(fileError); return; }
    if (!/^\d{6}$/.test(profile.postalCode)) { setError('Enter the 6 digit Nigerian postal code.'); return; }
    setBusy('kyc');
    try {
      const form = new FormData();
      Object.entries(profile).forEach(([key, value]) => form.append(key[0].toUpperCase() + key.slice(1), value));
      form.append('IdentificationFile', idFile);
      form.append('ProofOfAddressFile', addressFile);
      const result = await api('/api/bmoni/onboarding/nigeria', { method: 'POST', formData: form, forceLive: true });
      setOnboarding(result); setSuccess('Nigeria sandbox onboarding was submitted.'); setStep(0); onDataChanged?.();
    } catch (err) { setError(err.message); }
    finally { setBusy(''); }
  }
  async function loadWalletActivity() {
    setBusy('activity'); setRefreshError('');
    const [balanceResult, transactionResult] = await Promise.allSettled([
      api('/api/bmoni/balances', { forceLive: true }), api('/api/bmoni/transactions', { forceLive: true }),
    ]);
    if (balanceResult.status === 'fulfilled') setBalances(balanceResult.value);
    if (transactionResult.status === 'fulfilled') setTransactions(transactionResult.value);
    const failures = [balanceResult, transactionResult].filter((item) => item.status === 'rejected');
    if (failures.length) setRefreshError(failures.map((item) => item.reason?.message).join(' '));
    setBusy('');
  }
  async function verifyAccount(event) {
    event.preventDefault(); setBusy('verify'); setError(''); setVerification(null); setSuccess('');
    try { const result = await api('/api/bmoni/accounts/verify-nigerian', { method: 'POST', body: bank, forceLive: true }); setVerification(result); }
    catch (err) { setError(err.message); }
    finally { setBusy(''); }
  }
  async function requestTransfer(event) {
    event.preventDefault(); setBusy('transfer'); setError(''); setTransferApproval(null); setSuccess('');
    try {
      const result = await api('/api/bmoni/transfers', { method: 'POST', body: { ...transfer, amount: Number(transfer.amount) }, idempotencyKey: crypto.randomUUID(), forceLive: true });
      setTransferApproval(result); setSuccess('Transfer request created. Review it in Approvals before confirming.'); onDataChanged?.();
    } catch (err) { setError(err.message); }
    finally { setBusy(''); }
  }

  return <div className="bmoni-workspace">
    <div className="disclosure"><strong>Sandbox KYC only.</strong> Use a BMONI test persona and sample documents. Never enter a real BVN or upload real identity documents. The BMONI wallet is separate from the simulated peer-lending ledger.</div>
    {(error || success) && <div className={`message ${error ? 'error' : 'success'}`} role={error ? 'alert' : 'status'}><span>{error || success}</span><button className="dismiss" onClick={() => { setError(''); setSuccess(''); }} aria-label="Dismiss">×</button></div>}

    <section className="data-section kyc-section" aria-labelledby="kyc-heading">
      <div className="section-title"><div><p className="eyebrow">BMONI NIGERIA</p><h2 id="kyc-heading">Complete sandbox KYC</h2></div><span className="data-source">Step {step + 1} of {STEPS.length}</span></div>
      <div className="kyc-progress" aria-label={`Step ${step + 1} of ${STEPS.length}`}>{STEPS.map((label, index) => <div key={label} className={`kyc-progress__step ${index === step ? 'current' : index < step ? 'done' : ''}`}><span>{index < step ? '✓' : index + 1}</span><small>{label}</small></div>)}</div>
      <form id="nigeria-kyc-form" className="form backend-form" onSubmit={submitKyc}>
        {step === 0 && <div className="backend-grid">
          <label className="backend-field backend-field--wide">Choose a BMONI sandbox persona<select onChange={choosePersona} defaultValue=""><option value="" disabled>Select a test persona</option>{PERSONAS.map((persona, index) => <option value={index} key={persona.label}>{persona.label}</option>)}</select><small>The backend accepts these two sandbox identities.</small></label>
          <Field label="First name" name="firstName" value={profile.firstName} onChange={changeField} autoComplete="given-name" />
          <Field label="Last name" name="lastName" value={profile.lastName} onChange={changeField} autoComplete="family-name" />
          <Field label="Email" name="email" value={profile.email} onChange={changeField} type="email" autoComplete="email" />
          <Field label="Phone number" name="phoneNumber" value={profile.phoneNumber} onChange={changeField} type="tel" hint="Use the exact +234 number from the selected test persona." />
          <Field label="BVN" name="bvn" value={profile.bvn} onChange={changeField} inputMode="numeric" maxLength={11} minLength={11} />
        </div>}
        {step === 1 && <div className="backend-grid">
          <Field label="Identification type" name="identificationType" value={profile.identificationType} onChange={changeField} hint="Use a type supported by your BMONI sandbox setup (for example, NIN)." />
          <Field label="Identification number" name="identificationNumber" value={profile.identificationNumber} onChange={changeField} />
          <Field label="Issuing country code" name="identificationIssuingCountry" value={profile.identificationIssuingCountry} onChange={changeField} maxLength={3} hint="Use NGA for Nigeria." />
          <label className="backend-field backend-field--wide">Identification document<input type="file" accept="image/jpeg,image/png,application/pdf,.jpg,.jpeg,.png,.pdf" onChange={(event) => setIdFile(event.target.files?.[0] || null)} required /><small>{idFile ? `${idFile.name} · ${(idFile.size / 1024).toFixed(0)} KB` : 'JPEG, PNG or PDF. Up to 10 MB.'}</small></label>
          <Field label="Proof of address type" name="proofOfAddressType" value={profile.proofOfAddressType} onChange={changeField} hint="Use a proof type accepted by the BMONI sandbox." />
          <label className="backend-field backend-field--wide">Proof of address document<input type="file" accept="image/jpeg,image/png,application/pdf,.jpg,.jpeg,.png,.pdf" onChange={(event) => setAddressFile(event.target.files?.[0] || null)} required /><small>{addressFile ? `${addressFile.name} · ${(addressFile.size / 1024).toFixed(0)} KB` : 'JPEG, PNG or PDF. Up to 10 MB.'}</small></label>
        </div>}
        {step === 2 && <div className="backend-grid">
          <Field label="Date of birth" name="dateOfBirth" type="date" value={profile.dateOfBirth} onChange={changeField} />
          <label className="backend-field">Gender<select name="gender" value={profile.gender} onChange={changeField} required><option>Male</option><option>Female</option><option>Other</option></select></label>
          <Field label="Nationality" name="nationality" value={profile.nationality} onChange={changeField} />
          <Field label="Occupation" name="occupation" value={profile.occupation} onChange={changeField} />
          <Field label="Street address" name="streetLine1" value={profile.streetLine1} onChange={changeField} autoComplete="address-line1" />
          <Field label="City" name="city" value={profile.city} onChange={changeField} autoComplete="address-level2" />
          <Field label="State" name="state" value={profile.state} onChange={changeField} autoComplete="address-level1" />
          <Field label="Postal code" name="postalCode" value={profile.postalCode} onChange={changeField} inputMode="numeric" maxLength={6} minLength={6} hint="Nigeria postal codes are 6 digits." />
        </div>}
        <div className="kyc-actions">{step > 0 && <button type="button" className="button outline" onClick={() => moveStep(-1)}>Back</button>}{step < STEPS.length - 1 ? <button type="button" className="button primary" onClick={() => moveStep(1)}>Continue</button> : <button className="button primary" disabled={busy === 'kyc'}>{busy === 'kyc' ? 'Sending KYC…' : 'Submit Nigeria KYC'}</button>}</div>
      </form>
      <ResultCard title="Onboarding response" value={onboarding} />
    </section>

    <div className="backend-two-col">
      <section className="backend-panel"><div className="section-title"><div><p className="eyebrow">LINKED ACCOUNT</p><h2>Verify a Nigerian bank account</h2></div></div>
        <form className="form backend-form" onSubmit={verifyAccount}><Field label="Bank code" value={bank.bankCode} onChange={(e) => setBank({ ...bank, bankCode: e.target.value })} inputMode="numeric" /><Field label="Account number" value={bank.accountNumber} onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })} inputMode="numeric" /><button className="button outline" disabled={busy === 'verify'}>{busy === 'verify' ? 'Checking…' : 'Verify account'}</button></form><ResultCard title="Verification result" value={verification} />
      </section>
      <section className="backend-panel"><div className="section-title"><div><p className="eyebrow">SANDBOX TRANSFER</p><h2>Request a BMONI transfer</h2></div></div>
        <form className="form backend-form" onSubmit={requestTransfer}><Field label="Recipient BMONI user ID" value={transfer.toBmoniUserId} onChange={(e) => setTransfer({ ...transfer, toBmoniUserId: e.target.value })} /><Field label="Amount (CNGN)" type="number" min="0.01" step="0.01" value={transfer.amount} onChange={(e) => setTransfer({ ...transfer, amount: e.target.value })} /><Field label="Description" value={transfer.description} onChange={(e) => setTransfer({ ...transfer, description: e.target.value })} maxLength={180} /><button className="button primary" disabled={busy === 'transfer'}>{busy === 'transfer' ? 'Requesting…' : 'Create transfer approval'}</button></form><ResultCard title="Approval created" value={transferApproval} />
      </section>
    </div>

    <section className="backend-panel"><div className="section-title"><div><p className="eyebrow">WALLET ACTIVITY</p><h2>BMONI balances and transactions</h2><p className="muted small">Requires completed sandbox onboarding and a linked BMONI account.</p></div><button className="button outline" onClick={loadWalletActivity} disabled={busy === 'activity'}>{busy === 'activity' ? 'Refreshing…' : 'Refresh activity'}</button></div>
      <ErrorMessage>{refreshError}</ErrorMessage>
      {balances && <div className="activity-result"><h3>Balances</h3><pre>{JSON.stringify(balances, null, 2)}</pre></div>}
      {transactions && <div className="activity-result"><h3>Transactions</h3><pre>{JSON.stringify(transactions, null, 2)}</pre></div>}
      {!balances && !transactions && !refreshError && <p className="empty-state">Refresh to load the linked user's BMONI wallet activity.</p>}
    </section>
  </div>;
}
