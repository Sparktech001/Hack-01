/**
 * LMONI Authentication Service
 */
import { request, isLiveBackendConfigured } from './client.js';

export const authService = {
  async signUp(emailOrPhone, password) {
    if (isLiveBackendConfigured) {
      try {
        return await request('/auth/signup', {
          method: 'POST',
          body: JSON.stringify({ emailOrPhone, password }),
        });
      } catch (err) {
        // If server fails or endpoint doesn't exist, propagate or fallback in development
        if (err.status !== 0) throw err;
      }
    }

    // Demo Simulation
    await new Promise((r) => setTimeout(r, 400));
    return {
      success: true,
      user: {
        id: 'usr_demo_101',
        emailOrPhone,
        fullName: 'Adekunle Johnson',
        institution: 'University of Lagos',
        studentId: '25/ENG/1517',
        isVerified: true,
        verificationDate: 'Apr 24, 2025',
      },
      token: 'demo_token_lmoni_jwt',
      isDemo: true,
    };
  },

  async login(emailOrPhone, password) {
    if (isLiveBackendConfigured) {
      try {
        return await request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ emailOrPhone, password }),
        });
      } catch (err) {
        if (err.status !== 0) throw err;
      }
    }

    // Demo Simulation
    await new Promise((r) => setTimeout(r, 400));
    return {
      success: true,
      user: {
        id: 'usr_demo_101',
        emailOrPhone,
        fullName: 'Adekunle Johnson',
        institution: 'University of Lagos',
        studentId: '25/ENG/1517',
        isVerified: true,
        verificationDate: 'Apr 24, 2025',
      },
      token: 'demo_token_lmoni_jwt',
      isDemo: true,
    };
  },

  async forgotPassword(emailOrPhone) {
    if (isLiveBackendConfigured) {
      try {
        return await request('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ emailOrPhone }),
        });
      } catch (err) {
        if (err.status !== 0) throw err;
      }
    }

    // Demo Simulation
    await new Promise((r) => setTimeout(r, 350));
    return {
      success: true,
      message: 'Password reset link sent to registered email/phone',
      isDemo: true,
    };
  },
};
