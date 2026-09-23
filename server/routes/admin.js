const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Post = require('../models/Post');

const { protect } = require('../middleware/auth');

// ADMIN CHECK MIDDLEWARE

const adminOnly = async (req, res, next) => {

  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access only'
    });
  }

  next();
};

// GET ALL USERS

router.get('/users', protect, adminOnly, async (req, res) => {

  try {

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// BAN USER

router.put('/users/:id/ban', protect, adminOnly, async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.isBanned = true;
    user.banReason = req.body.reason || 'Community violation';

    await user.save();

    res.json({
      success: true,
      message: 'User banned successfully'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// UNBAN USER

router.put('/users/:id/unban', protect, adminOnly, async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.isBanned = false;
    user.banReason = '';

    await user.save();

    res.json({
      success: true,
      message: 'User unbanned successfully'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE USER

router.delete('/users/:id', protect, adminOnly, async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // DELETE USER POSTS

    await Post.deleteMany({
      userId: user._id
    });

    // DELETE USER

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;