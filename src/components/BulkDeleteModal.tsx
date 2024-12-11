import React, { useState } from 'react';
import { X } from 'lucide-react';
import { bulkDeleteApplications } from '../services/database';

interface BulkDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const BulkDeleteModal: React.FC<BulkDeleteModalProps> = ({ isOpen, onClose, onDelete }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [eligibilityStatus, setEligibilityStatus] = useState<string>('all');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete the selected applications? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        const status = eligibilityStatus === 'all' ? undefined : eligibilityStatus === 'eligible';
        const deleted = await bulkDeleteApplications(
          startDate ? new Date(startDate) : undefined,
          endDate ? new Date(endDate) : undefined,
          status
        );
        alert(`Successfully deleted ${deleted} applications`);
        onDelete();
        onClose();
      } catch (error) {
        console.error('Error deleting applications:', error);
        alert('Error deleting applications. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bulk Delete Applications</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Eligibility Status</label>
            <select
              value={eligibilityStatus}
              onChange={(e) => setEligibilityStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Applications</option>
              <option value="eligible">Eligible Only</option>
              <option value="not-eligible">Not Eligible Only</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Applications'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};