import connectToDatabase from '@utils/db';
import User from '@models/User';
import { authenticate } from '@utils/auth';
import { hashPassword } from '@utils/auth';

/**
 * Handles user profile updates.
 *
 * @param {import('http').IncomingMessage} req - The incoming HTTP request.
 * @returns {Promise<Response>} - A Promise resolving to a Response object.
 */
export async function PATCH(req) {
    if (req.method !== 'PATCH') {
        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }
    
    await connectToDatabase();
    await authenticate(req);
    
    const updates = await req.json();
    
    // Validate update fields
    const allowedUpdates = ['firstName', 'lastName', 'email', 'password', 'currentPassword'];
    const isValidUpdate = Object.keys(updates).every((update) =>
        allowedUpdates.includes(update)
    );
    
    if (!isValidUpdate) {
        return new Response(JSON.stringify({ error: 'Invalid update fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const user = await User.findById(req.user.id);
    
    // Verify current password if password update is requested
    if (updates.password) {
        const isPasswordValid = await verifyPassword(updates.currentPassword, user.password);
        if (!isPasswordValid) {
          return new Response(JSON.stringify({ error: 'Incorrect current password' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
    }
    
    // Hash the new password if provided
    if (updates.password) {
        updates.password = await hashPassword(updates.password);
    }
    
    // Remove currentPassword field
    delete updates.currentPassword;
    
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updates,
        { new: true, select: '-password' }
    );
    
    if (!updatedUser) {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    
    return new Response(JSON.stringify(updatedUser), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
