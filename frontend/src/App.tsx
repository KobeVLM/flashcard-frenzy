import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DeckDetailPage from './pages/DeckDetailPage';
import CreateDeckPage from './pages/CreateDeckPage';
import AddFlashcardPage from './pages/AddFlashcardPage';
import StudyModePage from './pages/StudyModePage';
import QuizModePage from './pages/QuizModePage';
import AdminPage from './pages/AdminPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public Routes ──────────────────────────────── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />

          {/* ── Protected Routes ───────────────────────────── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/decks"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/decks/new"
            element={
              <ProtectedRoute>
                <CreateDeckPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/decks/:id"
            element={
              <ProtectedRoute>
                <DeckDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/decks/:id/edit"
            element={
              <ProtectedRoute>
                <CreateDeckPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/decks/:id/cards/new"
            element={
              <ProtectedRoute>
                <AddFlashcardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cards/:cardId/edit"
            element={
              <ProtectedRoute>
                <AddFlashcardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/decks/:id/study"
            element={
              <ProtectedRoute>
                <StudyModePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/decks/:id/quiz"
            element={
              <ProtectedRoute>
                <QuizModePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* ── Admin Routes ───────────────────────────────── */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          {/* ── Fallback ───────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
