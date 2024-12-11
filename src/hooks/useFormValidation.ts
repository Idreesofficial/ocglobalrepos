import { useState, useCallback } from 'react';
import { FormData } from '../types/form';
import {
  ValidationError,
  validatePersonalInfo,
  validateEducation,
  validatePreferences,
  validateWorkExperience
} from '../utils/validation';

export const useFormValidation = (formData: FormData) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validate = useCallback(() => {
    const allErrors = [
      ...validatePersonalInfo(formData.personalInfo),
      ...validateEducation(formData.previousEducation),
      ...validatePreferences(formData.preferences),
      ...(formData.educationLevel === 'masters' ? validateWorkExperience(formData.workExperience!) : [])
    ];

    setErrors(allErrors);
    return allErrors.length === 0;
  }, [formData]);

  const getFieldError = useCallback((field: string) => {
    return errors.find(error => error.field === field);
  }, [errors]);

  return {
    errors,
    validate,
    getFieldError,
    hasErrors: errors.length > 0
  };
};