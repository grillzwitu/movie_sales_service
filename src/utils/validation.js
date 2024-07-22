export function validateRegistration(formData) {
    const { firstName, lastName, email, password } = formData;
    if (!firstName || !lastName || !email || !password) {
      return 'All fields are required';
    }
    // Add more validations as needed
    return null;
}
