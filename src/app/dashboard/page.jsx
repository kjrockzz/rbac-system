import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import DashboardClient from './DashboardClient'; // Client Component for UI

const SECRET_KEY = 'your-secret-key';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return <p className="text-red-500 text-center mt-10">Unauthorized. Please log in.</p>;
  }

  let user;
  try {
    user = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    console.error('Invalid or expired token:', err.message);
    return (
      <p className="text-red-500 text-center mt-10">
        Session expired or invalid token. Please log in again.
      </p>
    );
  }

  // Pass user data to the Client Component
  return <DashboardClient user={user} />;
}
