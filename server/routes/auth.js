const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');

const User = require('../models/User');
const { getRandomUsername } = require('../utils/usernamePool');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');
const { protect } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register user with email
// @access  Public
router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('username').optional().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, username: customUsername } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    // Generate username (either custom or random from pool)
    let username = customUsername;
    if (!username) {
      username = getRandomUsername();
    } else {
      // Check if custom username is taken
      const usernameTaken = await User.findOne({ username });
      if (usernameTaken) {
        return res.status(400).json({ success: false, error: 'Username already taken' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      verificationToken,
      verificationTokenExpiry
    });

    // Send verification email (don't fail registration if email fails)
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue even if email fails
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please verify your email.',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Check if banned
    if (user.isBanned) {
      return res.status(403).json({ success: false, error: 'Account has been banned', reason: user.banReason });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last active
    user.lastActive = Date.now();
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

// @route   GET /api/auth/verify-email/:token
// @desc    Verify email with token and redirect to frontend
// @access  Public
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      // Redirect with error
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?verified=false&error=Invalid or expired token`);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    // Redirect to frontend login with success
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?verified=true`);

  } catch (error) {
    console.error('Verification error:', error);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?verified=false&error=Server error`);
  }
});

// @route   POST /api/auth/resend-verification
// @desc    Resend verification email
// @access  Private
router.post('/resend-verification', protect, async (req, res) => {
  try {
    if (req.user.isVerified) {
      return res.status(400).json({ success: false, error: 'Email already verified' });
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    req.user.verificationToken = verificationToken;
    req.user.verificationTokenExpiry = verificationTokenExpiry;
    await req.user.save();

    // Send email
    await sendVerificationEmail(req.user.email, verificationToken);

    res.json({ success: true, message: 'Verification email sent' });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return success even if email doesn't exist (security)
    if (!user) {
      return res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetPasswordExpiry;
    await user.save();

    // Send email
    await sendPasswordResetEmail(email, resetToken);

    res.json({ success: true, message: 'If that email exists, a reset link has been sent' });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.post('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful! You can now login.' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      username: req.user.username,
      isVerified: req.user.isVerified,
      createdAt: req.user.createdAt,
      savedPosts: req.user.savedPosts || [],
      role: req.user.role || 'user'
    }
  });
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side only)
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;