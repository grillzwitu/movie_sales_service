import connectToDatabase from '@utils/db';
import User from '@models/User';
import { hashPassword } from '@utils/auth';
import { validateRegistration } from '@utils/validation';


/**
 * Handles user registration requests.
 *
 * @param {import('http').IncomingMessage} req - The incoming HTTP request.
 * @param {import('http').ServerResponse} res - The outgoing HTTP response.
 * @returns {Promise<Response>} - A Promise resolving to a Response object.
 */
export async function POST(req, res) {
  try {
    await connectToDatabase();

    if (req.method !== 'POST') {
      throw new Error('Method Not Allowed');
    }

    const { firstName, lastName, email, password } = req.body;

    const validationError = validateRegistration(req.body);
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({ firstName, lastName, email, password: hashedPassword });
    await user.save();

    return new Response(JSON.stringify({ message: 'User registered successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);

    // Handle general errors with a generic message
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
