'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Flame, BookOpen } from 'lucide-react'
import CreateDeckModal from '@/components/modals/create-deck-modal'

interface DeckData {
  id: number
  title: string
  description: string
  cardCount: number
  progress: number
  dueToday: number
  lastStudied: string
}

interface DashboardProps {
  onDeckSelect: (page: 'deck', deckId: number) => void
}

export default function Dashboard({ onDeckSelect }: DashboardProps) {
  const [decks, setDecks] = useState<DeckData[]>([
    {
      id: 1,
      title: 'Spanish Vocabulary',
      description: 'Common Spanish words and phrases',
      cardCount: 45,
      progress: 60,
      dueToday: 12,
      lastStudied: '2 hours ago',
    },
    {
      id: 2,
      title: 'Biology Terms',
      description: 'Essential biology terminology',
      cardCount: 78,
      progress: 35,
      dueToday: 8,
      lastStudied: 'Yesterday',
    },
    {
      id: 3,
      title: 'French Grammar',
      description: 'French grammar rules and exceptions',
      cardCount: 52,
      progress: 45,
      dueToday: 15,
      lastStudied: '3 days ago',
    },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateDeck = (deckData: {
    title: string
    description: string
  }) => {
    const newDeck: DeckData = {
      id: Math.max(...decks.map(d => d.id), 0) + 1,
      title: deckData.title,
      description: deckData.description,
      cardCount: 0,
      progress: 0,
      dueToday: 0,
      lastStudied: 'Never',
    }
    setDecks([...decks, newDeck])
    setIsModalOpen(false)
  }

  const totalCards = decks.reduce((sum, deck) => sum + deck.cardCount, 0)
  const totalDue = decks.reduce((sum, deck) => sum + deck.dueToday, 0)
  const maxStreak = 15

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
          Welcome back, Student!
        </h1>
        <p className="text-muted-foreground">
          Continue your learning journey today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 bg-white border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">
                Total Decks
              </p>
              <p className="text-3xl font-bold text-primary">{decks.length}</p>
            </div>
            <BookOpen className="text-primary/20" size={40} />
          </div>
        </Card>

        <Card className="p-6 bg-white border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">
                Due Today
              </p>
              <p className="text-3xl font-bold text-secondary">{totalDue}</p>
            </div>
            <div className="text-secondary/20 text-4xl">📋</div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">
                Current Streak
              </p>
              <p className="text-3xl font-bold text-accent">{maxStreak} days</p>
            </div>
            <Flame className="text-accent/20" size={40} />
          </div>
        </Card>
      </div>

      {/* Decks Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Your Decks</h2>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 bg-primary text-white hover:bg-primary/90"
          >
            <Plus size={20} />
            New Deck
          </Button>
        </div>

        {decks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map(deck => (
              <Card
                key={deck.id}
                className="p-6 bg-white border border-border hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onDeckSelect('deck', deck.id)}
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {deck.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {deck.description}
                  </p>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      {deck.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${deck.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4 pb-4 border-b border-border">
                  <div>
                    <p className="font-semibold text-foreground">
                      {deck.cardCount}
                    </p>
                    <p className="text-muted-foreground">Cards</p>
                  </div>
                  <div>
                    <p className="font-semibold text-secondary">
                      {deck.dueToday}
                    </p>
                    <p className="text-muted-foreground">Due Today</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {deck.lastStudied}
                    </p>
                    <p className="text-muted-foreground">Last studied</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent"
                  onClick={e => {
                    e.stopPropagation()
                    onDeckSelect('deck', deck.id)
                  }}
                >
                  Study Now
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center bg-muted/50 border border-dashed border-border">
            <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No decks yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first deck to start learning
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="gap-2 bg-primary text-white hover:bg-primary/90"
            >
              <Plus size={20} />
              Create Deck
            </Button>
          </Card>
        )}
      </div>

      {/* Create Deck Modal */}
      <CreateDeckModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateDeck}
      />
    </div>
  )
}
