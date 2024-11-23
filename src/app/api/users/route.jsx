import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'users.json'); // Path to the JSON file

export async function GET() {
  // Read the JSON file and return the users
  const data = fs.readFileSync(filePath, 'utf8');
  const users = JSON.parse(data);

  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req) {
  // Add a new user to the JSON file
  const newUser = await req.json();
  const data = fs.readFileSync(filePath, 'utf8');
  const users = JSON.parse(data);

  const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  const userToAdd = { id: newId, ...newUser };

  users.push(userToAdd);

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');

  return new Response(JSON.stringify(userToAdd), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PUT(req) {
  // Edit an existing user in the JSON file
  const updatedUser = await req.json();
  const data = fs.readFileSync(filePath, 'utf8');
  const users = JSON.parse(data);

  const userIndex = users.findIndex((u) => u.id === updatedUser.id);
  if (userIndex === -1) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  users[userIndex] = { ...users[userIndex], ...updatedUser };

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');

  return new Response(JSON.stringify(users[userIndex]), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE(req) {
  // Delete a user from the JSON file
  const { id } = await req.json();
  const data = fs.readFileSync(filePath, 'utf8');
  const users = JSON.parse(data);

  const filteredUsers = users.filter((u) => u.id !== id);

  if (filteredUsers.length === users.length) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(filteredUsers, null, 2), 'utf8');

  return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
