/**
 * LMONI Onboarding Service
 */
import { request, isLiveBackendConfigured } from './client.js';

export const onboardingService = {
  async submitOnboarding(onboardingData) {
    if (isLiveBackendConfigured) {
      try {
        return await request('/onboarding/complete', {
          method: 'POST',
          body: JSON.stringify(onboardingData),
        });
      } catch (err) {
        if (err.status !== 0) throw err;
      }
    }

    // Demo Simulation
    await new Promise((r) => setTimeout(r, 500));
    return {
      success: true,
      verified: true,
      studentStatus: 'Verified',
      institution: onboardingData.institutionName || 'University of Lagos',
      studentId: onboardingData.studentId || '25/ENG/1517',
      verificationDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      isDemo: true,
    };
  },

  async uploadDocument(file, idType) {
    if (isLiveBackendConfigured) {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('idType', idType);
      try {
        return await request('/onboarding/upload-document', {
          method: 'POST',
          headers: {}, // let browser set boundary
          body: formData,
        });
      } catch (err) {
        if (err.status !== 0) throw err;
      }
    }

    // Demo validation & upload simulation
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds 5MB limit.');
    }
    await new Promise((r) => setTimeout(r, 400));
    return {
      success: true,
      fileName: file.name,
      fileSize: file.size,
      idType,
      status: 'Uploaded (Pending review)',
      isDemo: true,
    };
  },
};
