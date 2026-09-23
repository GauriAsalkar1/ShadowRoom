import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { posts as postsAPI } from '../services/api';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { RightSidebar } from '../components/layout/RightSidebar';
import CreatePostModal from '../components/CreatePostModal';
import { Heart, MessageSquare, Lock, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

const moodEmojis = {
  Angry: '😠',
  Sad: '😢',
  Confused: '😕',
  Happy: '😊'
};

const moodColors = {
  Angry: 'bg-red-500/20 text-red-400 border-red-500/50',
  Sad: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  Confused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  Happy: 'bg-green-500/20 text-green-400 border-green-500/50'
};

const MoodPage = () => {
  const { mood } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchPosts();
  }, [mood, isAuthenticated]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postsAPI.getAll({ mood });
      setPosts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleRelate = async (postId) => {
    if (!token) {
      toast.error('Please login to relate');
      return;
    }
    try {
      const response = await postsAPI.relate(postId);
      if (response.success) {
        fetchPosts();
        toast.success(response.alreadyRelated ? 'You related to this post' : 'Removed relate');
      }
    } catch (error) {
      toast.error('Failed to relate');
    }
  };

  const getMoodStyle = () => {
    return moodColors[mood] || moodColors.Sad;
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header onOpenComposer={() => setShowComposer(true)} />
      
      <div className="ml-64 mt-16">
        <main className="max-w-4xl mx-auto p-6">
          {/* Mood Header */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{moodEmojis[mood] || '😶'}</span>
              <div>
                <h1 className="text-2xl font-bold text-white">{mood} Room</h1>
                <p className="text-muted-foreground">
                  A safe space to share and explore {mood?.toLowerCase()} thoughts
                </p>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <span className="text-6xl mb-4 block">🌱</span>
              <h3 className="text-xl font-semibold text-white mb-2">No {mood} thoughts yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to share your {mood?.toLowerCase()} thought.</p>
              <button 
                onClick={() => setShowComposer(true)}
                className="px-6 py-3 bg-purple-600 rounded-xl text-white hover:bg-purple-700 transition"
              >
                Share Your Thought
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <article key={post._id} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getMoodStyle())}>
                        {post.mood}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-700 flex items-center justify-center">
                          <span className="text-xs">{moodEmojis[post.mood]}</span>
                        </div>
                        <span className="text-sm text-white font-medium">{post.username || 'Anonymous'}</span>
                        <span className="text-xs text-muted-foreground">• {new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-secondary/50 rounded-lg">
                      <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>

                  <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleRelate(post._id)}
                        className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">I relate ({post.relates || 0})</span>
                      </button>
                      <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">Comment ({post.comments || 0})</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {post.type === "Open to Responses" ? (
                        <span className="flex items-center gap-1.5 text-xs text-cyan-400">
                          <MessageCircle className="w-4 h-4" />
                          Open to Responses
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          Just Vent
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <button className="p-1.5 hover:bg-secondary/50 rounded-lg">
                        <Bookmark className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
        <RightSidebar onMoodSelect={() => {}} />
      </div>
      
      <CreatePostModal 
        isOpen={showComposer} 
        onClose={() => setShowComposer(false)} 
        onPostCreated={fetchPosts}
        defaultMood={mood}
      />
    </div>
  );
};

export default MoodPage;