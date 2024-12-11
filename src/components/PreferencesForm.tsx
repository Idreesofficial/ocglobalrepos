import React from 'react';

const AVAILABLE_COUNTRIES = ['UK', 'USA', 'Turkey', 'Canada', 'Australia'];

interface PreferencesFormProps {
  selectedCountries: string[];
  onChange: (countries: string[]) => void;
}

export const PreferencesForm: React.FC<PreferencesFormProps> = ({ selectedCountries, onChange }) => {
  const handleCountryChange = (country: string) => {
    if (selectedCountries.includes(country)) {
      onChange(selectedCountries.filter((c) => c !== country));
    } else {
      onChange([...selectedCountries, country]);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Study Preferences</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Target Countries
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {AVAILABLE_COUNTRIES.map((country) => (
            <label key={country} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCountries.includes(country)}
                onChange={() => handleCountryChange(country)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{country}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};