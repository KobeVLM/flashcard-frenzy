import React from 'react';
import type { Deck } from '../types';

interface DeckCardProps {
  deck: Deck;
  onClick: () => void;
}

export function DeckCard({ deck, onClick }: DeckCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
          <span className="material-icons text-indigo-600">style</span>
        </div>
        <span className="text-xs text-gray-400 font-medium">{deck.category ?? 'General'}</span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{deck.title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
        {deck.description ?? 'No description'}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="material-icons text-sm">content_copy</span>
          {deck.cardCount ?? 0} cards
        </span>
        <span className="material-icons text-sm opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500">
          arrow_forward
        </span>
      </div>
    </div>
  );
}
