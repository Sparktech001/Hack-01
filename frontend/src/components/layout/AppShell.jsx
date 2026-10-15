import React from 'react';
import { useRouter } from '../../router/Router.jsx';
import { StatusBar } from '../common/StatusBar.jsx';
import { BottomNav } from '../common/BottomNav.jsx';

export function AppShell({ children }) {
  const { currentPath, navigate } = useRouter();

  // Determine if current screen displays bottom navigation
  const bottomNavRoutes = [
    '/home',
    '/pool',
    '/pool/statistics',
    '/borrow',
    '/ai-check',
    '/ai-check/score',
    '/transactions',
    '/profile',
  ];

  const showBottomNav = bottomNavRoutes.some((route) => currentPath === route || currentPath.startsWith(route));

  // Determine if status bar should be light/dark text based on screen
  const darkBackgroundRoutes = [
    '/welcome',
    '/verification/success',
  ];
  const isDarkScreen = darkBackgroundRoutes.includes(currentPath);

  return (
    <div className="app-viewport">
      {/* Top Demo Bar for Hackathon Reviewers to easily jump between screens */}
      <div className="demo-topbar">
        <div className="demo-topbar__inner">
          <span className="demo-topbar__badge">LMONI Demo Prototype</span>
          <span className="demo-topbar__route">{currentPath}</span>
          <select
            className="demo-topbar__select"
            value={currentPath}
            onChange={(e) => navigate(e.target.value)}
            aria-label="Quick jump to any screen"
          >
            <optgroup label="Authentication & Welcome">
              <option value="/welcome">Screen 1: Welcome / Splash</option>
              <option value="/signup">Screen 2: Sign Up</option>
              <option value="/login">Screen 3: Login</option>
              <option value="/forgot-password">Screen 4: Forgot Password</option>
            </optgroup>
            <optgroup label="Student Onboarding">
              <option value="/onboarding/personal">Screen 5: Personal Info (1/6)</option>
              <option value="/onboarding/institution">Screen 6: Institution (2/6)</option>
              <option value="/onboarding/verification">Screen 7: Document Upload (3/6)</option>
              <option value="/onboarding/financial-profile">Screen 8: Financial Profile (4/6)</option>
              <option value="/onboarding/consent">Screen 9: Consent & Privacy (5/6)</option>
              <option value="/verification/success">Screen 10: Verification Success</option>
            </optgroup>
            <optgroup label="Main App & Pool">
              <option value="/home">Screen 11: Home Dashboard</option>
              <option value="/pool">Screen 12: Pool Overview</option>
              <option value="/pool/terms">Screen 12b: Mandatory Pool Terms Gate</option>
              <option value="/pool/statistics">Screen 13: Pool Statistics & Chart</option>
            </optgroup>
            <optgroup label="Borrowing Flow">
              <option value="/borrow">Screen 14: Borrow - Apply</option>
              <option value="/borrow/eligibility">Screen 15: Borrow - Eligibility</option>
              <option value="/borrow/confirm">Screen 16: Borrow - Confirmation</option>
            </optgroup>
            <optgroup label="AI Check">
              <option value="/ai-check">Screen 17: AI Check Landing</option>
              <option value="/ai-check/score">Screen 18: AI Check Score</option>
            </optgroup>
            <optgroup label="Activity & Account">
              <option value="/transactions">Screen 19: Transactions</option>
              <option value="/profile">Screen 20: Profile & Settings</option>
              <option value="/notifications">Screen 25: Notifications</option>
              <option value="/terms">Screen 26: Expandable Terms</option>
            </optgroup>
            <optgroup label="System States">
              <option value="/state/success">Screen 21: Success State</option>
              <option value="/state/error">Screen 22: Error State</option>
              <option value="/state/loading">Screen 23: Loading State</option>
              <option value="/state/security">Screen 24: Security / Transaction Status</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Main Canvas Mobile Screen Frame */}
      <main className="mobile-frame" id="app-screen">
        <StatusBar light={isDarkScreen} />
        
        <div className={`screen-content ${showBottomNav ? 'screen-content--has-nav' : ''}`}>
          {children}
        </div>

        {showBottomNav && <BottomNav />}
      </main>
    </div>
  );
}
