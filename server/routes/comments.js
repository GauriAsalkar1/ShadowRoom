const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// @route   GET /api/comments/post/:postId
// @desc    Get comments for a post
// @access  Public
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/comments
// @desc    Add a comment to a post
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { postId, content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Comment content is required' });
    }
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    
    // Check if post allows responses
    if (post.type === 'Just Vent') {
      return res.status(403).json({ success: false, error: 'This post does not allow comments' });
    }
    
    const username = req.user.username || `Shadow_${Math.floor(Math.random() * 10000)}`;
    
    const comment = await Comment.create({
      postId,
      content,
      username,
      userId: req.user._id,
      isAnonymous: true
    });
    
    // Increment comment count on post
    post.comments += 1;
    await post.save();
    
    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }
    
    // Check if user owns this comment
    if (comment.userId && comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    
    await comment.deleteOne();
    
    // Decrement comment count on post
    await Post.findByIdAndUpdate(comment.postId, {
      $inc: { comments: -1 }
    });
    
    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;