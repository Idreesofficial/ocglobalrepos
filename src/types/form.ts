export type PreviousEducationLevel = 'fsc' | 'alevel' | 'bachelors' | 'masters';
export type FutureEducationLevel = 'bachelors' | 'masters' | 'phd';

export interface FormData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    dateOfBirth: string;
  };
  previousEducationLevel: PreviousEducationLevel;
  futureEducationLevel: FutureEducationLevel;
  previousEducation: {
    degree: string;
    university: string;
    graduationYear: string;
    gradeType: 'cgpa' | 'percentage';
    grade: number;
  };
  preferences: {
    targetCountries: string[];
  };
  workExperience: {
    hasExperience: boolean;
    years: number;
    details: string;
  };
}