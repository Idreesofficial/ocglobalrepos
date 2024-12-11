import { FormData } from '../types/form';

export interface ValidationError {
  field: string;
  message: string;
}

export const validatePersonalInfo = (data: FormData['personalInfo']): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!data.fullName.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required' });
  }
  
  if (!data.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }
  
  if (!data.phone.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  }
  
  if (!data.country.trim()) {
    errors.push({ field: 'country', message: 'Country is required' });
  }
  
  if (!data.city.trim()) {
    errors.push({ field: 'city', message: 'City is required' });
  }
  
  return errors;
};

export const validateEducation = (data: FormData['previousEducation']): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!data.degree.trim()) {
    errors.push({ field: 'degree', message: 'Degree is required' });
  }
  
  if (!data.university.trim()) {
    errors.push({ field: 'university', message: 'University is required' });
  }
  
  if (!data.graduationYear) {
    errors.push({ field: 'graduationYear', message: 'Graduation year is required' });
  } else {
    const year = parseInt(data.graduationYear);
    const currentYear = new Date().getFullYear();
    if (year > currentYear) {
      errors.push({ field: 'graduationYear', message: 'Graduation year cannot be in the future' });
    }
  }
  
  if (data.grade === 0) {
    errors.push({ field: 'grade', message: 'Grade is required' });
  } else if (data.gradeType === 'cgpa' && (data.grade < 0 || data.grade > 4.0)) {
    errors.push({ field: 'grade', message: 'CGPA must be between 0 and 4.0' });
  } else if (data.gradeType === 'percentage' && (data.grade < 0 || data.grade > 100)) {
    errors.push({ field: 'grade', message: 'Percentage must be between 0 and 100' });
  }
  
  return errors;
};

export const validatePreferences = (data: FormData['preferences']): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (data.targetCountries.length === 0) {
    errors.push({ field: 'targetCountries', message: 'Please select at least one country' });
  }
  
  return errors;
};

export const validateWorkExperience = (data: FormData['workExperience']): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (data.hasExperience) {
    if (!data.years || data.years < 0) {
      errors.push({ field: 'years', message: 'Please enter valid years of experience' });
    }
    if (!data.details?.trim()) {
      errors.push({ field: 'details', message: 'Please provide experience details' });
    }
  }
  
  return errors;
};