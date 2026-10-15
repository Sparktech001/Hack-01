import React from 'react';
import { RouterProvider, useRouter } from './router/Router.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { AppStateProvider } from './context/AppStateContext.jsx';
import { AppShell } from './components/layout/AppShell.jsx';

import { Screen01_Welcome } from './components/screens/Screen01_Welcome.jsx';
import { Screen02_SignUp } from './components/screens/Screen02_SignUp.jsx';
import { Screen03_Login } from './components/screens/Screen03_Login.jsx';
import { Screen04_ForgotPassword } from './components/screens/Screen04_ForgotPassword.jsx';
import { Screen05_OnboardingPersonal } from './components/screens/Screen05_OnboardingPersonal.jsx';
import { Screen06_OnboardingInstitution } from './components/screens/Screen06_OnboardingInstitution.jsx';
import { Screen07_OnboardingVerification } from './components/screens/Screen07_OnboardingVerification.jsx';
import { Screen08_OnboardingFinancial } from './components/screens/Screen08_OnboardingFinancial.jsx';
import { Screen09_OnboardingConsent } from './components/screens/Screen09_OnboardingConsent.jsx';
import { Screen10_VerificationSuccess } from './components/screens/Screen10_VerificationSuccess.jsx';
import { Screen11_HomeDashboard } from './components/screens/Screen11_HomeDashboard.jsx';
import { Screen12_PoolOverview } from './components/screens/Screen12_PoolOverview.jsx';
import { Screen12_PoolTermsGate } from './components/screens/Screen12_PoolTermsGate.jsx';
import { Screen13_PoolDetails } from './components/screens/Screen13_PoolDetails.jsx';
import { Screen14_BorrowApply } from './components/screens/Screen14_BorrowApply.jsx';
import { Screen15_BorrowEligibility } from './components/screens/Screen15_BorrowEligibility.jsx';
import { Screen16_BorrowConfirmation } from './components/screens/Screen16_BorrowConfirmation.jsx';
import { Screen17_AICheckLanding } from './components/screens/Screen17_AICheckLanding.jsx';
import { Screen18_AICheckScore } from './components/screens/Screen18_AICheckScore.jsx';
import { Screen19_Transactions } from './components/screens/Screen19_Transactions.jsx';
import { Screen20_ProfileSettings } from './components/screens/Screen20_ProfileSettings.jsx';
import { Screen21_SuccessState } from './components/screens/Screen21_SuccessState.jsx';
import { Screen22_ErrorState } from './components/screens/Screen22_ErrorState.jsx';
import { Screen23_LoadingState } from './components/screens/Screen23_LoadingState.jsx';
import { Screen24_SecurityStatus } from './components/screens/Screen24_SecurityStatus.jsx';
import { Screen25_Notifications } from './components/screens/Screen25_Notifications.jsx';
import { Screen26_ExpandableTerms } from './components/screens/Screen26_ExpandableTerms.jsx';

import './styles/tokens.css';
import './App.css';

function AppRoutes() {
  const { currentPath } = useRouter();

  switch (currentPath) {
    case '/welcome':
      return <Screen01_Welcome />;
    case '/signup':
      return <Screen02_SignUp />;
    case '/login':
      return <Screen03_Login />;
    case '/forgot-password':
      return <Screen04_ForgotPassword />;
    case '/onboarding/personal':
      return <Screen05_OnboardingPersonal />;
    case '/onboarding/institution':
      return <Screen06_OnboardingInstitution />;
    case '/onboarding/verification':
      return <Screen07_OnboardingVerification />;
    case '/onboarding/financial-profile':
      return <Screen08_OnboardingFinancial />;
    case '/onboarding/consent':
      return <Screen09_OnboardingConsent />;
    case '/verification/success':
      return <Screen10_VerificationSuccess />;
    case '/home':
      return <Screen11_HomeDashboard />;
    case '/pool':
      return <Screen12_PoolOverview />;
    case '/pool/terms':
      return <Screen12_PoolTermsGate />;
    case '/pool/statistics':
      return <Screen13_PoolDetails />;
    case '/borrow':
      return <Screen14_BorrowApply />;
    case '/borrow/eligibility':
      return <Screen15_BorrowEligibility />;
    case '/borrow/confirm':
      return <Screen16_BorrowConfirmation />;
    case '/ai-check':
      return <Screen17_AICheckLanding />;
    case '/ai-check/score':
      return <Screen18_AICheckScore />;
    case '/transactions':
      return <Screen19_Transactions />;
    case '/profile':
      return <Screen20_ProfileSettings />;
    case '/state/success':
      return <Screen21_SuccessState />;
    case '/state/error':
      return <Screen22_ErrorState />;
    case '/state/loading':
      return <Screen23_LoadingState />;
    case '/state/security':
      return <Screen24_SecurityStatus />;
    case '/notifications':
      return <Screen25_Notifications />;
    case '/terms':
      return <Screen26_ExpandableTerms />;
    default:
      return <Screen01_Welcome />;
  }
}

export default function App() {
  return (
    <RouterProvider initialPath="/welcome">
      <AuthProvider>
        <AppStateProvider>
          <AppShell>
            <AppRoutes />
          </AppShell>
        </AppStateProvider>
      </AuthProvider>
    </RouterProvider>
  );
}
