import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDeck } from '../hooks/useDeck';
import { useCards } from '../hooks/useCards';
import { PageLayout } from '../components/Sidebar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { StatCard } from '../components/StatCard';
import * as cardService from '../api/cardService';
import * as deckService from '../api/deckService';

export default function DeckDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deck, loading: deckLoading, error: deckError, refetch: refetchDeck } = useDeck(id!);
  const { cards, loading: cardsLoading, error: cardsError, refetch: refetchCards } = useCards(id!);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loading = deckLoading || cardsLoading;
  const error = deckError || cardsError;

  const handleDeleteCard = async (cardId: string) => {
    setDeleting(true);
    try {
      await cardService.deleteCard(cardId);
      setDeleteConfirm(null);
      refetchCards();
    } catch {
      // Error handled silently
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteDeck = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await deckService.deleteDeck(id);
      navigate('/dashboard');
    } catch {
      // Error handled silently
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageLayout>
      {/* Back navigation */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <span className="material-icons text-lg">arrow_back</span>
        My Decks
      </button>

      {loading && <LoadingSpinner message="Loading deck details..." />}
      {error && <ErrorMessage message={error} onRetry={() => { refetchDeck(); refetchCards(); }} />}

      {!loading && !error && deck && (
        <>
          {/* Deck Header */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{deck.title}</h1>
                <p className="text-gray-500 mt-1">{deck.description ?? 'No description'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/decks/${id}/edit`)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-icons text-sm">edit</span>
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm('deck')}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-icons text-sm">delete</span>
                  Delete
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total Cards" value={cards.length} icon="content_copy" />
              <StatCard label="Category" value={deck.category ?? 'General'} icon="label" />
              <StatCard
                label="Created"
                value={new Date(deck.createdAt).toLocaleDateString()}
                icon="calendar_today"
              />
              <StatCard label="Mastered" value="—" icon="check_circle" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(`/decks/${id}/study`)}
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              disabled={cards.length === 0}
            >
              <span className="material-icons text-sm">book_5</span>
              Study Mode
            </button>
            <button
              onClick={() => navigate(`/decks/${id}/quiz`)}
              className="px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
              disabled={cards.length === 0}
            >
              <span className="material-icons text-sm">quiz</span>
              Quiz Mode
            </button>
            <button
              onClick={() => navigate(`/decks/${id}/cards/new`)}
              className="px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 ml-auto"
            >
              <span className="material-icons text-sm">add</span>
              Add Card
            </button>
          </div>

          {/* Card List */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cards in this deck</h3>
          </div>

          {cards.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-indigo-600 text-3xl">content_copy</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No cards yet</h3>
              <p className="text-sm text-gray-500 mb-6">Add your first flashcard to this deck!</p>
              <button
                onClick={() => navigate(`/decks/${id}/cards/new`)}
                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Flashcard
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 mb-1">{card.question}</p>
                      <p className="text-sm text-gray-500">{card.answer}</p>
                      {card.tags && card.tags.length > 0 && (
                        <div className="flex gap-1.5 mt-2">
                          {card.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <button
                        onClick={() => navigate(`/cards/${card.id}/edit?deckId=${id}`)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <span className="material-icons text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(card.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <span className="material-icons text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {deleteConfirm === 'deck' ? 'Delete Deck?' : 'Delete Card?'}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {deleteConfirm === 'deck'
                    ? 'This will permanently delete the deck and all its flashcards. This cannot be undone.'
                    : 'This will permanently remove this flashcard. This cannot be undone.'}
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      deleteConfirm === 'deck' ? handleDeleteDeck() : handleDeleteCard(deleteConfirm)
                    }
                    disabled={deleting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}
