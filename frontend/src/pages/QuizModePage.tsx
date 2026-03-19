import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCards } from '../hooks/useCards';
import { useDeck } from '../hooks/useDeck';
import { PageLayout } from '../components/Sidebar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import * as quizService from '../api/quizService';

type QuizState = 'in-progress' | 'completed';

export default function QuizModePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deck } = useDeck(id!);
  const { cards, loading, error, refetch } = useCards(id!);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState<Array<{ question: string; userAnswer: string; correctAnswer: string; isCorrect: boolean }>>([]);
  const [quizState, setQuizState] = useState<QuizState>('in-progress');
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? ((currentIndex) / cards.length) * 100 : 0;

  const handleSubmitAnswer = useCallback(() => {
    if (!currentCard || !userAnswer.trim()) return;

    const isCorrect = userAnswer.trim().toLowerCase() === currentCard.answer.trim().toLowerCase();
    const newAnswer = {
      question: currentCard.question,
      userAnswer: userAnswer.trim(),
      correctAnswer: currentCard.answer,
      isCorrect,
    };

    setAnswers([...answers, newAnswer]);
    setShowCorrectAnswer(true);
  }, [currentCard, userAnswer, answers]);

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setShowCorrectAnswer(false);
    } else {
      // Quiz complete — submit results
      setQuizState('completed');
    }
  }, [currentIndex, cards.length]);

  // Submit quiz results when completed
  useEffect(() => {
    if (quizState === 'completed' && !submitting && id) {
      setSubmitting(true);
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      const score = answers.filter((a) => a.isCorrect).length;

      quizService
        .submitQuizResult({
          deckId: id,
          score,
          totalQuestions: cards.length,
          timeSpent,
        })
        .catch(() => {
          // Silent fail — results page still shows
        })
        .finally(() => setSubmitting(false));
    }
  }, [quizState, answers, cards.length, id, submitting]);

  const score = answers.filter((a) => a.isCorrect).length;
  const totalTime = Math.round((Date.now() - startTimeRef.current) / 1000);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showCorrectAnswer) {
      handleSubmitAnswer();
    } else if (e.key === 'Enter' && showCorrectAnswer) {
      handleNext();
    }
  };

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/decks/${id}`)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <span className="material-icons text-lg">arrow_back</span>
          Exit Quiz
        </button>
        {quizState === 'in-progress' && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">
              Question {currentIndex + 1} of {cards.length}
            </span>
          </div>
        )}
      </div>

      {loading && <LoadingSpinner message="Loading quiz..." />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {!loading && !error && cards.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-indigo-600 text-3xl">quiz</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">No cards for quiz</h3>
          <p className="text-sm text-gray-500 mb-6">Add some flashcards to this deck first.</p>
          <button
            onClick={() => navigate(`/decks/${id}/cards/new`)}
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Flashcards
          </button>
        </div>
      )}

      {!loading && !error && cards.length > 0 && quizState === 'in-progress' && currentCard && (
        <div className="max-w-2xl mx-auto">
          {/* Quiz header */}
          <div className="text-center mb-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Quiz Progress</p>
            <p className="text-sm text-gray-500 mt-1">Session: {deck?.title ?? 'Quiz'}</p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-8">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-8">
              {currentCard.question}
            </h2>

            {!showCorrectAnswer ? (
              <div>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer here..."
                  autoFocus
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-center"
                />
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer.trim()}
                  className="w-full mt-4 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Check Answer
                </button>
              </div>
            ) : (
              <div>
                {/* Feedback */}
                <div
                  className={`p-4 rounded-lg mb-4 ${
                    answers[answers.length - 1]?.isCorrect
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`material-icons text-lg ${
                        answers[answers.length - 1]?.isCorrect ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {answers[answers.length - 1]?.isCorrect ? 'check_circle' : 'cancel'}
                    </span>
                    <p
                      className={`text-sm font-semibold ${
                        answers[answers.length - 1]?.isCorrect ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {answers[answers.length - 1]?.isCorrect ? 'Correct!' : 'Incorrect'}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Your answer:</span> {userAnswer}
                  </p>
                  {!answers[answers.length - 1]?.isCorrect && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Correct answer:</span> {currentCard.answer}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleNext}
                  className="w-full py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {currentIndex < cards.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-gray-400">
            Focused Study Mode • Version 2.4.0
          </p>
        </div>
      )}

      {/* Results Screen */}
      {quizState === 'completed' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-6">
              <span className="material-icons text-indigo-600 text-4xl">emoji_events</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <p className="text-gray-500 mb-8">{deck?.title}</p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-indigo-600">{score}</p>
                <p className="text-xs text-gray-500 mt-1">Correct</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-gray-900">{cards.length}</p>
                <p className="text-xs text-gray-500 mt-1">Total</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-green-600">
                  {cards.length > 0 ? Math.round((score / cards.length) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Score</p>
              </div>
            </div>

            {/* Time */}
            <p className="text-sm text-gray-500 mb-8">
              Time spent: {Math.floor(totalTime / 60)}m {totalTime % 60}s
            </p>

            {/* Answer Review */}
            <div className="text-left space-y-3 mb-8">
              <h3 className="font-semibold text-gray-900">Answer Review</h3>
              {answers.map((a, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border text-sm ${
                    a.isCorrect ? 'border-green-100 bg-green-50/50' : 'border-red-100 bg-red-50/50'
                  }`}
                >
                  <p className="font-medium text-gray-900">{a.question}</p>
                  <p className="text-gray-500 mt-1">
                    Your answer: <span className={a.isCorrect ? 'text-green-600' : 'text-red-600'}>{a.userAnswer}</span>
                  </p>
                  {!a.isCorrect && (
                    <p className="text-gray-500 mt-0.5">
                      Correct: <span className="text-green-600">{a.correctAnswer}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setUserAnswer('');
                  setAnswers([]);
                  setShowCorrectAnswer(false);
                  setQuizState('in-progress');
                  startTimeRef.current = Date.now();
                }}
                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Retry Quiz
              </button>
              <button
                onClick={() => navigate(`/decks/${id}`)}
                className="px-5 py-2.5 text-gray-700 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Deck
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
