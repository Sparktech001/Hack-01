import React, { useState } from 'react';
import { useRouter } from '../../router/Router.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Header } from '../common/Header.jsx';
import { Input } from '../common/Input.jsx';
import { Select } from '../common/Select.jsx';
import { Button } from '../common/Button.jsx';
import { OnboardingProgress } from './Screen05_OnboardingPersonal.jsx';

export function Screen06_OnboardingInstitution() {
  const { navigate } = useRouter();
  const { onboardingData, updateOnboardingData } = useAuth();

  const [institutionName, setInstitutionName] = useState(onboardingData.institutionName || 'University of Lagos');
  const [studentId, setStudentId] = useState(onboardingData.studentId || '25/ENG/1517');
  const [course, setCourse] = useState(onboardingData.course || 'Mechanical Engineering');
  const [level, setLevel] = useState(onboardingData.level || '300 Level');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!institutionName.trim()) errs.institutionName = 'Institution name is required';
    if (!studentId.trim()) errs.studentId = 'Student ID / Matriculation number is required';
    if (!course) errs.course = 'Course of study is required';
    if (!level) errs.level = 'Academic level is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!validate()) return;

    updateOnboardingData({ institutionName, studentId, course, level });
    navigate('/onboarding/verification');
  };

  return (
    <div className="screen screen--onboarding">
      <Header showBack onBack={() => navigate('/onboarding/personal')} />

      <div className="onboarding-card">
        <OnboardingProgress currentStep={2} totalSteps={6} label="Institution Details" />

        <div className="onboarding-header">
          <h1 className="onboarding-title">Tell us about your institution</h1>
          <p className="onboarding-subtitle">Your campus affiliation unlocks your peer lending community.</p>
        </div>

        <form onSubmit={handleNext} className="onboarding-form" noValidate>
          <Input
            label="Institution name"
            name="institutionName"
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
            placeholder="e.g. University of Lagos"
            error={errors.institutionName}
            required
          />

          <Input
            label="Student ID number / Matric no."
            name="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g. 25/ENG/1517"
            error={errors.studentId}
            required
          />

          <Select
            label="Course of study"
            name="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            options={[
              'Mechanical Engineering',
              'Computer Science',
              'Economics & Finance',
              'Law',
              'Medicine & Surgery',
              'Accounting',
              'Mass Communication',
              'Electrical & Electronics Engineering',
            ]}
            error={errors.course}
            required
          />

          <Select
            label="Academic level"
            name="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            options={[
              '100 Level (Freshman)',
              '200 Level',
              '300 Level',
              '400 Level',
              '500 Level',
              'Postgraduate',
            ]}
            error={errors.level}
            required
          />

          <div className="onboarding-actions">
            <Button type="submit" variant="primary-navy" size="lg">
              Next
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => navigate('/onboarding/personal')}
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
