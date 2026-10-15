import React, { createContext, useContext, useState } from 'react';
import { authService } from '../api/auth.js';
import { onboardingService } from '../api/onboarding.js';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: 'usr_adekunle_01',
  fullName: 'Adekunle Johnson',
  emailOrPhone: 'adekunle.johnson@unilag.edu.ng',
  institution: 'University of Lagos',
  studentId: '25/ENG/1517',
  course: 'Mechanical Engineering',
  level: '300 Level',
  gender: 'Male',
  dob: '2003-08-14',
  isVerified: true,
  verificationDate: 'Apr 24, 2025',
  monthlyIncome: 45000,
  monthlyExpenses: 22000,
  existingObligations: 0,
};

const INITIAL_ONBOARDING = {
  fullName: 'Adekunle Johnson',
  dob: '2003-08-14',
  gender: 'Male',
  institutionName: 'University of Lagos',
  studentId: '25/ENG/1517',
  course: 'Mechanical Engineering',
  level: '300 Level',
  documentFile: null,
  documentFileName: '',
  idType: 'Student ID Card',
  monthlyIncome: 45000,
  monthlyExpenses: 22000,
  existingObligations: 0,
  consentAgreed: false,
  privacyAgreed: false,
  withdrawalUnderstood: false,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('lmoni_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('lmoni_token') || true); // authenticated by default for quick reviewer flow, but fully signoutable
  });

  const [onboardingData, setOnboardingData] = useState(() => {
    try {
      const saved = localStorage.getItem('lmoni_onboarding');
      return saved ? JSON.parse(saved) : INITIAL_ONBOARDING;
    } catch {
      return INITIAL_ONBOARDING;
    }
  });

  const updateOnboardingData = (fields) => {
    setOnboardingData((prev) => {
      const updated = { ...prev, ...fields };
      // avoid serializing File objects to localStorage
      const { documentFile: _unused, ...serializable } = updated;
      try {
        localStorage.setItem('lmoni_onboarding', JSON.stringify(serializable));
      } catch (err) {
        console.warn('LocalStorage save failed', err);
      }
      return updated;
    });
  };

  const login = async (emailOrPhone, password) => {
    const res = await authService.login(emailOrPhone, password);
    if (res.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      localStorage.setItem('lmoni_user', JSON.stringify(res.user));
      localStorage.setItem('lmoni_token', res.token);
    }
    return res;
  };

  const signUp = async (emailOrPhone, password) => {
    const res = await authService.signUp(emailOrPhone, password);
    if (res.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      localStorage.setItem('lmoni_user', JSON.stringify(res.user));
      localStorage.setItem('lmoni_token', res.token);
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('lmoni_token');
    localStorage.removeItem('lmoni_user');
  };

  const completeOnboarding = async () => {
    const res = await onboardingService.submitOnboarding(onboardingData);
    const updatedUser = {
      ...user,
      ...onboardingData,
      isVerified: true,
      verificationDate: res.verificationDate || 'Apr 24, 2025',
    };
    setUser(updatedUser);
    setIsAuthenticated(true);
    localStorage.setItem('lmoni_user', JSON.stringify(updatedUser));
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        onboardingData,
        updateOnboardingData,
        login,
        signUp,
        logout,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
