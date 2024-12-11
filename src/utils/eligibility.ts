import { FormData } from '../types/form';

export const calculateEligibility = (formData: FormData) => {
  const { futureEducationLevel, previousEducation, workExperience } = formData;
  const { grade, gradeType, graduationYear } = previousEducation;
  
  const currentYear = new Date().getFullYear();
  const gapYears = currentYear - parseInt(graduationYear);
  
  if (futureEducationLevel === 'bachelors') {
    if (gapYears > 2) return { eligible: false, message: 'Not eligible due to gap years exceeding 2 years' };
    
    if (gradeType === 'percentage') {
      if (grade >= 95) return { eligible: true, type: 'Fully Funded', countries: ['UK', 'USA', 'Turkey', 'Canada', 'Australia'] };
      if (grade >= 65) return { eligible: true, type: 'Partial/Self-Funded', countries: ['UK', 'USA', 'Turkey', 'Canada', 'Australia'] };
      if (grade >= 55) return { eligible: true, type: 'Partial/Self-Funded', countries: ['Turkey'] };
      return { eligible: false, message: 'Not eligible due to low grades' };
    }
  }

  if (futureEducationLevel === 'masters') {
    if (gapYears > 2 && !workExperience?.hasExperience) {
      return { eligible: false, message: 'Not eligible due to gap years without work experience' };
    }

    if (gradeType === 'cgpa') {
      if (grade >= 3.8) return { eligible: true, type: 'Fully Funded', chance: 'High', countries: ['UK', 'USA', 'Turkey', 'Canada', 'Australia'] };
      if (grade >= 3.5) return { eligible: true, type: 'Partial Funded', chance: 'Fair', countries: ['UK', 'USA', 'Turkey', 'Canada', 'Australia'] };
      if (grade >= 2.7) return { eligible: true, type: 'Partial/Self-Funded', chance: 'Low', countries: ['UK', 'USA', 'Turkey', 'Canada', 'Australia'] };
      if (grade >= 2.3) return { eligible: true, type: 'Self-Funded', countries: ['Turkey'] };
      return { eligible: false, message: 'Not eligible due to low CGPA' };
    }
  }

  if (futureEducationLevel === 'phd') {
    if (gradeType === 'cgpa') {
      if (grade >= 3.5) return { eligible: true, type: 'Fully Funded', chance: 'High', countries: ['UK', 'USA', 'Turkey', 'Canada', 'Australia'] };
      if (grade >= 3.0) return { eligible: true, type: 'Partial Funded', chance: 'Fair', countries: ['UK', 'USA', 'Turkey', 'Canada', 'Australia'] };
      return { eligible: false, message: 'Not eligible due to low CGPA' };
    }
  }

  return { eligible: false, message: 'Unable to determine eligibility' };
};