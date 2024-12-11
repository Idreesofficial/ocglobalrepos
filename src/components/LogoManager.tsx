import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { updateLogo, getLogo } from '../services/database';

export const LogoManager: React.FC = () => {
  const [logo, setLogo] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const currentLogo = await getLogo();
      setLogo(currentLogo);
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 500000) { // 500KB limit
      alert('File size should be less than 500KB');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        await updateLogo(base64String);
        setLogo(base64String);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Please try again.');
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (window.confirm('Are you sure you want to remove the logo?')) {
      try {
        await updateLogo('');
        setLogo('');
      } catch (error) {
        console.error('Error removing logo:', error);
        alert('Failed to remove logo. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Logo Management</h2>
      
      <div className="space-y-4">
        {logo && (
          <div className="relative inline-block">
            <img src={logo} alt="Current Logo" className="h-20 w-auto object-contain" />
            <button
              onClick={handleRemoveLogo}
              className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload New Logo
          </label>
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Upload size={18} className="mr-2" />
              Choose File
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={isUploading}
              />
            </label>
            {isUploading && (
              <span className="text-sm text-gray-500">Uploading...</span>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Recommended: PNG or SVG format, max 500KB
          </p>
        </div>
      </div>
    </div>
  );
};