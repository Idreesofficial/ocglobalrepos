import { nanoid } from 'nanoid';

const API_URL = import.meta.env.PROD 
  ? '/api'  // This will be redirected to /.netlify/functions/server by netlify.toml
  : import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const saveApplication = async (formData: any, eligibilityResult: any) => {
  try {
    const response = await fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData,
        eligibilityResult,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save application');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving application:', error);
    throw error;
  }
};

export const getAllApplications = async () => {
  try {
    const response = await fetch(`${API_URL}/applications`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch applications');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};