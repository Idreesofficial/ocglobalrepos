import React from 'react';
import { Download, Printer } from 'lucide-react';
import { generatePDF } from '../utils/print';
import { FormData } from '../types/form';

interface EligibilityResult {
  eligible: boolean;
  type?: string;
  chance?: string;
  countries?: string[];
  message?: string;
}

interface EligibilityResultsProps {
  result: EligibilityResult;
  formData: FormData;
  onExport: () => void;
}

export const EligibilityResults: React.FC<EligibilityResultsProps> = ({ result, formData, onExport }) => {
  const handlePrint = async () => {
    try {
      await generatePDF(formData, result);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (!result) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Eligibility Results</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Printer size={20} />
            <span>Print PDF</span>
          </button>
          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download size={20} />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      {result.eligible ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-800 font-medium">You are eligible!</p>
          </div>

          {result.type && (
            <div>
              <h3 className="font-medium text-gray-700">Scholarship Type:</h3>
              <p className="text-gray-800">{result.type}</p>
            </div>
          )}

          {result.chance && (
            <div>
              <h3 className="font-medium text-gray-700">Success Chance:</h3>
              <p className="text-gray-800">{result.chance}</p>
            </div>
          )}

          {result.countries && result.countries.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-700">Eligible Countries:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.countries.map((country) => (
                  <span
                    key={country}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{result.message || 'Not eligible for scholarships'}</p>
        </div>
      )}
    </div>
  );
};