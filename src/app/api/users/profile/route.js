import connectToDatabase from '@utils/db';
import User from '@models/User';
import { authenticate } from '@utils/auth';

const userProfileHandler = async (req, res) => {
    await connectToDatabase();

    authenticate(req, res, async () => {
      if (req.method === 'GET') {
        try {
          // Fetch user profile
          const user = await User.findById(req.user.id).select('-password');
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          res.status(200).json(user);
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch user profile' });
        }
      } else if (req.method === 'PATCH') {
        try {
          const updates = req.body;
          // Validate update fields
          const allowedUpdates = ['firstName', 'lastName', 'email', 'password'];
          const isValidUpdate = Object.keys(updates).every((update) =>
            allowedUpdates.includes(update)
          );
  
          if (!isValidUpdate) {
            return res.status(400).json({ error: 'Invalid update fields' });
          }
  
          // Hash the new password if provided
          if (updates.password) {
            updates.password = await hashPassword(updates.password);
          }
  
          // Update user profile
          const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true,
          }).select('-password');
  
          if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
          }
          res.status(200).json(updatedUser);
        } catch (error) {
          res.status(400).json({ error: 'Failed to update profile' });
        }
      } else {
        res.status(405).end(); // Method Not Allowed
      }
    });
};

export default userProfileHandler;
