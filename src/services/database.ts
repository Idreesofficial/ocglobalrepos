import { getAllApplications as fetchApplications, saveApplication as saveApplicationAPI } from './api';
import { FormData } from '../types/form';
import * as XLSX from 'xlsx';

// Application Management
export const saveApplication = async (formData: FormData, eligibilityResult: any) => {
  try {
    return await saveApplicationAPI(formData, eligibilityResult);
  } catch (error) {
    console.error('Error saving application:', error);
    throw error;
  }
};

export const getAllApplications = async () => {
  try {
    return await fetchApplications();
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const deleteApplication = async (id: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/applications/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete application');
    }
    return true;
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
};

export const exportToExcel = async () => {
  try {
    const applications = await getAllApplications();
    
    const workbookData = applications.map(app => ({
      'Application Code': app.applicationCode,
      'Submission Date': new Date(app.timestamp).toLocaleString(),
      'Full Name': app.formData.personalInfo.fullName,
      'Date of Birth': app.formData.personalInfo.dateOfBirth,
      'Email': app.formData.personalInfo.email,
      'Phone': app.formData.personalInfo.phone,
      'Country': app.formData.personalInfo.country,
      'City': app.formData.personalInfo.city,
      'Previous Education Level': app.formData.previousEducationLevel,
      'Future Education Level': app.formData.futureEducationLevel,
      'Degree Title / Major': app.formData.previousEducation.degree,
      'University': app.formData.previousEducation.university,
      'Graduation Year': app.formData.previousEducation.graduationYear,
      'Grade Type': app.formData.previousEducation.gradeType,
      'Grade': app.formData.previousEducation.grade,
      'Target Countries': app.formData.preferences.targetCountries.join(', '),
      'Has Work Experience': app.formData.workExperience?.hasExperience ? 'Yes' : 'No',
      'Years of Experience': app.formData.workExperience?.years || 'N/A',
      'Experience Details': app.formData.workExperience?.details || 'N/A',
      'Eligibility Status': app.eligibilityResult.eligible ? 'Eligible' : 'Not Eligible',
      'Scholarship Type': app.eligibilityResult.type || 'N/A',
      'Success Chance': app.eligibilityResult.chance || 'N/A',
      'Eligible Countries': app.eligibilityResult.countries?.join(', ') || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(workbookData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
    
    XLSX.writeFile(workbook, 'scholarship-applications.xlsx');
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export to Excel');
  }
};

// Admin Management
export const addAdmin = async (adminData: any) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add admin');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding admin:', error);
    throw error;
  }
};

export const getAllAdmins = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admins`);
    if (!response.ok) {
      throw new Error('Failed to fetch admins');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw error;
  }
};

export const deleteAdmin = async (id: number) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admins/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete admin');
    }
    return true;
  } catch (error) {
    console.error('Error deleting admin:', error);
    throw error;
  }
};

export const updateAdmin = async (id: number, data: any) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admins/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update admin');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating admin:', error);
    throw error;
  }
};

export const verifyAdmin = async (email: string, password: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admins/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error verifying admin:', error);
    return null;
  }
};

// Logo Management
export const updateLogo = async (logoData: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/logo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ logo: logoData }),
    });
    if (!response.ok) {
      throw new Error('Failed to update logo');
    }
    return true;
  } catch (error) {
    console.error('Error updating logo:', error);
    throw error;
  }
};

export const getLogo = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/logo`);
    if (!response.ok) {
      throw new Error('Failed to fetch logo');
    }
    const data = await response.json();
    return data.logo;
  } catch (error) {
    console.error('Error fetching logo:', error);
    return null;
  }
};

// Bulk Delete Applications
export const bulkDeleteApplications = async (
  startDate?: Date,
  endDate?: Date,
  eligibilityStatus?: boolean
) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    if (eligibilityStatus !== undefined) params.append('eligibilityStatus', String(eligibilityStatus));

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/applications/bulk-delete?${params.toString()}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete applications');
    }

    const data = await response.json();
    return data.deletedCount;
  } catch (error) {
    console.error('Error bulk deleting applications:', error);
    throw error;
  }
};