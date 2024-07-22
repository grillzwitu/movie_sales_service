import connectToDatabase from '@utils/db';
import User from '@models/User';
import { hashPassword } from '@utils/auth';

// Handler for creating the first admin user
export const POST = async (req) => {
  await connectToDatabase(); // Connect to the database

  try {
    // Extract admin details from the request body
    const { email, firstName, lastName, password } = await req.json();

    // Check if any admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return new Response(JSON.stringify({ error: 'Admin user already exists' }), { status: 400 });
    }

    // Hash the provided password
    const hashedPassword = await hashPassword(password);

    // Create a new admin user
    const admin = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'admin', // Set the role to 'admin'
    });

    await admin.save(); // Save the new admin user to the database
    return new Response(JSON.stringify({ message: 'Admin created successfully' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create admin' }), { status: 500 });
  }
};
