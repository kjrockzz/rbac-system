'use client';

import React, { useState, useEffect } from 'react';

export default function RoleManagementTab({currentUser}) {
  const [roles, setRoles] = useState([]);
  const [permissions] = useState(["Read", "Write", "Delete", "Update"]); // All possible permissions
  const [editRole, setEditRole] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      const response = await fetch('/api/roles', { method: 'GET' });
      const data = await response.json();
      setRoles(data);
    };

    fetchRoles();
  }, []);

  // Save new or updated role
  const handleSaveRole = async (role) => {
    if (editRole) {
      // Edit existing role
      const response = await fetch('/api/roles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(role),
      });

      if (response.ok) {
        const updatedRoleData = await response.json();
        setRoles((prevRoles) =>
          prevRoles.map((r) =>
            r.id === updatedRoleData.role.id ? updatedRoleData.role : r
          )
        );
      }
    } else {
      // Add new role
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(role),
      });

      if (response.ok) {
        const newRole = await response.json();
        setRoles((prevRoles) => [...prevRoles, newRole]);
      }
    }
    setShowModal(false);
    setEditRole(null);
  };

  // Delete role
  const handleDeleteRole = async (id) => {
    const response = await fetch('/api/roles', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      const data = await response.json();
      alert(`Role deleted. Affected users have been updated to "Unassigned".`);
      setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Role Management</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => setShowModal(true)}
        >
          Add Role
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Role Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Permissions</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="odd:bg-white even:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{role.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                {role.permissions.join(', ')}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {role.name !== "Admin" && (<><button
                          className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 mr-2"
                          onClick={() => {
                              setEditRole(role);
                              setShowModal(true);
                          } }
                      >
                          Edit
                      </button><button
                          className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          onClick={() => handleDeleteRole(role.id)}
                      >
                              Delete
                          </button></>)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <RoleModal
          role={editRole}
          permissions={permissions} // Pass all available permissions
          onClose={() => {
            setShowModal(false);
            setEditRole(null);
          }}
          onSave={handleSaveRole}
        />
      )}
    </div>
  );
}

// Modal for Adding/Editing Roles
function RoleModal({ role, permissions, onClose, onSave }) {
  const [name, setName] = useState(role?.name || '');
  const [selectedPermissions, setSelectedPermissions] = useState(role?.permissions || []);

  const handleTogglePermission = (permission) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions((prev) => prev.filter((p) => p !== permission));
    } else {
      setSelectedPermissions((prev) => [...prev, permission]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && selectedPermissions.length > 0) {
      onSave({ id: role?.id, name, permissions: selectedPermissions });
    } else {
      alert('Please enter a role name and select at least one permission.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-bold mb-4">{role ? 'Edit Role' : 'Add Role'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Role Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Permissions</label>
            <div className="grid grid-cols-2 gap-2">
              {permissions.map((permission) => (
                <label key={permission} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission)}
                    onChange={() => handleTogglePermission(permission)}
                    className="mr-2"
                  />
                  {permission}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 mr-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
