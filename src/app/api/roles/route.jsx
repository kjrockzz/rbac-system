import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'roles.json');
const usersFilePath = path.join(process.cwd(), 'data', 'users.json');



export async function POST(req) {
  const newRole = await req.json();
  const data = fs.readFileSync(filePath, 'utf8');
  const roles = JSON.parse(data);

  const newId = roles.length > 0 ? roles[roles.length - 1].id + 1 : 1;
  const roleToAdd = { id: newId, ...newRole };

  roles.push(roleToAdd);

  fs.writeFileSync(filePath, JSON.stringify(roles, null, 2), 'utf8');

  return new Response(JSON.stringify(roleToAdd), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET() {
  // Fetch all roles
  const rolesData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return new Response(JSON.stringify(rolesData), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PUT(req) {
  // Update permissions for a role
  const { id, permissions } = await req.json();

  const rolesData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const roleIndex = rolesData.findIndex((role) => role.id === id);

  if (roleIndex === -1) {
    return new Response(JSON.stringify({ error: 'Role not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  rolesData[roleIndex].permissions = permissions;

  fs.writeFileSync(filePath, JSON.stringify(rolesData, null, 2), 'utf8');

  return new Response(
    JSON.stringify({
      message: `Permissions for role "${rolesData[roleIndex].name}" updated.`,
      role: rolesData[roleIndex],
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export async function DELETE(req) {
    const { id } = await req.json();
  
    // Load roles and users
    const rolesData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
  
    // Find the role to delete
    const roleIndex = rolesData.findIndex((role) => role.id === id);
    if (roleIndex === -1) {
      return new Response(JSON.stringify({ error: 'Role not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    // Get the name of the role being deleted
    const roleName = rolesData[roleIndex].name;
  
    // Remove the role
    rolesData.splice(roleIndex, 1);
  
    // Update users who hold the deleted role
    const updatedUsers = usersData.map((user) => {
      if (user.role === roleName) {
        return { ...user, role: 'Unassigned' }; // Set role to "Unassigned"
      }
      return user;
    });
  
    // Save updated roles and users
    fs.writeFileSync(filePath, JSON.stringify(rolesData, null, 2), 'utf8');
    fs.writeFileSync(usersFilePath, JSON.stringify(updatedUsers, null, 2), 'utf8');
  
    return new Response(
      JSON.stringify({
        message: `Role "${roleName}" deleted and affected users updated.`,
        updatedUsers,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }