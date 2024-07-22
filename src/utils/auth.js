import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '@models/User';

const secret = process.env.JWT_SECRET; // JWT secret key from environment variables
const saltRounds = 10; // Number of salt rounds for password hashing

/**
 * Hashes a password using bcrypt.
 *
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} - A Promise resolving to the hashed password.
 */
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds); // Generate salt
    return await bcrypt.hash(password, salt); // Hash the password with the salt
  } catch (error) {
    throw new Error('Failed to hash password'); // Error handling
  }
};

/**
 * Verifies a password against a hashed password.
 *
 * @param {string} password - The plain text password.
 * @param {string} hash - The hashed password.
 * @returns {Promise<boolean>} - A Promise resolving to true if the password matches, false otherwise.
 */
export const verifyPassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash); // Compare password with hash
  } catch (error) {
    throw new Error('Failed to verify password'); // Error handling
  }
};

/**
 * Signs a JWT token.
 *
 * @param {Object} payload - The payload to include in the token.
 * @returns {string} - The signed JWT token.
 */
export const signToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: '1h' }); // Token expires in 1 hour
};

/**
 * Verifies a JWT token.
 *
 * @param {string} token - The JWT token to verify.
 * @returns {Object} - The decoded token payload.
 * @throws {Error} - Throws an error if the token is invalid.
 */
export const verifyToken = (token) => {
  const result = jwt.verify(token, secret); // Verify token with the secret
  return result;
};

/**
 * Authenticates a user based on a provided token.
 *
 * @param {import('http').IncomingMessage} req - The incoming HTTP request.
 * @returns {Promise<Object>} - A Promise resolving to the decoded user information.
 * @throws {Error} - Throws an error if authentication fails.
 */
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

/**
 * Ensures that the authenticated user is an admin.
 *
 * @param {Object} user - The authenticated user object.
 * @throws {Error} - Throws an error if the user is not an admin.
 */
export const ensureAdmin = async (user) => {
  user = await User.findById(user.id);

  if (user?.role !== 'admin') {
    throw new Error(`Forbidden`); // User is not an admin
  }
};
