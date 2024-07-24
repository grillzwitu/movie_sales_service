/**
 * Validates registration form data.
 *
 * @param {Object} formData - The form data to validate.
 * @returns {string|null} - Returns an error message if invalid, null otherwise.
 */
export function validateRegistration(formData) {
  const { firstName, lastName, email, password } = formData;
  console.log(formData.firstName)

  if (!firstName || !lastName || !email || !password) {
    return 'All fields are required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }

  if (password.length < 4) {
    return 'Password must be at least 4 characters long';
  }

  // Add more validations as needed
  return null;
}
