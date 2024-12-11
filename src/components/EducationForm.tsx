import React from 'react';
import { PreviousEducationLevel, FutureEducationLevel } from '../types/form';

interface EducationFormProps {
  formData: {
    previousEducationLevel: PreviousEducationLevel;
    futureEducationLevel: FutureEducationLevel;
    degree: string;
    university: string;
    graduationYear: string;
    gradeType: 'cgpa' | 'percentage';
    grade: number;
  };
  onChange: (field: string, value: any) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ formData, onChange }) => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 50;
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Education Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Previous Education Level</label>
          <select
            value={formData.previousEducationLevel}
            onChange={(e) => onChange('previousEducationLevel', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="fsc">FSc (Intermediate)</option>
            <option value="alevel">A-Level</option>
            <option value="bachelors">Bachelors</option>
            <option value="masters">Masters</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Future Education Level</label>
          <select
            value={formData.futureEducationLevel}
            onChange={(e) => onChange('futureEducationLevel', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="bachelors">Bachelors</option>
            <option value="masters">Masters</option>
            <option value="phd">PhD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Degree Title / Major</label>
          <input
            type="text"
            value={formData.degree}
            onChange={(e) => onChange('degree', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder={formData.previousEducationLevel === 'fsc' ? 'e.g., Pre-Engineering, Pre-Medical' : 
                        formData.previousEducationLevel === 'alevel' ? 'e.g., Science, Commerce' : 
                        'Enter your degree title/major'}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Institution</label>
          <input
            type="text"
            value={formData.university}
            onChange={(e) => onChange('university', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Year of Completion</label>
          <input
            type="number"
            min={startYear}
            max={currentYear}
            value={formData.graduationYear}
            onChange={(e) => onChange('graduationYear', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Grade Type</label>
          <select
            value={formData.gradeType}
            onChange={(e) => onChange('gradeType', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="cgpa">CGPA (4.0 Scale)</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Grade</label>
          <input
            type="number"
            step={formData.gradeType === 'cgpa' ? '0.1' : '1'}
            min={formData.gradeType === 'cgpa' ? '0' : '0'}
            max={formData.gradeType === 'cgpa' ? '4.0' : '100'}
            value={formData.grade}
            onChange={(e) => onChange('grade', parseFloat(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};