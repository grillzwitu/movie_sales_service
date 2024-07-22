import connectToDatabase from '@utils/db'; 
import User from '@models/User'; 
import { verifyPassword, signToken } from '@utils/auth'; 

// Handler for login requests
export const POST = async (req) => {
  await connectToDatabase(); // Connect to the database

  // Parse the request body to get email and password
  const { email, password } = await req.json();

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }

    // Verify the provided password with the stored hashed password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }

    // Generate a JWT token for the authenticated user
    const token = signToken({ id: user._id, email: user.email });

    // Set the JWT token as a cookie
    const headers = new Headers();
    headers.append('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Strict`);

    // Send a response with the token set in the cookie
    return new Response(JSON.stringify({ message: 'Login successful', token }), { status: 200, headers });
  } catch (error) {
    // Handle any errors that occur
    return new Response(JSON.stringify({ error: 'Failed to log in' }), { status: 500 });
  }
};

// Handling other HTTP methods
export const GET = (req) => new Response(null, { status: 405 }); // Method Not Allowed for GET requests
export const PUT = (req) => new Response(null, { status: 405 }); // Method Not Allowed for PUT requests
export const DELETE = (req) => new Response(null, { status: 405 }); // Method Not Allowed for DELETE requests
