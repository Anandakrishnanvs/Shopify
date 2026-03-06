import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import sendWelcomeEmail from '../utils/sendEmail.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Only allow role selection for admin/seller if explicitly allowed
    // Default to 'user' if not provided or invalid
    const validRoles = ['user', 'admin', 'seller'];
    const userRole = validRoles.includes(role) ? role : 'user';

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid user data' });
    }

    // Send welcome email asynchronously without blocking the response
    sendWelcomeEmail(user.email, user.name);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    return res.status(500).json({
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
      zipCode: user.zipCode,
      token,
    });
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    return res.status(500).json({
      message: 'Server error during login',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  return res.json(req.user);
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.address = req.body.address !== undefined ? req.body.address : user.address;
      user.city = req.body.city !== undefined ? req.body.city : user.city;
      user.state = req.body.state !== undefined ? req.body.state : user.state;
      user.country = req.body.country !== undefined ? req.body.country : user.country;
      user.zipCode = req.body.zipCode !== undefined ? req.body.zipCode : user.zipCode;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city,
        state: updatedUser.state,
        country: updatedUser.country,
        zipCode: updatedUser.zipCode,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/profile
// @access  Private
const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed completely' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Delete account error:', error.message);
    res.status(500).json({ message: 'Server error during account deletion' });
  }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  try {
    // In JWT-based auth, logout is handled client-side by removing the token
    // This endpoint can be used for server-side logging or token blacklisting if implemented
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

// @desc    Check if current user is authenticated
// @route   GET /api/auth/check-user
// @access  Private
const checkUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated', isAuthenticated: false });
    }

    res.json({
      isAuthenticated: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error('Check user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Check if current user is admin
// @route   GET /api/auth/check-admin
// @access  Private/Admin
const checkAdmin = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated', isAdmin: false });
    }

    const isAdmin = req.user.role === 'admin';

    res.json({
      isAdmin,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error('Check admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { registerUser, loginUser, getMe, updateUserProfile, deleteUserAccount, logoutUser, checkUser, checkAdmin };
