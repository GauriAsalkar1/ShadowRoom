import React, { useEffect, useState } from 'react';

import {
  Shield,
  Users,
  Flag,
  Ban,
  Trash2,
  Search,
  AlertTriangle
} from 'lucide-react';

import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

import { admin, posts } from '../services/api';

import toast from 'react-hot-toast';

const AdminPage = () => {

  const [users, setUsers] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {

    fetchUsers();
    fetchReportedPosts();

  }, []);

  const fetchUsers = async () => {

    try {

      const response = await admin.getUsers();

      setUsers(response.data || []);

    } catch (error) {

      toast.error('Failed to load users');
    }
  };

  const fetchReportedPosts = async () => {

    try {

      const response = await posts.getReported();

      setReportedPosts(response.data || []);

    } catch (error) {

      toast.error('Failed to load reports');
    }
  };

  const handleBan = async (id) => {

    try {

      await admin.banUser(id, 'Community violation');

      toast.success('User banned');

      fetchUsers();

    } catch (error) {

      toast.error(error.message);
    }
  };

  const handleUnban = async (id) => {

    try {

      await admin.unbanUser(id);

      toast.success('User unbanned');

      fetchUsers();

    } catch (error) {

      toast.error(error.message);
    }
  };

  const handleDeleteUser = async (id) => {

    const confirmDelete =
      window.confirm('Delete this user permanently?');

    if (!confirmDelete) return;

    try {

      await admin.deleteUser(id);

      toast.success('User deleted');

      fetchUsers();

    } catch (error) {

      toast.error(error.message);
    }
  };

  const handleDeletePost = async (id) => {

    const confirmDelete =
      window.confirm('Delete reported post?');

    if (!confirmDelete) return;

    try {

      await posts.adminDelete(id);

      toast.success('Post deleted');

      fetchReportedPosts();

    } catch (error) {

      toast.error(error.message);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const bannedUsers =
    users.filter((u) => u.isBanned).length;

  return (

    <div className="min-h-screen bg-background">

      <Sidebar />

      <Header />

      <main className="ml-64 mt-16 p-6 text-white">

        {/* HEADER */}

        <div className="flex items-center gap-3 mb-10">

          <Shield className="text-purple-400" size={40} />

          <div>

            <h1 className="text-4xl font-bold">
              Admin Dashboard
            </h1>

            <p className="text-gray-400">
              Shadowroom moderation panel
            </p>

          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-card p-6 rounded-2xl border border-border">

            <Users className="text-blue-400 mb-3" />

            <h2 className="text-3xl font-bold">
              {users.length}
            </h2>

            <p className="text-gray-400">
              Total Users
            </p>

          </div>

          <div className="bg-card p-6 rounded-2xl border border-border">

            <Flag className="text-red-400 mb-3" />

            <h2 className="text-3xl font-bold">
              {reportedPosts.length}
            </h2>

            <p className="text-gray-400">
              Reported Posts
            </p>

          </div>

          <div className="bg-card p-6 rounded-2xl border border-border">

            <Ban className="text-yellow-400 mb-3" />

            <h2 className="text-3xl font-bold">
              {bannedUsers}
            </h2>

            <p className="text-gray-400">
              Banned Users
            </p>

          </div>

          <div className="bg-card p-6 rounded-2xl border border-border">

            <AlertTriangle className="text-purple-400 mb-3" />

            <h2 className="text-3xl font-bold">
              {users.length + reportedPosts.length}
            </h2>

            <p className="text-gray-400">
              Moderation Actions
            </p>

          </div>

        </div>

        {/* SEARCH */}

        <div className="bg-card border border-border rounded-2xl p-4 mb-8 flex items-center gap-3">

          <Search className="text-gray-400" />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full"
          />

        </div>

        {/* USERS */}

        <div className="mb-12">

          <h2 className="text-2xl font-bold mb-6">
            Users Management
          </h2>

          <div className="space-y-4">

            {filteredUsers.map((user) => (

              <div
                key={user._id}
                className="bg-card border border-border p-5 rounded-2xl flex justify-between items-center"
              >

                <div>

                  <div className="flex items-center gap-3">

                    <h3 className="font-bold text-lg">
                      {user.username}
                    </h3>

                    {user.isBanned ? (

                      <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                        BANNED
                      </span>

                    ) : (

                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                        ACTIVE
                      </span>

                    )}

                  </div>

                  <p className="text-gray-400 text-sm">
                    {user.email}
                  </p>

                </div>

                <div className="flex gap-3">

                  {!user.isBanned ? (

                    <button
                      onClick={() => handleBan(user._id)}
                      className="bg-yellow-600 hover:bg-yellow-700 transition px-4 py-2 rounded-xl"
                    >
                      Ban
                    </button>

                  ) : (

                    <button
                      onClick={() => handleUnban(user._id)}
                      className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-xl"
                    >
                      Unban
                    </button>

                  )}

                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-xl flex items-center gap-2"
                  >

                    <Trash2 size={16} />

                    Delete

                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* REPORTED POSTS */}

        <div>

          <h2 className="text-2xl font-bold mb-6">
            Reported Posts
          </h2>

          <div className="space-y-5">

            {reportedPosts.map((post) => (

              <div
                key={post._id}
                className="bg-card border border-red-500/20 p-6 rounded-2xl"
              >

                <div className="flex justify-between items-start mb-4">

                  <div>

                    <div className="flex items-center gap-2 mb-2">

                      <Flag className="text-red-400" size={18} />

                      <span className="text-red-400 font-bold">
                        {post.reportCount} Reports
                      </span>

                    </div>

                    <p className="font-bold">
                      @{post.username}
                    </p>

                  </div>

                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-xl"
                  >
                    Remove Post
                  </button>

                </div>

                <div className="bg-secondary/40 p-4 rounded-xl mb-4">

                  <p className="text-gray-200">
                    {post.content}
                  </p>

                </div>

                <div className="flex flex-wrap gap-2">

                  {post.reportReasons?.map((reason, index) => (

                    <span
                      key={index}
                      className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm"
                    >
                      {reason}
                    </span>

                  ))}

                </div>

              </div>

            ))}

          </div>

        </div>

      </main>

    </div>
  );
};

export default AdminPage;