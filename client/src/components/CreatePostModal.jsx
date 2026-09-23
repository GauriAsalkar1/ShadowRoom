import React, { useState } from 'react';
import { X, Lock, Unlock, Ghost } from 'lucide-react';
import { posts as postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

const moodEmojis = {
  Angry: '😠',
  Sad: '😢',
  Confused: '😕',
  Happy: '😊'
};

const moodColors = {
  Angry: 'from-red-600 to-orange-600',
  Sad: 'from-blue-600 to-indigo-600',
  Confused: 'from-yellow-600 to-amber-600',
  Happy: 'from-green-600 to-emerald-600'
};

const CreatePostModal = ({ isOpen, onClose, onPostCreated, defaultMood = 'Sad' }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    mood: defaultMood,
    type: 'Just Vent',
    title: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      toast.error('Please write something');
      return;
    }
    
    if (formData.content.length < 5) {
      toast.error('Please write at least 5 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const postData = {
        content: formData.content,
        mood: formData.mood,
        type: formData.type,
        title: formData.title || 'Untitled Thought'
      };
      
      const response = await postsAPI.create(postData);
      
      if (response.success) {
        toast.success('Your thought has been shared anonymously!');
        onPostCreated();
        onClose();
        setFormData({ content: '', mood: defaultMood, type: 'Just Vent', title: '' });
      } else {
        toast.error(response.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Create post error:', error);
      toast.error(error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl w-full max-w-lg border border-purple-500/30 shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <Ghost className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Share Your Thought</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Mood Selection */}
            <div className="mb-4">
              <label className="text-gray-300 text-sm mb-2 block">How are you feeling?</label>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(moodEmojis).map(([mood, emoji]) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setFormData({ ...formData, mood })}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2",
                      formData.mood === mood
                        ? `bg-gradient-to-r ${moodColors[mood]} text-white shadow-lg`
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    )}
                  >
                    <span>{emoji}</span>
                    <span>{mood}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Post Type Selection */}
            <div className="mb-4">
              <label className="text-gray-300 text-sm mb-2 block">Post Type</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'Just Vent' })}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-xl text-sm transition-all flex items-center justify-center gap-2",
                    formData.type === 'Just Vent'
                      ? 'bg-gray-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  )}
                >
                  <Lock className="w-4 h-4" />
                  Just Vent
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'Open to Responses' })}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-xl text-sm transition-all flex items-center justify-center gap-2",
                    formData.type === 'Open to Responses'
                      ? 'bg-green-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  )}
                >
                  <Unlock className="w-4 h-4" />
                  Open to Responses
                </button>
              </div>
            </div>

            {/* Content Input */}
            <div className="mb-5">
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="What's on your mind? Write anonymously..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                autoFocus
              />
              <div className="text-right mt-1">
                <span className="text-xs text-gray-500">{formData.content.length} characters</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.content.trim()}
                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Sharing...' : 'Share Anonymously'}
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-4">
              🔒 Your identity is protected. All posts are anonymous.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;