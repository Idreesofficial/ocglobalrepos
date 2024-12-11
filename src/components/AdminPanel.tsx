import React, { useEffect, useState } from 'react';
import { Download, FileSpreadsheet, Printer, Trash2 } from 'lucide-react';
import { getAllApplications, ApplicationData, exportToExcel, deleteApplication } from '../services/database';
import { generatePDF } from '../utils/print';
import { AdminManagement } from './AdminManagement';
import { LogoManager } from './LogoManager';
import { BulkDeleteModal } from './BulkDeleteModal';

interface AdminPanelProps {
  isSuper: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isSuper }) => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [activeTab, setActiveTab] = useState<'applications' | 'admins' | 'settings'>('applications');
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    const data = await getAllApplications();
    setApplications(data.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleExportExcel = async () => {
    try {
      await exportToExcel();
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error exporting to Excel. Please try again.');
    }
  };

  const handlePrintApplication = async (application: ApplicationData) => {
    try {
      await generatePDF(application.formData, application.eligibilityResult);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleDeleteApplication = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApplication(id);
        await loadApplications();
      } catch (error) {
        console.error('Error deleting application:', error);
        alert('Error deleting application. Please try again.');
      }
    }
  };

  const renderApplicationsContent = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Applications</h2>
        <div className="flex space-x-3">
          {isSuper && (
            <button
              onClick={() => setShowBulkDeleteModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 size={20} />
              <span>Bulk Delete</span>
            </button>
          )}
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FileSpreadsheet size={20} />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-lg">{app.formData.personalInfo.fullName}</p>
                <p className="text-sm text-gray-500">Application Code: {app.applicationCode}</p>
                <p className="text-sm text-gray-600">
                  {new Date(app.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePrintApplication(app)}
                  className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Printer size={16} />
                  <span>Print</span>
                </button>
                {isSuper && (
                  <button
                    onClick={() => handleDeleteApplication(app.id!)}
                    className="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Education Details</h3>
                <p><strong>Previous Level:</strong> {app.formData.previousEducationLevel}</p>
                <p><strong>Future Level:</strong> {app.formData.futureEducationLevel}</p>
                <p><strong>Degree Title / Major:</strong> {app.formData.previousEducation.degree}</p>
                <p><strong>University:</strong> {app.formData.previousEducation.university}</p>
                <p><strong>Grade:</strong> {app.formData.previousEducation.grade} ({app.formData.previousEducation.gradeType})</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Eligibility Status</h3>
                <span className={`px-2 py-1 rounded text-sm ${
                  app.eligibilityResult.eligible 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {app.eligibilityResult.eligible ? 'Eligible' : 'Not Eligible'}
                </span>
                {app.eligibilityResult.eligible && (
                  <>
                    <p className="mt-2"><strong>Type:</strong> {app.eligibilityResult.type}</p>
                    <p><strong>Chance:</strong> {app.eligibilityResult.chance}</p>
                    <p><strong>Countries:</strong> {app.eligibilityResult.countries?.join(', ')}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      {isSuper && (
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'admins'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Admin Management
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
      )}

      {activeTab === 'applications' ? (
        renderApplicationsContent()
      ) : activeTab === 'admins' ? (
        <AdminManagement />
      ) : (
        <LogoManager />
      )}

      {showBulkDeleteModal && (
        <BulkDeleteModal
          isOpen={showBulkDeleteModal}
          onClose={() => setShowBulkDeleteModal(false)}
          onDelete={loadApplications}
        />
      )}
    </div>
  );
};