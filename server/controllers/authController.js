const User = require('../models/User');

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Trim whitespace from inputs
    name = name?.trim();
    email = email?.trim();
    password = password?.trim();

    // Validate input - check if fields exist and are not empty
    if (!name || name.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid name'
      });
    }

    if (!email || email.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email'
      });
    }

    if (!password || password.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid password'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists with this exact email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create new user with validated and normalized data
    const user = await User.create({
      name: name,
      email: normalizedEmail,
      password: password
    });

    console.log('User registered successfully:', normalizedEmail);

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user'
    });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Trim whitespace from inputs
    email = email?.trim();
    password = password?.trim();

    // Validate input - check if fields exist and are not empty
    if (!email || email.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    if (!password || password.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    // Normalize email to lowercase for consistent lookup
    const normalizedEmail = email.toLowerCase();

    // Find user by exact email match
    const user = await User.findOne({ email: normalizedEmail });
    
    console.log('Login attempt for:', normalizedEmail);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password - must match exactly (case-sensitive)
    const passwordMatch = user.password === password;
    console.log('Password match:', passwordMatch);
    console.log('Expected password length:', user.password.length);
    console.log('Provided password length:', password.length);

    if (!passwordMatch) {
      console.log('Login failed: Password mismatch');
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Login successful
    console.log('Login successful for:', normalizedEmail);
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login'
    });
  }
};

/**
 * Reset password
 * @route POST /api/auth/reset-password
 * @access Public
 */
const resetPassword = async (req, res) => {
  try {
    let { email, newPassword, confirmPassword } = req.body;

    // Trim whitespace from inputs
    email = email?.trim();
    newPassword = newPassword?.trim();
    confirmPassword = confirmPassword?.trim();

    // Validate input - check if fields exist and are not empty
    if (!email || email.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email address'
      });
    }

    if (!newPassword || newPassword.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide new password'
      });
    }

    if (!confirmPassword || confirmPassword.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please confirm your password'
      });
    }

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Check if passwords match exactly
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match'
      });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Find user by exact email match
    const user = await User.findOne({ email: normalizedEmail });
    
    console.log('Password reset attempt for:', normalizedEmail);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('Password reset failed: User not found');
      return res.status(404).json({
        success: false,
        error: 'No account found with this email address'
      });
    }

    // Update password with the new validated password
    user.password = newPassword;
    await user.save();

    console.log('Password reset successful for:', normalizedEmail);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully! You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password'
    });
  }
};

module.exports = {
  register,
  login,
  resetPassword
};
