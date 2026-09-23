import React, {
  useEffect,
  useState
} from "react";

import { useAuth }
from "../context/AuthContext";

import { posts as postsAPI }
from "../services/api";

import { Sidebar }
from "../components/layout/Sidebar";

import { Header }
from "../components/layout/Header";

import {
  Heart,
  Bookmark,
  Calendar,
  FileText
} from "lucide-react";

const ProfilePage = () => {

  const { user } = useAuth();

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchMyPosts();

  }, []);

  const fetchMyPosts = async () => {

    try {

      const response =
        await postsAPI.getMyPosts();

      if (response.success) {
        setPosts(response.data || []);
      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  const moodStats = {

    Angry:
      posts.filter(p => p.mood === "Angry").length,

    Sad:
      posts.filter(p => p.mood === "Sad").length,

    Confused:
      posts.filter(p => p.mood === "Confused").length,

    Happy:
      posts.filter(p => p.mood === "Happy").length,
  };

  return (

    <div className="min-h-screen bg-background">

      <Sidebar />

      <Header />

      <main className="ml-64 mt-16 p-6">

        {/* PROFILE CARD */}

        <div className="bg-card border border-border rounded-2xl p-8 mb-6">

          <div className="flex items-center gap-6">

            <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-4xl font-bold text-white">

              {user?.username?.charAt(0)?.toUpperCase()}

            </div>

            <div>

              <h1 className="text-3xl font-bold text-white mb-2">

                {user?.username}

              </h1>

              <p className="text-muted-foreground mb-2">

                {user?.email}

              </p>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">

                <Calendar className="w-4 h-4" />

                Joined {
                  new Date(
                    user?.createdAt
                  ).toLocaleDateString()
                }

              </div>

            </div>

          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-card border border-border rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-3">

              <FileText className="w-6 h-6 text-purple-400" />

              <h3 className="text-lg font-semibold text-white">
                Total Posts
              </h3>

            </div>

            <p className="text-3xl font-bold text-purple-400">
              {posts.length}
            </p>

          </div>

          <div className="bg-card border border-border rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-3">

              <Bookmark className="w-6 h-6 text-yellow-400" />

              <h3 className="text-lg font-semibold text-white">
                Saved Posts
              </h3>

            </div>

            <p className="text-3xl font-bold text-yellow-400">
              {user?.savedPosts?.length || 0}
            </p>

          </div>

          <div className="bg-card border border-border rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-3">

              <Heart className="w-6 h-6 text-pink-400" />

              <h3 className="text-lg font-semibold text-white">
                Mood Activity
              </h3>

            </div>

            <div className="space-y-1 text-sm text-muted-foreground">

              <p>😠 Angry: {moodStats.Angry}</p>

              <p>😢 Sad: {moodStats.Sad}</p>

              <p>😕 Confused: {moodStats.Confused}</p>

              <p>😊 Happy: {moodStats.Happy}</p>

            </div>

          </div>

        </div>

        {/* MY POSTS */}

        <div className="bg-card border border-border rounded-2xl p-6">

          <h2 className="text-2xl font-bold text-white mb-6">

            My Posts

          </h2>

          {loading ? (

            <p className="text-muted-foreground">
              Loading...
            </p>

          ) : posts.length === 0 ? (

            <p className="text-muted-foreground">
              No posts yet.
            </p>

          ) : (

            <div className="space-y-4">

              {posts.map((post) => (

                <div
                  key={post._id}
                  className="bg-secondary/30 border border-border rounded-xl p-5"
                >

                  <div className="flex items-center gap-3 mb-3">

                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">

                      {post.mood}

                    </span>

                    <span className="text-xs text-muted-foreground">

                      {new Date(
                        post.createdAt
                      ).toLocaleString()}

                    </span>

                  </div>

                  <p className="text-white leading-relaxed">

                    {post.content}

                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>
  );
};

export default ProfilePage;