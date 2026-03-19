import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDecks } from '../hooks/useDecks';
import { PageLayout } from '../components/Sidebar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { DeckCard } from '../components/DeckCard';
import { StatCard } from '../components/StatCard';

export default function DashboardPage() {
  const { user } = useAuth();
  const { decks, loading, error, refetch } = useDecks();
  const navigate = useNavigate();

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const totalCards = decks.reduce((sum, d) => sum + (d.cardCount ?? 0), 0);

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.fullName?.split(' ')[0] ?? 'Scholar'}
        </h2>
        <p className="text-gray-500 mt-1">
          You have {totalCards} cards across {decks.length} decks. Ready to start?
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Today is" value={formattedDate} icon="calendar_today" />
        <StatCard label="Total Decks" value={decks.length} icon="layers" />
        <StatCard label="Total Cards" value={totalCards} icon="content_copy" />
        <StatCard label="Current Streak" value="—" icon="local_fire_department" subtitle="Start studying!" />
      </div>

      {/* Deck List */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900">Your Decks</h3>
      </div>

      {loading && <LoadingSpinner message="Loading your decks..." />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {!loading && !error && (
        <>
          {decks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-indigo-600 text-3xl">layers</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No decks yet</h3>
              <p className="text-sm text-gray-500 mb-6">Create your first deck to start studying!</p>
              <button
                onClick={() => navigate('/decks/new')}
                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create New Deck
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {decks.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  onClick={() => navigate(`/decks/${deck.id}`)}
                />
              ))}

              {/* Create New Deck Card */}
              <div
                onClick={() => navigate('/decks/new')}
                className="rounded-xl border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all min-h-[160px] group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-colors">
                  <span className="material-icons text-gray-400 group-hover:text-indigo-600 transition-colors">
                    add
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-500 group-hover:text-indigo-600 transition-colors">
                  Create New Deck
                </p>
                <p className="text-xs text-gray-400 mt-1">Organize your next subject</p>
              </div>
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}
