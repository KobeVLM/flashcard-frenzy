import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { PageLayout } from '../components/Sidebar';
import * as cardService from '../api/cardService';
import type { CreateFlashcardPayload } from '../types';

export default function AddFlashcardPage() {
  const { id: deckId, cardId } = useParams<{ id: string; cardId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // For editing, cardId might be in route params; deckId via search params
  const effectiveDeckId = deckId ?? searchParams.get('deckId') ?? '';
  const isEditing = !!cardId;

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditing && cardId) {
        const response = await cardService.updateCard(cardId, {
          question,
          answer,
          tags: tags.length > 0 ? tags : undefined,
        });
        if (response.success) {
          navigate(-1);
        } else {
          setError(response.error?.message ?? 'Failed to update card.');
        }
      } else {
        const payload: CreateFlashcardPayload = {
          question,
          answer,
          tags: tags.length > 0 ? tags : undefined,
        };
        const response = await cardService.createCard(effectiveDeckId, payload);
        if (response.success) {
          // Reset form for adding another card
          setQuestion('');
          setAnswer('');
          setTags([]);
          setError('');
          // Navigate back to deck detail
          navigate(`/decks/${effectiveDeckId}`);
        } else {
          setError(response.error?.message ?? 'Failed to create card.');
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
        Back to Deck
      </button>

      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isEditing ? 'Edit Flashcard' : 'Add New Card'}
        </h1>
        <p className="text-gray-500 mb-8">
          Tags help you organize and filter cards later.
        </p>

        {/* Pro Tip */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="material-icons text-amber-600 text-lg mt-0.5">tips_and_updates</span>
            <div>
              <p className="text-sm font-medium text-amber-800">Pro Tip</p>
              <p className="text-sm text-amber-700 mt-0.5">
                Keep your cards concise. One concept per card leads to 31% better retention during study sessions.
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter the question or prompt"
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Answer</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the answer"
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tags <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-3 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <span className="material-icons" style={{ fontSize: '14px' }}>close</span>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          {(question || answer) && (
            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Preview</p>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <p className="font-medium text-gray-900 mb-2">{question || 'Question preview...'}</p>
                <div className="border-t border-gray-100 pt-2">
                  <p className="text-sm text-gray-500">{answer || 'Answer preview...'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || !question.trim() || !answer.trim()}
              className="px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              {isEditing ? 'Save Changes' : 'Add Card'}
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
      </div>
    </PageLayout>
  );
}
