import React, { useState } from 'react';
import { PersonalInfoForm } from '../components/PersonalInfoForm';
import { EducationForm } from '../components/EducationForm';
import { PreferencesForm } from '../components/PreferencesForm';
import { WorkExperienceForm } from '../components/WorkExperienceForm';
import { EligibilityResults } from '../components/EligibilityResults';
import { calculateEligibility } from '../utils/eligibility';
import { saveApplication, exportToExcel } from '../services/database';
import { useFormValidation } from '../hooks/useFormValidation';
import type { FormData } from '../types/form';

export const UserView: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      dateOfBirth: '',
    },
    previousEducationLevel: 'fsc',
    futureEducationLevel: 'bachelors',
    previousEducation: {
      degree: '',
      university: '',
      graduationYear: '',
      gradeType: 'cgpa',
      grade: 0,
    },
    preferences: {
      targetCountries: [],
    },
    workExperience: {
      hasExperience: false,
      years: 0,
      details: '',
    },
  });

  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validate, getFieldError } = useFormValidation(formData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const result = calculateEligibility(formData);
        setEligibilityResult(result);
        await saveApplication(formData, result);
      } catch (error) {
        console.error('Error saving application:', error);
        alert('There was an error saving your application. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleExport = async () => {
    try {
      await exportToExcel();
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('There was an error exporting the data. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Scholarship Eligibility Assessment</h1>
        <p className="text-gray-600 mt-2">Fill out the form below to check your eligibility</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <PersonalInfoForm
            formData={formData.personalInfo}
            onChange={(field, value) =>
              handleFieldChange('personalInfo', { ...formData.personalInfo, [field]: value })
            }
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <EducationForm
            formData={{
              previousEducationLevel: formData.previousEducationLevel,
              futureEducationLevel: formData.futureEducationLevel,
              ...formData.previousEducation,
            }}
            onChange={(field, value) => {
              if (field === 'previousEducationLevel' || field === 'futureEducationLevel') {
                handleFieldChange(field, value);
              } else {
                handleFieldChange('previousEducation', {
                  ...formData.previousEducation,
                  [field]: value,
                });
              }
            }}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <PreferencesForm
            selectedCountries={formData.preferences.targetCountries}
            onChange={(countries) =>
              handleFieldChange('preferences', { targetCountries: countries })
            }
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <WorkExperienceForm
            formData={formData.workExperience}
            onChange={(field, value) =>
              handleFieldChange('workExperience', {
                ...formData.workExperience,
                [field]: value,
              })
            }
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Check Eligibility'}
          </button>
        </div>

        {eligibilityResult && (
          <EligibilityResults
            result={eligibilityResult}
            formData={formData}
            onExport={handleExport}
          />
        )}
      </form>
    </div>
  );
};