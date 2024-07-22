import connectToDatabase from '@utils/db';
import User from '@models/User';
import { hashPassword } from '@utils/auth';
import { authenticate, ensureAdmin } from '@utils/auth';

// Handle the creation of an admin user
export async function POST(req, res) {
  // Connect to the database
  await connectToDatabase();

  // Authenticate the user and ensure they are an admin
  return authenticate(req, res)
    .then(() => ensureAdmin(req, res))
    .then(async () => {
      // Check if the request method is POST
      if (req.method !== 'POST') {
        // If not POST, return a 405 Method Not Allowed response
        return new Response('Method Not Allowed', { status: 405 });
      }

      try {
        // Extract user data from the request body
        const { email, firstName, lastName, password } = req.body;

        // Check if an admin with the same email already exists
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
          // If admin exists, return a 400 Bad Request response
          return new Response(JSON.stringify({ error: 'Admin already exists' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new admin user
        const admin = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: 'admin',
        });

        // Save the admin to the database
        await admin.save();

        // Return a success response with the created admin data
        return new Response(JSON.stringify({ message: 'Admin created successfully' }), {
          status: 201,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        // Handle unexpected errors
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to create admin' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    })
}
