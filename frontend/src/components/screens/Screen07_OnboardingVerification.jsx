import React, { useState, useRef } from 'react';
import { useRouter } from '../../router/Router.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { onboardingService } from '../../api/onboarding.js';
import { Header } from '../common/Header.jsx';
import { Select } from '../common/Select.jsx';
import { Button } from '../common/Button.jsx';
import { OnboardingProgress } from './Screen05_OnboardingPersonal.jsx';

export function Screen07_OnboardingVerification() {
  const { navigate } = useRouter();
  const { onboardingData, updateOnboardingData } = useAuth();
  const fileInputRef = useRef(null);

  const [idType, setIdType] = useState(onboardingData.idType || 'Student ID Card');
  const [selectedFile, setSelectedFile] = useState(onboardingData.documentFile || null);
  const [fileName, setFileName] = useState(onboardingData.documentFileName || 'unilag_student_id.jpg');
  const [fileSize, setFileSize] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    // Validation: Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit. Please upload a smaller file.');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload a JPG, PNG, or PDF.');
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileName('');
    setFileSize(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (!fileName && !selectedFile) {
      setError('Please upload your student document before proceeding.');
      return;
    }

    setUploading(true);
    setError('');
    try {
      if (selectedFile) {
        await onboardingService.uploadDocument(selectedFile, idType);
      }
      updateOnboardingData({
        documentFile: selectedFile,
        documentFileName: fileName || 'unilag_student_id.jpg',
        idType,
      });
      navigate('/onboarding/financial-profile');
    } catch (err) {
      setError(err.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="screen screen--onboarding">
      <Header showBack onBack={() => navigate('/onboarding/institution')} />

      <div className="onboarding-card">
        <OnboardingProgress currentStep={3} totalSteps={6} label="Verification" />

        <div className="onboarding-header">
          <h1 className="onboarding-title">Upload your document</h1>
          <p className="onboarding-subtitle">
            Upload a clear photo of your student ID to verify your campus standing.
          </p>
        </div>

        {error && (
          <div className="alert-box alert-box--error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleNext} className="onboarding-form" noValidate>
          {/* Upload Dropzone */}
          <div
            className={`upload-dropzone ${fileName ? 'upload-dropzone--has-file' : ''}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              style={{ display: 'none' }}
            />

            <div className="upload-dropzone__icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#20334a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <div className="upload-dropzone__text">
              <strong>Tap to upload</strong>
              <span>JPG, PNG or PDF (Max 5MB)</span>
            </div>
          </div>

          {fileName && (
            <div className="selected-file-badge">
              <div className="selected-file-badge__info">
                <span className="selected-file-badge__icon">📄</span>
                <div>
                  <div className="selected-file-badge__name">{fileName}</div>
                  {fileSize && <div className="selected-file-badge__size">{fileSize}</div>}
                </div>
              </div>
              <button
                type="button"
                className="selected-file-badge__remove"
                onClick={handleRemoveFile}
                aria-label="Remove uploaded file"
              >
                ✕
              </button>
            </div>
          )}

          <Select
            label="ID type"
            name="idType"
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            options={[
              'Student ID Card',
              'JAMB Admission Letter',
              'Official Course Registration Form',
              'Semester Examination Slip',
            ]}
            required
          />

          <div className="onboarding-actions">
            <Button
              type="submit"
              variant="primary-navy"
              size="lg"
              loading={uploading}
            >
              Next
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => navigate('/onboarding/institution')}
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
