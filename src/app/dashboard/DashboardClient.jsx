'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import UserManagementTab from './User';
import RoleManagementTab from './Roles';

const tabs = [
  { id: 1, label: 'User Management', component: UserManagementTab },
  { id: 2, label: 'Role Management', component: RoleManagementTab },
];

// Example components/functions for tabs
function OverviewTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <p>This is the Overview tab with some example content.</p>
    </div>
  );
}

export default function DashboardClient({ user }) {
  const [activeTab, setActiveTab] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter(); // For navigating to login after logout

  // Logout function
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'GET' });
      if (response.ok) {
        // Redirect to login page
        router.push('/login');
      } else {
        alert('Failed to log out. Please try again.');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  

  // Find the active tab's component
  const ActiveTabComponent = tabs.find((tab) => tab.id === activeTab)?.component || null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Drawer */}
      <div
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          drawerOpen ? 'translate-x-0' : '-translate-x-64 lg:translate-x-0'
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-sm text-gray-500">Welcome, {user.email}</p>
        </div>
        <nav className="p-6">
          <ul>
            {tabs.map((tab) => (
              <li
                key={tab.id}
                className={`py-2 px-4 rounded-lg cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-6 border-t">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-center bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md lg:hidden">
          <button
            className="p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">Role: {user.role}</p>
        </header>

        {/* Tabs Content */}
        <main className="p-6 flex-grow bg-gray-50">
          {ActiveTabComponent ? <ActiveTabComponent currentUser={user} /> : <p>Select a tab to view content.</p>}
        </main>
      </div>
    </div>
  );
}
