
import React, {
  useState,
  useEffect
} from 'react';

import {
  useSearchParams,
  useLocation
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { posts as postsAPI }
from '../services/api';

import { Sidebar }
from '../components/layout/Sidebar';

import { Header }
from '../components/layout/Header';

import { RightSidebar }
from '../components/layout/RightSidebar';

import { MainFeed }
from '../components/feed/MainFeed';

import CreatePostModal
from '../components/CreatePostModal';

import toast from 'react-hot-toast';

const HomePage = () => {

  const { user } = useAuth();

  const location = useLocation();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showComposer, setShowComposer] =
    useState(false);

  const [filterMood, setFilterMood] =
    useState(
      searchParams.get('mood') || null
    );

  useEffect(() => {

    fetchPosts();

  }, [filterMood, location.pathname]);

  const fetchPosts = async () => {

    setLoading(true);

    try {

      const params =
        filterMood
          ? { mood: filterMood }
          : {};

      const response =
        await postsAPI.getAll(params);

      let fetchedPosts =
        response.data || [];

      // BOOKMARK PAGE

      if (
        location.pathname === "/bookmarks"
      ) {

        const savedPosts =
          user?.savedPosts || [];

        fetchedPosts =
          fetchedPosts.filter((post) =>
            savedPosts.includes(post._id)
          );
      }

      setPosts(fetchedPosts);

    } catch (error) {

      console.error(
        'Failed to fetch posts:',
        error
      );

      toast.error('Failed to load posts');

    } finally {

      setLoading(false);
    }
  };

  const handleMoodSelect = (emoji) => {

    const moodMap = {
      '😠': 'Angry',
      '😢': 'Sad',
      '😕': 'Confused',
      '😊': 'Happy'
    };

    const mood = moodMap[emoji];

    if (mood) {

      setFilterMood(mood);

      setSearchParams({ mood });
    }
  };

  return (

    <div className="min-h-screen bg-background">

      <Sidebar />

      <Header
        onOpenComposer={() =>
          setShowComposer(true)
        }
      />

      <div className="flex ml-64 mt-16">

        <MainFeed
          posts={posts}
          loading={loading}
          onRelate={fetchPosts}
          onOpenComposer={() =>
            setShowComposer(true)
          }
        />

        <RightSidebar
          onMoodSelect={handleMoodSelect}
        />

      </div>

      <CreatePostModal
        isOpen={showComposer}
        onClose={() =>
          setShowComposer(false)
        }
        onPostCreated={fetchPosts}
      />

    </div>
  );
};

export default HomePage;

