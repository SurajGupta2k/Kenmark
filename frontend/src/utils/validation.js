// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    errors: {
      length: password.length < minLength,
      upperCase: !hasUpperCase,
      lowerCase: !hasLowerCase,
      number: !hasNumbers,
      specialChar: !hasSpecialChar,
    }
  };
};

// Username validation
export const isValidUsername = (username) => {
  const minLength = 3;
  const maxLength = 20;
  const validChars = /^[a-zA-Z0-9._-]+$/;
  
  return {
    isValid: 
      username.length >= minLength && 
      username.length <= maxLength && 
      validChars.test(username),
    errors: {
      length: username.length < minLength || username.length > maxLength,
      characters: !validChars.test(username),
    }
  };
};

// Form validation messages
export const getValidationMessage = (type, errors) => {
  switch (type) {
    case 'password':
      return {
        length: 'Password must be at least 8 characters long',
        upperCase: 'Password must contain at least one uppercase letter',
        lowerCase: 'Password must contain at least one lowercase letter',
        number: 'Password must contain at least one number',
        specialChar: 'Password must contain at least one special character',
      };
    case 'username':
      return {
        length: 'Username must be between 3 and 20 characters',
        characters: 'Username can only contain letters, numbers, dots, underscores, and hyphens',
      };
    case 'email':
      return 'Please enter a valid email address';
    default:
      return '';
  }
}; 