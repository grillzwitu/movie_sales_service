import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '@models/User';

const secret = process.env.JWT_SECRET; // JWT secret key from environment variables
const saltRounds = 10; // Number of salt rounds for password hashing

// Function to hash a password
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds); // Generate salt
    return await bcrypt.hash(password, salt); // Hash the password with the salt
  } catch (error) {
    throw new Error('Failed to hash password'); // Error handling
  }
};

// Function to verify a password against a hashed password
export const verifyPassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash); // Compare password with hash
  } catch (error) {
    throw new Error('Failed to verify password'); // Error handling
  }
};

// Function to sign a JWT token
export const signToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: '1h' }); // Token expires in 1 hour
};

// Function to verify a JWT token
export const verifyToken = (token) => {
  const result = jwt.verify(token, secret); // Verify token with the secret
  return result;
};

// Middleware function to authenticate users
export const authenticate = async (req) => {
  // Extract token from the Cookie header
  const cookieHeader = req.headers.get('Cookie');
  const cookies = cookieHeader?.split('; ').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=');
    acc[key] = value;
    return acc;
  }, {});

  const token = cookies?.token;

  if (!token) {
    throw new Error('Unauthorized'); // No token found
  }

  try {
    const decoded = verifyToken(token); // Verify and decode the token
    return decoded; // Return decoded user info
  } catch (error) {
    throw new Error('Unauthorized'); // Invalid token
  }
};

// Middleware function to ensure user is an admin
export const ensureAdmin = async (user) => {
  user = await User.findById(user.id)

  if (user?.role !== 'admin') {
    throw new Error(`Forbidden`); // User is not an admin
  }

};
