import connectToDatabase from '@utils/db';
import User from '@models/User';
import { hashPassword } from '@utils/auth';
import { validateRegistration } from '@utils/validation';

const registerHandler = async (req, res) => {
    await connectToDatabase();

    if (req.method === 'POST') {
      const error = validateRegistration(req.body);
      if (error) {
        return res.status(400).json({ error });
      }
  
      const { firstName, lastName, email, password } = req.body;
  
      try {
        const hashedPassword = await hashPassword(password);
        const user = new User({ firstName, lastName, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        res.status(400).json({ error: 'Failed to register user' });
      }
    } else {
      res.status(405).end(); // Method Not Allowed
    }
};

export default registerHandler;
