const express = require('express');
const router = express.Router();

const categories = [
  { id: 1, name: 'Mental Health', description: 'Share your mental health journey', icon: '🧠', mood: 'Sad' },
  { id: 2, name: 'Relationships', description: 'Discuss relationships, friendships, and family', icon: '❤️', mood: 'Sad' },
  { id: 3, name: 'College Life', description: 'Studies, exams, hostel life, and more', icon: '📚', mood: 'Confused' },
  { id: 4, name: 'Career', description: 'Job pressure, career choices, work-life balance', icon: '💼', mood: 'Angry' },
  { id: 5, name: 'Confessions', description: 'Share your secrets anonymously', icon: '🤫', mood: 'Sad' },
  { id: 6, name: 'Family Issues', description: 'Talk about family problems', icon: '🏠', mood: 'Angry' },
  { id: 7, name: 'Cyber Experiences', description: 'Online experiences, social media', icon: '💻', mood: 'Confused' },
  { id: 8, name: 'Personal Growth', description: 'Self-improvement, goals, achievements', icon: '🌱', mood: 'Happy' }
];

router.get('/', (req, res) => {
  res.json({
    success: true,
    count: categories.length,
    categories
  });
});

router.get('/:id', (req, res) => {
  const category = categories.find(c => c.id === parseInt(req.params.id));
  if (!category) {
    return res.status(404).json({ success: false, error: 'Category not found' });
  }
  res.json({ success: true, category });
});

module.exports = router;