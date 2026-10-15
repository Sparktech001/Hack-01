import React, { useState } from 'react';
import { useRouter } from '../../router/Router.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppState } from '../../context/AppStateContext.jsx';
import { Header } from '../common/Header.jsx';
import { VerifiedBadge } from '../common/Badge.jsx';
import { Button } from '../common/Button.jsx';
import { Modal } from '../common/Modal.jsx';
import { Input } from '../common/Input.jsx';

export function Screen20_ProfileSettings() {
  const { navigate } = useRouter();
  const { user, logout, updateOnboardingData } = useAuth();
  const { declinePoolTerms } = useAppState();

  const [activeModal, setActiveModal] = useState(null); // 'personal' | 'verification' | 'support' | 'settings'
  const [nameInput, setNameInput] = useState(user?.fullName || 'Adekunle Johnson');
  const [emailInput, setEmailInput] = useState(user?.emailOrPhone || 'adekunle.johnson@unilag.edu.ng');

  const fullName = user?.fullName || 'Adekunle Johnson';
  const initial = fullName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/welcome');
  };

  const handleResetDemoData = () => {
    localStorage.clear();
    declinePoolTerms();
    window.location.href = '/welcome';
  };

  return (
    <div className="screen screen--profile">
      <Header title="Profile & Settings" showBack={false} />

      <div className="profile-card">
        {/* User Hero Section matching Screen 20 */}
        <div className="profile-hero">
          <div className="profile-avatar">
            <span className="profile-avatar__letter">{initial}</span>
          </div>
          <h2 className="profile-name">{fullName}</h2>
          <div className="profile-badge">
            <VerifiedBadge label="Verified Student" />
          </div>
        </div>

        {/* Menu Navigation Items */}
        <div className="profile-menu">
          <button
            type="button"
            className="profile-menu-item"
            onClick={() => setActiveModal('personal')}
          >
            <div className="profile-menu-item__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="profile-menu-item__label">Personal Profile</span>
            <span className="profile-menu-item__arrow">›</span>
          </button>

          <button
            type="button"
            className="profile-menu-item"
            onClick={() => setActiveModal('verification')}
          >
            <div className="profile-menu-item__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <span className="profile-menu-item__label">Verification Profile</span>
            <span className="profile-menu-item__arrow">›</span>
          </button>

          <div className="profile-menu-item profile-menu-item--static">
            <div className="profile-menu-item__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28785c" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="profile-menu-item__label">Verification Status</span>
            <VerifiedBadge label="Verified" />
          </div>

          <button
            type="button"
            className="profile-menu-item"
            onClick={() => navigate('/notifications')}
          >
            <div className="profile-menu-item__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <span className="profile-menu-item__label">Notifications</span>
            <span className="profile-menu-item__arrow">›</span>
          </button>

          <button
            type="button"
            className="profile-menu-item"
            onClick={() => setActiveModal('support')}
          >
            <div className="profile-menu-item__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <span className="profile-menu-item__label">Help & Support</span>
            <span className="profile-menu-item__arrow">›</span>
          </button>

          <button
            type="button"
            className="profile-menu-item"
            onClick={() => setActiveModal('settings')}
          >
            <div className="profile-menu-item__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <span className="profile-menu-item__label">Settings</span>
            <span className="profile-menu-item__arrow">›</span>
          </button>
        </div>

        {/* Logout Red Outlined Button */}
        <div className="profile-logout-section">
          <Button
            variant="outline"
            size="md"
            className="btn--logout"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      </div>

      {/* Modals for Personal / Verification / Support / Settings */}
      <Modal
        isOpen={activeModal === 'personal'}
        onClose={() => setActiveModal(null)}
        title="Personal Profile"
      >
        <Input
          label="Full Name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <Input
          label="Email or Phone"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <div className="mt-4">
          <Button
            variant="primary-navy"
            onClick={() => {
              updateOnboardingData({ fullName: nameInput, emailOrPhone: emailInput });
              setActiveModal(null);
            }}
          >
            Save Changes
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'verification'}
        onClose={() => setActiveModal(null)}
        title="Student Verification Data"
      >
        <div className="verification-details-modal">
          <div className="meta-pair">
            <span className="text-secondary text-xs">Institution:</span>
            <strong>{user?.institution || 'University of Lagos'}</strong>
          </div>
          <div className="meta-pair mt-2">
            <span className="text-secondary text-xs">Student ID / Matric:</span>
            <strong className="font-mono">{user?.studentId || '25/ENG/1517'}</strong>
          </div>
          <div className="meta-pair mt-2">
            <span className="text-secondary text-xs">Course:</span>
            <strong>{user?.course || 'Mechanical Engineering'}</strong>
          </div>
          <div className="meta-pair mt-2">
            <span className="text-secondary text-xs">Level:</span>
            <strong>{user?.level || '300 Level'}</strong>
          </div>
          <div className="meta-pair mt-2">
            <span className="text-secondary text-xs">Verification Status:</span>
            <VerifiedBadge label="Verified Student (Demo)" />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'support'}
        onClose={() => setActiveModal(null)}
        title="Campus Peer Support"
      >
        <p className="text-secondary text-sm">
          Have questions regarding pool repayments, peer liquidity or student ID verification?
        </p>
        <div className="support-contact-box mt-3">
          <div>📧 <strong>support@lmoni.ng</strong></div>
          <div className="mt-1">💬 WhatsApp: <strong>+234 812 000 LMONI</strong></div>
          <div className="mt-1">🏫 Campus Desk: UNILAG Student Union Building</div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        title="Prototype Settings"
      >
        <p className="text-secondary text-sm mb-3">
          Manage local demo state and prototype preferences.
        </p>
        <Button variant="outline" onClick={handleResetDemoData}>
          Reset All Prototype Data & Local Storage
        </Button>
      </Modal>
    </div>
  );
}
