import React, {
  useState,
  useEffect
} from "react";

import {
  Heart,
  MessageSquare,
  Lock,
  Bookmark,
  MoreHorizontal,
  MessageCircle,
  Feather,
  Send,
  Trash2,
  Flag
} from "lucide-react";

import { posts as postsAPI } from "../../services/api";

import {
  comments as commentsAPI
} from "../../services/api";

import { useAuth }
from "../../context/AuthContext";

import toast
from "react-hot-toast";

export const MainFeed = ({
  posts,
  loading,
  onRelate,
  onOpenComposer,
  bookmarkedOnly = false
}) => {

  const { user, token } = useAuth();

  const [openComments, setOpenComments] =
    useState(null);

  const [comments, setComments] =
    useState({});

  const [commentInputs, setCommentInputs] =
    useState({});

  const [savedPosts, setSavedPosts] =
    useState([]);

  const [showReportMenu, setShowReportMenu] =
    useState(null);

  useEffect(() => {

    if (user?.savedPosts) {
      setSavedPosts(user.savedPosts);
    }

  }, [user]);

  const handleRelate = async (postId) => {

    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {

      await postsAPI.relate(postId);

      if (onRelate) {
        onRelate();
      }

    } catch (error) {

      toast.error(
        error.message ||
        "Failed to relate"
      );
    }
  };

  const fetchComments = async (postId) => {

    try {

      const response =
        await commentsAPI.getByPost(postId);

      setComments(prev => ({
        ...prev,
        [postId]: response.data || []
      }));

    } catch (error) {

      toast.error(
        "Failed to fetch comments"
      );
    }
  };

  const toggleComments = async (postId) => {

    if (openComments === postId) {

      setOpenComments(null);

    } else {

      setOpenComments(postId);

      if (!comments[postId]) {
        await fetchComments(postId);
      }
    }
  };

  const handleCommentSubmit = async (
    postId
  ) => {

    const content =
      commentInputs[postId];

    if (!content?.trim()) {
      return;
    }

    try {

      const response =
        await commentsAPI.create({
          postId,
          content
        });

      setComments(prev => ({
        ...prev,
        [postId]: [
          response.data,
          ...(prev[postId] || [])
        ]
      }));

      setCommentInputs(prev => ({
        ...prev,
        [postId]: ""
      }));

      toast.success(
        "Comment added"
      );

      if (onRelate) {
        onRelate();
      }

    } catch (error) {

      toast.error(
        error.message ||
        "Failed to add comment"
      );
    }
  };

  const handleDeleteComment = async (
    commentId,
    postId
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this comment?"
      );

    if (!confirmDelete) return;

    try {

      await commentsAPI.delete(commentId);

      setComments(prev => ({
        ...prev,
        [postId]:
          prev[postId].filter(
            c => c._id !== commentId
          )
      }));

      toast.success(
        "Comment deleted"
      );

      if (onRelate) {
        onRelate();
      }

    } catch (error) {

      toast.error(
        error.message ||
        "Failed to delete comment"
      );
    }
  };

  const handleDeletePost = async (
    postId
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this post permanently?"
      );

    if (!confirmDelete) return;

    try {

      await postsAPI.delete(postId);

      toast.success(
        "Post deleted successfully"
      );

      if (onRelate) {
        onRelate();
      }

    } catch (error) {

      toast.error(
        error.message ||
        "Failed to delete post"
      );
    }
  };

  const handleBookmark = async (
    postId
  ) => {

    try {

      const response =
        await postsAPI.bookmark(postId);

      if (response.saved) {

        setSavedPosts(prev => [
          ...prev,
          postId
        ]);

        toast.success(
          "Post saved"
        );

      } else {

        setSavedPosts(prev =>
          prev.filter(
            id => id !== postId
          )
        );

        toast.success(
          "Bookmark removed"
        );
      }

      if (onRelate) {
        onRelate();
      }

    } catch (error) {

      toast.error(
        error.message ||
        "Failed to bookmark"
      );
    }
  };

  const handleReport = async (
    postId,
    reason
  ) => {

    if (!token) {

      toast.error(
        "Please login first"
      );

      return;
    }

    try {

      const response =
        await postsAPI.report(
          postId,
          reason
        );

      if (response.success) {

        toast.success(
          "Post reported successfully"
        );

        setShowReportMenu(null);
      }

    } catch (error) {

      toast.error(
        error.message ||
        "Failed to report post"
      );
    }
  };

  if (loading) {

    return (

      <div className="flex-1 flex items-center justify-center text-white">

        Loading posts...

      </div>
    );
  }

  const displayedPosts =
    bookmarkedOnly
      ? posts.filter(post =>
          savedPosts.includes(post._id)
        )
      : posts;

  return (

    <main className="flex-1 max-w-4xl mx-auto p-6">

      {displayedPosts.length === 0 ? (

        <div className="text-center py-20">

          <Feather className="w-16 h-16 text-muted-foreground mx-auto mb-4" />

          <h3 className="text-2xl font-bold text-white mb-2">

            No posts found

          </h3>

        </div>

      ) : (

        <div className="space-y-6">

          {displayedPosts.map((post) => (

            <div
              key={post._id}
              className="bg-card border border-border rounded-2xl p-6"
            >

              {/* HEADER */}

              <div className="flex items-start justify-between mb-4">

                <div className="flex items-center gap-3">

                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300">

                    {post.mood}

                  </span>

                  <span className="font-semibold text-white">

                    {post.username}

                  </span>

                </div>

                <div className="flex items-center gap-3">

                  {user?._id === post.userId && (

                    <button
                      onClick={() =>
                        handleDeletePost(post._id)
                      }
                      className="text-red-400 hover:text-red-300"
                    >

                      <Trash2 className="w-5 h-5" />

                    </button>
                  )}

                  <div className="relative">

                    <button
                      onClick={() =>
                        setShowReportMenu(
                          showReportMenu === post._id
                            ? null
                            : post._id
                        )
                      }
                      className="p-1 hover:bg-secondary/50 rounded-lg"
                    >

                      <MoreHorizontal className="w-5 h-5 text-muted-foreground" />

                    </button>

                    {showReportMenu === post._id && (

                      <div className="absolute right-0 mt-2 w-52 bg-[#1e1e2f] border border-border rounded-xl shadow-lg z-50 p-2">

                        <div className="text-xs text-gray-400 px-3 py-2">

                          Report Post

                        </div>

                        {[
                          "Harassment",
                          "Spam",
                          "Hate Speech",
                          "Self Harm",
                          "Violence",
                          "NSFW"
                        ].map((reason) => (

                          <button
                            key={reason}
                            onClick={() =>
                              handleReport(
                                post._id,
                                reason
                              )
                            }
                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-white hover:bg-purple-600 rounded-lg transition"
                          >

                            <Flag className="w-4 h-4" />

                            {reason}

                          </button>

                        ))}

                      </div>

                    )}

                  </div>

                </div>

              </div>

              {/* CONTENT */}

              <p className="text-white text-lg leading-relaxed mb-6">

                {post.content}

              </p>

              {/* ACTIONS */}

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-6">

                  <button
                    onClick={() =>
                      handleRelate(post._id)
                    }
                    className="flex items-center gap-2 text-pink-400 hover:text-pink-300"
                  >

                    <Heart className="w-5 h-5" />

                    <span>
                      relate ({post.relates})
                    </span>

                  </button>

                  <button
                    onClick={() =>
                      toggleComments(post._id)
                    }
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                  >

                    <MessageSquare className="w-5 h-5" />

                    <span>
                      Comment ({post.comments})
                    </span>

                  </button>

                </div>

                <div className="flex items-center gap-4">

                  <button
                    onClick={() =>
                      handleBookmark(post._id)
                    }
                    className={`${
                      savedPosts.includes(post._id)
                        ? "text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  >

                    <Bookmark className="w-5 h-5" />

                  </button>

                  <div className="flex items-center gap-2 text-cyan-400">

                    <MessageCircle className="w-5 h-5" />

                    <span className="text-sm">

                      {post.type}

                    </span>

                  </div>

                </div>

              </div>

              {/* COMMENTS */}

              {openComments === post._id && (

                <div className="mt-6 border-t border-border pt-4">

                  {post.type ===
                  "Open to Responses" ? (

                    <>
                      <div className="flex gap-3 mb-4">

                        <input
                          type="text"
                          value={
                            commentInputs[
                              post._id
                            ] || ""
                          }
                          onChange={(e) =>
                            setCommentInputs(
                              prev => ({
                                ...prev,
                                [post._id]:
                                  e.target.value
                              })
                            )
                          }
                          placeholder="Write a comment..."
                          className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3 text-white outline-none"
                        />

                        <button
                          onClick={() =>
                            handleCommentSubmit(
                              post._id
                            )
                          }
                          className="bg-purple-600 hover:bg-purple-700 px-4 rounded-xl"
                        >

                          <Send className="w-5 h-5 text-white" />

                        </button>

                      </div>

                      <div className="space-y-3">

                        {(comments[
                          post._id
                        ] || []).map(
                          (comment) => (

                            <div
                              key={comment._id}
                              className="bg-secondary/40 rounded-xl p-4"
                            >

                              <div className="flex justify-between items-start">

                                <div>

                                  <p className="font-semibold text-purple-300 text-sm mb-1">

                                    {
                                      comment.username
                                    }

                                  </p>

                                  <p className="text-white">

                                    {
                                      comment.content
                                    }

                                  </p>

                                </div>

                                {user?._id ===
                                  comment.userId && (

                                  <button
                                    onClick={() =>
                                      handleDeleteComment(
                                        comment._id,
                                        post._id
                                      )
                                    }
                                    className="text-red-400 hover:text-red-300"
                                  >

                                    <Trash2 className="w-4 h-4" />

                                  </button>

                                )}

                              </div>

                            </div>

                          )
                        )}

                      </div>
                    </>

                  ) : (

                    <div className="flex items-center gap-2 text-muted-foreground">

                      <Lock className="w-4 h-4" />

                      <p>
                        Comments disabled for
                        this post
                      </p>

                    </div>

                  )}

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </main>
  );
};