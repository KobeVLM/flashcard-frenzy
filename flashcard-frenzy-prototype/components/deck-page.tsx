'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  Brain,
  BarChart3,
  Tag,
} from 'lucide-react'
import CreateCardModal from '@/components/modals/create-card-modal'

interface Flashcard {
  id: number
  front: string
  back: string
  tags: string[]
}

interface DeckPageProps {
  deckId: number | null
  onBack: () => void
  onStudy: () => void
}

export default function DeckPage({
  deckId,
  onBack,
  onStudy,
}: DeckPageProps) {
  const [cards, setCards] = useState<Flashcard[]>([
    {
      id: 1,
      front: 'Hola',
      back: 'Hello',
      tags: ['greeting'],
    },
    {
      id: 2,
      front: 'Buenos días',
      back: 'Good morning',
      tags: ['greeting'],
    },
    {
      id: 3,
      front: 'Gato',
      back: 'Cat',
      tags: ['animals'],
    },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null)

  const handleCreateCard = (cardData: {
    front: string
    back: string
    tags: string
  }) => {
    const newCard: Flashcard = {
      id: Math.max(...cards.map(c => c.id), 0) + 1,
      front: cardData.front,
      back: cardData.back,
      tags: cardData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t),
    }
    setCards([...cards, newCard])
    setIsModalOpen(false)
  }

  const handleDeleteCard = (cardId: number) => {
    setCards(cards.filter(c => c.id !== cardId))
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-secondary transition-colors"
        >
          <ArrowLeft size={24} />
          Back to Decks
        </button>
      </div>

      {/* Deck Title */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
          Spanish Vocabulary
        </h1>
        <p className="text-muted-foreground">Common Spanish words and phrases</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Button
          onClick={onStudy}
          className="flex-1 bg-primary text-white hover:bg-primary/90 gap-2 py-2"
        >
          <Brain size={20} />
          Study Mode
        </Button>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          className="flex-1 border-primary text-primary hover:bg-primary/10 gap-2 py-2"
        >
          <Plus size={20} />
          Add Card
        </Button>
      </div>

      {/* Cards List */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Flashcards ({cards.length})
        </h2>

        {cards.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {cards.map(card => (
              <Card
                key={card.id}
                className="p-6 bg-white border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Card Content */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground font-medium mb-1">
                        Front
                      </p>
                      <p className="text-lg font-semibold text-primary">
                        {card.front}
                      </p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground font-medium mb-1">
                        Back
                      </p>
                      <p className="text-lg text-foreground">{card.back}</p>
                    </div>

                    {/* Tags */}
                    {card.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {card.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-xs font-medium text-foreground"
                          >
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCard(card)}
                      className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center bg-muted/50 border border-dashed border-border">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No cards yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first flashcard to get started
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="gap-2 bg-primary text-white hover:bg-primary/90"
            >
              <Plus size={20} />
              Add Card
            </Button>
          </Card>
        )}
      </div>

      {/* Create Card Modal */}
      <CreateCardModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCard(null)
        }}
        onCreate={handleCreateCard}
        editingCard={editingCard}
      />
    </div>
  )
}
