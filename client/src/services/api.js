const API_URL = 'http://localhost:5000/api';

// ======================
// HELPER API CALL
// ======================

const apiCall = async (endpoint, options = {}) => {

  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {

    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );

    const data = await response.json();

    if (!response.ok) {

      throw new Error(
        data.error ||
        data.message ||
        'Something went wrong'
      );
    }

    return data;

  } catch (error) {

    console.error(
      `API Error (${endpoint}):`,
      error
    );

    throw error;
  }
};

// ======================
// AUTH APIs
// ======================

export const auth = {

  register: (userData) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () =>
    apiCall('/auth/me'),

  logout: () =>
    apiCall('/auth/logout', {
      method: 'POST',
    }),

  verifyEmail: (token) =>
    apiCall(`/auth/verify-email/${token}`),

  resendVerification: () =>
    apiCall('/auth/resend-verification', {
      method: 'POST',
    }),
};

// ======================
// POSTS APIs
// ======================

export const posts = {

  getAll: (params = {}) => {

    const queryString =
      new URLSearchParams(params).toString();

    return apiCall(
      `/posts${queryString ? `?${queryString}` : ''}`
    );
  },

  getOne: (id) =>
    apiCall(`/posts/${id}`),

  create: (postData) =>
    apiCall('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),

  relate: (postId) =>
    apiCall(`/posts/${postId}/relate`, {
      method: 'POST',
    }),

  delete: (postId) =>
    apiCall(`/posts/${postId}`, {
      method: 'DELETE',
    }),

  getMyPosts: () =>
    apiCall('/posts/user/my-posts'),

  bookmark: (postId) =>
    apiCall(`/posts/${postId}/bookmark`, {
      method: 'POST',
    }),

  report: (postId, reason) =>
    apiCall(`/posts/${postId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  getReported: () =>
    apiCall('/posts/reported'),

  adminDelete: (postId) =>
    apiCall(`/posts/admin/${postId}`, {
      method: 'DELETE',
    }),
};

// ======================
// COMMENTS APIs
// ======================

export const comments = {

  getByPost: (postId) =>
    apiCall(`/comments/post/${postId}`),

  create: (commentData) =>
    apiCall('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    }),

  delete: (commentId) =>
    apiCall(`/comments/${commentId}`, {
      method: 'DELETE',
    }),
};

// ======================
// CATEGORIES APIs
// ======================

export const categories = {

  getAll: () =>
    apiCall('/categories'),
};

// ======================
// ADMIN APIs
// ======================

export const admin = {

  getUsers: () =>
    apiCall('/admin/users'),

  banUser: (userId, reason) =>
    apiCall(`/admin/users/${userId}/ban`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    }),

  unbanUser: (userId) =>
    apiCall(`/admin/users/${userId}/unban`, {
      method: 'PUT',
    }),

  deleteUser: (userId) =>
    apiCall(`/admin/users/${userId}`, {
      method: 'DELETE',
    }),
};