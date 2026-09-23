import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { Toaster }
from 'react-hot-toast';

import { AuthProvider }
from './context/AuthContext';

import ProtectedRoute
from './components/ProtectedRoute';

import LandingPage
from './pages/LandingPage';

import LoginPage
from './pages/LoginPage';

import RegisterPage
from './pages/RegisterPage';

import HomePage
from './pages/HomePage';

import MoodPage
from './pages/MoodPage';

import ChatbotPage
from './pages/ChatbotPage';

import ProfilePage
from './pages/ProfilePage';

import AdminPage
from './pages/AdminPage';

import ChatRoomPage
from './pages/ChatRoomPage';

function App() {

  return (

    <BrowserRouter>

      <AuthProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#fff',
              borderRadius: '12px',
              border:
                '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />

        <Routes>

          {/* PUBLIC */}

          <Route
            path="/"
            element={<LandingPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route
            path="/chatbot"
            element={<ChatbotPage />}
          />

          {/* DASHBOARD */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* PROFILE */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* BOOKMARKS */}

          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* MOOD ROOMS */}

          <Route
            path="/mood/:mood"
            element={
              <ProtectedRoute>
                <MoodPage />
              </ProtectedRoute>
            }
          />

          {/* CHAT ROOMS */}

          <Route
            path="/chatroom/:mood"
            element={
              <ProtectedRoute>
                <ChatRoomPage />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}

          <Route
            path="*"
            element={
              <ProtectedRoute fallbackPath="/">
                <Navigate
                  to="/dashboard"
                  replace
                />
              </ProtectedRoute>
            }
          />

        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;