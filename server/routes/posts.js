const express = require('express');
const router = express.Router();

const Post = require('../models/Post');
const User = require('../models/User');
const {
  protect,
  adminOnly
} = require('../middleware/auth');

// Helper function to calculate delete date

const calculateDeleteDate = (deleteAfter) => {

  if (!deleteAfter || deleteAfter === 'Never') {
    return null;
  }

  const days = parseInt(deleteAfter.split(' ')[0]);

  if (isNaN(days)) {
    return null;
  }

  const deleteDate = new Date();

  deleteDate.setDate(
    deleteDate.getDate() + days
  );

  return deleteDate;
};

// @route   GET /api/posts
// @desc    Get all posts

router.get('/', async (req, res) => {

  try {

    const {
      mood,
      type,
      limit = 50
    } = req.query;

    let query = {};

    if (mood && mood !== 'all') {
      query.mood = mood;
    }

    if (type && type !== 'All Posts') {
      query.type = type;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: posts
    });

  } catch (error) {

    console.error('Get posts error:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   POST /api/posts
// @desc    Create a new post

router.post('/', protect, async (req, res) => {

  try {

    const {
      title,
      content,
      mood,
      type,
      deleteAfter
    } = req.body;

    if (!content || content.trim().length === 0) {

      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    const prefixes = [
      'Shadow',
      'Ghost',
      'Mystic',
      'Silent',
      'Hidden',
      'Dark',
      'Quiet'
    ];

    const randomPrefix =
      prefixes[Math.floor(Math.random() * prefixes.length)];

    const randomNum =
      Math.floor(Math.random() * 10000);

    const username =
      req.user?.username ||
      `${randomPrefix}_${randomNum}`;

    const deleteAt =
      calculateDeleteDate(deleteAfter || '7 Days');

    const post = new Post({
      title: title || 'Untitled Thought',
      content: content.trim(),
      mood: mood || 'Sad',
      type: type || 'Just Vent',
      username: username,
      userId: req.user?._id || null,
      deleteAfter: deleteAfter || '7 Days',
      deleteAt: deleteAt
    });

    const savedPost = await post.save();

    console.log(`✅ Post created: ${savedPost._id}`);

    res.status(201).json({
      success: true,
      data: savedPost,
      message: 'Post created successfully'
    });

  } catch (error) {

    console.error('Create post error:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   POST /api/posts/:id/relate

router.post('/:id/relate', protect, async (req, res) => {

  try {

    const post = await Post.findById(req.params.id);

    if (!post) {

      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    const alreadyRelated =
      post.relateUsers.includes(req.user._id);

    if (alreadyRelated) {

      post.relates = Math.max(
        0,
        post.relates - 1
      );

      post.relateUsers =
        post.relateUsers.filter(
          id =>
            id.toString() !==
            req.user._id.toString()
        );

    } else {

      post.relates += 1;

      post.relateUsers.push(req.user._id);
    }

    await post.save();

    res.json({
      success: true,
      relates: post.relates,
      alreadyRelated: !alreadyRelated
    });

  } catch (error) {

    console.error('Relate error:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post

router.delete('/:id', protect, async (req, res) => {

  try {

    const post = await Post.findById(req.params.id);

    if (!post) {

      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    if (
      !post.userId ||
      post.userId.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this post'
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {

    console.error('Delete post error:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Auto-delete expired posts

const deleteExpiredPosts = async () => {

  try {

    const now = new Date();

    const result = await Post.deleteMany({
      deleteAt: {
        $lt: now,
        $ne: null
      }
    });

    if (result.deletedCount > 0) {

      console.log(
        `🗑️ Deleted ${result.deletedCount} expired posts`
      );
    }

  } catch (error) {

    console.error('Auto-delete error:', error);
  }
};

// Run auto-delete every hour

setInterval(
  deleteExpiredPosts,
  60 * 60 * 1000
);

deleteExpiredPosts();


// @route   POST /api/posts/:id/bookmark
// @desc    Bookmark / Unbookmark post

router.post('/:id/bookmark', protect, async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    const alreadySaved =
      user.savedPosts.includes(post._id);

    if (alreadySaved) {

      user.savedPosts =
        user.savedPosts.filter(
          id =>
            id.toString() !==
            post._id.toString()
        );

    } else {

      user.savedPosts.push(post._id);
    }

    await user.save();

    res.json({
      success: true,
      saved: !alreadySaved,
      savedPosts: user.savedPosts
    });

  } catch (error) {

    console.error('Bookmark error:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
// @route   GET /api/posts/user/my-posts
// @desc    Get logged in user's posts
// @access  Private

router.get('/user/my-posts', protect, async (req, res) => {

  try {

    const posts = await Post.find({
      userId: req.user._id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: posts
    });

  } catch (error) {

    console.error(
      'Get my posts error:',
      error
    );

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   POST /api/posts/:id/report
// @desc    Report a post

router.post('/:id/report', protect, async (req, res) => {

  try {

    const { reason } = req.body;

    const post =
      await Post.findById(req.params.id);

    if (!post) {

      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    const alreadyReported =
      post.reports.find(
        report =>
          report.userId.toString() ===
          req.user._id.toString()
      );

    if (alreadyReported) {

      return res.status(400).json({
        success: false,
        error: 'You already reported this post'
      });
    }

    post.reports.push({
      userId: req.user._id,
      reason
    });

    await post.save();

    res.json({
      success: true,
      message: 'Post reported successfully'
    });

  } catch (error) {

    console.error(
      'Report post error:',
      error
    );

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   GET /api/posts/reported
// @desc    Get all reported posts
// @access  Admin

router.get(
  '/reported',
  protect,
  adminOnly,
  async (req, res) => {

    try {

      const posts = await Post.find({
        reports: {
          $exists: true,
          $not: { $size: 0 }
        }
      }).sort({ createdAt: -1 });

      res.json({
        success: true,
        data: posts
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   DELETE /api/posts/admin/:id
// @desc    Admin delete any post

router.delete(
  '/admin/:id',
  protect,
  adminOnly,
  async (req, res) => {

    try {

      const post =
        await Post.findById(req.params.id);

      if (!post) {

        return res.status(404).json({
          success: false,
          error: 'Post not found'
        });
      }

      await post.deleteOne();

      res.json({
        success: true,
        message: 'Post removed by admin'
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

module.exports = router;