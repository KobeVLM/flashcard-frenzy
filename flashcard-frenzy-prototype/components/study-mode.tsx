'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, RotateCw } from 'lucide-react'

interface Flashcard {
  id: number
  front: string
  back: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

interface StudyModeProps {
  deckId: number | null
  onBack: () => void
}

export default function StudyMode({ deckId, onBack }: StudyModeProps) {
  const mockCards: Flashcard[] = [
    {
      id: 1,
      front: 'Hola',
      back: 'Hello',
    },
    {
      id: 2,
      front: 'Buenos días',
      back: 'Good morning',
    },
    {
      id: 3,
      front: 'Gato',
      back: 'Cat',
    },
    {
      id: 4,
      front: 'Gracias',
      back: 'Thank you',
    },
    {
      id: 5,
      front: 'De nada',
      back: "You're welcome",
    },
  ]

  const [cards, setCards] = useState<Flashcard[]>(mockCards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  })

  const currentCard = cards[currentIndex]
  const progress = ((currentIndex + 1) / cards.length) * 100

  const handleDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setSessionStats(prev => ({
      ...prev,
      [difficulty]: prev[difficulty] + 1,
    }))

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      // Session complete
      handleSessionComplete()
    }
  }

  const handleSessionComplete = () => {
    // Could show summary or navigate back
  }

  const handleNext = () => {
    if (!isFlipped) {
      setIsFlipped(true)
    } else if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setSessionStats({ easy: 0, medium: 0, hard: 0 })
  }

  const isSessionComplete = currentIndex === cards.length - 1 && isFlipped

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-secondary transition-colors mb-6"
        >
          <ArrowLeft size={24} />
          Back to Deck
        </button>
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
          Study Mode
        </h1>
        <p className="text-muted-foreground">
          Master your flashcards - {cards.length} cards
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Card */}
        <div className="lg:col-span-2">
          <Card
            onClick={() => {
              if (currentCard) setIsFlipped(!isFlipped)
            }}
            className="h-80 bg-white border-2 border-primary/20 flex items-center justify-center cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="text-center p-8">
              <p className="text-sm text-muted-foreground font-medium mb-4">
                {isFlipped ? 'Back' : 'Front'}
              </p>
              <p className="text-4xl font-bold text-primary break-words">
                {isFlipped ? currentCard?.back : currentCard?.front}
              </p>
              <p className="text-sm text-muted-foreground mt-6">
                Click card to flip
              </p>
            </div>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-6">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-muted disabled:opacity-50 bg-transparent"
            >
              ← Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={isSessionComplete}
              className="flex-1 bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {isFlipped ? 'Next →' : 'Reveal'}
            </Button>
          </div>

          {/* Rating Buttons */}
          {isFlipped && !isSessionComplete && (
            <div className="mt-6">
              <p className="text-sm text-foreground font-medium mb-3">
                How difficult was this card?
              </p>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => handleDifficulty('easy')}
                  className="bg-accent text-white hover:bg-accent/90"
                >
                  Easy
                </Button>
                <Button
                  onClick={() => handleDifficulty('medium')}
                  className="bg-secondary text-white hover:bg-secondary/90"
                >
                  Medium
                </Button>
                <Button
                  onClick={() => handleDifficulty('hard')}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Hard
                </Button>
              </div>
            </div>
          )}

          {/* Session Complete */}
          {isSessionComplete && (
            <Card className="mt-6 p-8 bg-accent/10 border border-accent">
              <h3 className="text-2xl font-bold text-accent mb-4">
                Session Complete! 🎉
              </h3>
              <div className="space-y-2 mb-6">
                <p className="text-foreground">
                  <span className="font-semibold">Easy:</span>{' '}
                  {sessionStats.easy} cards
                </p>
                <p className="text-foreground">
                  <span className="font-semibold">Medium:</span>{' '}
                  {sessionStats.medium} cards
                </p>
                <p className="text-foreground">
                  <span className="font-semibold">Hard:</span>{' '}
                  {sessionStats.hard} cards
                </p>
              </div>
              <Button
                onClick={handleReset}
                className="gap-2 bg-accent text-white hover:bg-accent/90"
              >
                <RotateCw size={20} />
                Study Again
              </Button>
            </Card>
          )}
        </div>

        {/* Sidebar Stats */}
        <div>
          <Card className="p-6 bg-white border border-border sticky top-8">
            <h3 className="text-lg font-bold text-foreground mb-6">
              Session Stats
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-accent/10 rounded-lg">
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Easy
                </p>
                <p className="text-3xl font-bold text-accent">
                  {sessionStats.easy}
                </p>
              </div>
              <div className="p-4 bg-secondary/10 rounded-lg">
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Medium
                </p>
                <p className="text-3xl font-bold text-secondary">
                  {sessionStats.medium}
                </p>
              </div>
              <div className="p-4 bg-destructive/10 rounded-lg">
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  Hard
                </p>
                <p className="text-3xl font-bold text-destructive">
                  {sessionStats.hard}
                </p>
              </div>
            </div>

            <Button
              onClick={onBack}
              variant="outline"
              className="w-full mt-6 border-border text-foreground hover:bg-muted bg-transparent"
            >
              Exit Study Mode
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
