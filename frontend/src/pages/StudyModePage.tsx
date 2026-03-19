import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCards } from '../hooks/useCards';
import { useDeck } from '../hooks/useDeck';
import { PageLayout } from '../components/Sidebar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export default function StudyModePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deck } = useDeck(id!);
  const { cards, loading, error, refetch } = useCards(id!);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCount, setStudiedCount] = useState(0);

  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  const handleFlip = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setStudiedCount(studiedCount + 1);
    }
  }, [currentIndex, cards.length, studiedCount]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudiedCount(0);
  }, []);

  const isComplete = currentIndex === cards.length - 1 && isFlipped;

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/decks/${id}`)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span className="material-icons text-lg">arrow_back</span>
          Back to Deck
        </button>
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-xl border border-gray-100 px-4 py-2.5">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-gray-400">Studied</p>
                <p className="text-sm font-semibold text-gray-900">{studiedCount}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Remaining</p>
                <p className="text-sm font-semibold text-gray-900">{Math.max(0, cards.length - currentIndex - 1)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-sm font-semibold text-gray-900">{cards.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner message="Loading flashcards..." />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {!loading && !error && cards.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-indigo-600 text-3xl">content_copy</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">No cards to study</h3>
          <p className="text-sm text-gray-500 mb-6">Add some flashcards to this deck first.</p>
          <button
            onClick={() => navigate(`/decks/${id}/cards/new`)}
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Flashcards
          </button>
        </div>
      )}

      {!loading && !error && cards.length > 0 && currentCard && (
        <div className="max-w-2xl mx-auto">
          {/* Deck title */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{deck?.title ?? 'Study Mode'}</h2>
            <p className="text-sm text-gray-400 mt-1">Focus Mode Active • Minimal Distraction</p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-8">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Flashcard */}
          <div
            onClick={handleFlip}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 min-h-[320px] flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow select-none"
          >
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
              {isFlipped ? 'Answer' : 'Question'}
            </p>
            <p className="text-xl font-semibold text-gray-900 text-center leading-relaxed">
              {isFlipped ? currentCard.answer : currentCard.question}
            </p>
            <p className="mt-8 text-xs text-gray-400 flex items-center gap-1">
              <span className="material-icons text-sm">touch_app</span>
              Click to {isFlipped ? 'see question' : 'reveal answer'}
            </p>
          </div>

          {/* Card counter */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Card {currentIndex + 1} of {cards.length}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
            >
              <span className="material-icons text-sm">arrow_back</span>
              Previous
            </button>

            {isComplete ? (
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5"
              >
                <span className="material-icons text-sm">refresh</span>
                Start Over
              </button>
            ) : (
              <button
                onClick={isFlipped ? handleNext : handleFlip}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
              >
                {isFlipped ? (
                  <>
                    Next
                    <span className="material-icons text-sm">arrow_forward</span>
                  </>
                ) : (
                  <>
                    <span className="material-icons text-sm">visibility</span>
                    Show Answer
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
