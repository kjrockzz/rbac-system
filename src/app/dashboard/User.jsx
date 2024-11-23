'use client';

import React, { useState, useEffect } from 'react';

export default function UserManagementTab({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]); // Permissions for the current user
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Fetch users, roles, and permissions on load
  useEffect(() => {
    const fetchData = async () => {
      const usersResponse = await fetch('/api/users', { method: 'GET' });
      const rolesResponse = await fetch('/api/roles', { method: 'GET' });

      const usersData = await usersResponse.json();
      const rolesData = await rolesResponse.json();

      setUsers(usersData);
      setRoles(rolesData);

      // Get the role of the current user
      const currentUserRole = usersData.find(
        (user) => user.email === currentUser.email
      )?.role;
      console.log("curret role",currentUserRole)
      // Get permissions for the current user's role
      const currentRolePermissions =
        rolesData.find((role) => role.name === currentUserRole)?.permissions || [];
        console.log(currentRolePermissions)
      setPermissions(currentRolePermissions);
    };

    fetchData();
    console.log(permissions)
  }, [currentUser]);

  const handleSaveUser = async (user) => {
    if (editUser) {
      // Editing existing user
      if (
        editUser.role === 'Admin' &&
        currentUser.role !== 'Admin'
      ) {
        alert('Permission denied: You cannot edit Admin users.');
        return;
      }
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, ...user } : u))
      );
    } else {
      // Adding a new user
      if (!permissions.includes('Write')) {
        alert('Permission denied: You cannot create users.');
        return;
      }
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const newUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, newUser]);
    }
    setShowModal(false);
    setEditUser(null);
  };

  const handleDeleteUser = async (id, role) => {
    if (!permissions.includes('Delete')) {
      alert('Permission denied: You cannot delete users.');
      return;
    }
    if (role === 'Admin' && currentUser.role !== 'Admin') {
      alert('Permission denied: You cannot delete Admin users.');
      return;
    }
    await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        {/* Show "Add User" button only if the user has "Write" permission */}
        {(permissions.includes('Write') || currentUser.role === "Admin")&& (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => setShowModal(true)}
          >
            Add User
          </button>
        )}
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className={`${
                user.role === 'Unassigned'
                  ? 'bg-yellow-100'
                  : 'odd:bg-white even:bg-gray-50'
              }`}
            >
              <td className="border border-gray-300 px-4 py-2">{user.name}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">{user.role}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {user.isActive ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-lg">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-lg">
                    Inactive
                  </span>
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {/* Show action buttons based on permissions */}
                {((permissions.includes('Update') && user.role !== "Admin") || currentUser.role==="Admin") && (
                  <button
                    className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 mr-2"
                    onClick={() => {
                      setEditUser(user);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                )}
                {((permissions.includes('Delete') && user.role !== 'Admin') || currentUser.role==="Admin") && (
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    onClick={() => handleDeleteUser(user.id, user.role)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <UserModal
          user={editUser}
          roles={roles}
          onClose={() => {
            setShowModal(false);
            setEditUser(null);
          }
          
        }
            currentUser={currentUser}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}

function UserModal({ user, roles, onClose, onSave, currentUser }) {
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [role, setRole] = useState(user?.role || roles[0]?.name || '');
    const [isActive, setIsActive] = useState(user?.isActive || false);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (name && email && role) {
        onSave({
          id: user?.id,
          name,
          email,
          role,
          isActive,
        });
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-xl font-bold mb-4">{user ? 'Edit User' : 'Add User'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1">Role</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                {roles.map((r) => (
                  // Exclude Admin role for non-Admin users
                  (currentUser.role === 'Admin' || r.name !== 'Admin') && (
                    <option key={r.name} value={r.name}>
                      {r.name}
                    </option>
                  )
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                value={isActive ? 'Active' : 'Inactive'}
                onChange={(e) => setIsActive(e.target.value === 'Active')}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
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
  