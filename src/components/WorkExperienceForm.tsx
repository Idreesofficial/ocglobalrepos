import React from 'react';

interface WorkExperienceFormProps {
  formData: {
    hasExperience: boolean;
    years?: number;
    details?: string;
  };
  onChange: (field: string, value: any) => void;
}

export const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Work Experience</h2>
      
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.hasExperience}
            onChange={(e) => onChange('hasExperience', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>I have relevant work experience</span>
        </label>
      </div>

      {formData.hasExperience && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
            <input
              type="number"
              min="0"
              value={formData.years}
              onChange={(e) => onChange('years', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Experience Details</label>
            <textarea
              value={formData.details}
              onChange={(e) => onChange('details', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Describe your relevant work experience..."
            />
          </div>
        </div>
      )}
    </div>
  );
};