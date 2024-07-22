import connectToDatabase from '@utils/db';
import User from '@models/User';
import { authenticate } from '@utils/auth';

/**
 * Handles user profile retrieval.
 *
 * @param {import('http').IncomingMessage} req - The incoming HTTP request.
 * @returns {Promise<Response>} - A Promise resolving to a Response object.
 */
export async function GET(req) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  await connectToDatabase();
  await authenticate(req);

  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify(user), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
