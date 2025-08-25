import LogoutButton from '@/components/LogoutButton';
import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 pt-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
            <div className="text-center pt-8">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <LogoutButton/>
              <p className="mt-2 text-gray-600">Welcome to the admin portal</p>
            </div>
            {/* Add admin-specific components here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;