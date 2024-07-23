import connectToDatabase from '@utils/db';
import User from '@models/User';
import { verifyPassword, signToken } from './auth';

/**
 * Handles login requests.
 *
 * @param {import('http').IncomingMessage} req - The incoming HTTP request.
 * @returns {Promise<Response>} - A Promise resolving to a Response object.
 */
export const POST = async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  await connectToDatabase();

  const { email, password } = await req.json();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const token = signToken({ id: user._id, email: user.email });

    const headers = new Headers();
    headers.append('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Strict`);
    headers.append('Content-Type', 'application/json');

    return new Response(JSON.stringify({ message: 'Login successful', token }), { status: 200, headers });
  } catch (error) {
    console.error(error);
      return new Response(JSON.stringify({ error: error.message }), { status: error.statusCode || 500, headers: { 'Content-Type': 'application/json' } });
  }
};
