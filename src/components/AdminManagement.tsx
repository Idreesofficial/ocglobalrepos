import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Key } from 'lucide-react';
import { getAllAdmins, addAdmin, deleteAdmin, updateAdmin } from '../services/database';

interface Admin {
  id?: number;
  email: string;
  password: string;
  name: string;
  role: 'super' | 'admin';
  createdAt: number;
}

export const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    name: '',
    role: 'admin' as const
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    const data = await getAllAdmins();
    setAdmins(data);
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAdmin(newAdmin);
      setShowAddForm(false);
      setNewAdmin({ email: '', password: '', name: '', role: 'admin' });
      loadAdmins();
    } catch (error) {
      setError('Failed to add admin. Email might already be in use.');
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      await deleteAdmin(id);
      loadAdmins();
    }
  };

  const handleUpdatePassword = async (id: number) => {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
      await updateAdmin(id, { password: newPassword });
      alert('Password updated successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Admin Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <UserPlus size={20} />
          <span>Add Admin</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Add New Admin</h3>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add Admin
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4 whitespace-nowrap">{admin.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    admin.role === 'super' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {admin.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {admin.role !== 'super' && (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleUpdatePassword(admin.id!)}
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="Change Password"
                      >
                        <Key size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(admin.id!)}
                        className="p-1 text-gray-600 hover:text-red-600"
                        title="Delete Admin"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};