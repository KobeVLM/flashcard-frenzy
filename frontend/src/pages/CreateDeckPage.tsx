import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/Sidebar';
import * as deckService from '../api/deckService';
import type { CreateDeckPayload } from '../types';

export default function CreateDeckPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id && id !== 'new';

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingDeck, setFetchingDeck] = useState(false);
  const [error, setError] = useState('');

  // Load existing deck data if editing
  useEffect(() => {
    if (isEditing) {
      setFetchingDeck(true);
      deckService.getDeck(id).then((response) => {
        if (response.success && response.data) {
          setTitle(response.data.title);
          setCategory(response.data.category ?? '');
          setDescription(response.data.description ?? '');
        }
        setFetchingDeck(false);
      }).catch(() => setFetchingDeck(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditing) {
        const response = await deckService.updateDeck(id, {
          title,
          category: category || undefined,
          description: description || undefined,
        });
        if (response.success) {
          navigate(`/decks/${id}`);
        } else {
          setError(response.error?.message ?? 'Failed to update deck.');
        }
      } else {
        const payload: CreateDeckPayload = {
          title,
          category: category || undefined,
          description: description || undefined,
        };
        const response = await deckService.createDeck(payload);
        if (response.success && response.data) {
          navigate(`/decks/${response.data.id}`);
        } else {
          setError(response.error?.message ?? 'Failed to create deck.');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <span className="material-icons text-lg">arrow_back</span>
        Back
      </button>

      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isEditing ? 'Edit Deck' : 'Create New Deck'}
        </h1>
        <p className="text-gray-500 mb-8">
          Organize your learning by grouping flashcards into topical decks.
        </p>

        {/* Quick tip */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="material-icons text-indigo-600 text-lg mt-0.5">lightbulb</span>
            <div>
              <p className="text-sm font-medium text-indigo-800">Quick Tip</p>
              <p className="text-sm text-indigo-600 mt-0.5">
                You can add flashcards immediately after creating the deck. Use tags to further
                categorize your cards within the deck.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <span className="material-icons text-sm">error</span>
              {error}
            </p>
          </div>
        )}

        {fetchingDeck ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Deck Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Spanish Vocabulary 101"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Languages, Science, History"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will this deck cover?"
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                )}
                {isEditing ? 'Save Changes' : 'Create Deck'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <footer className="mt-16 text-xs text-gray-400">
        © 2024 Flashcard Frenzy. Design for efficient learners.
      </footer>
    </PageLayout>
  );
}
