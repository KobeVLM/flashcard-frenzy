'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, RotateCw, Clock } from 'lucide-react'

interface QuizQuestion {
  id: number
  question: string
  correct: string
  options: string[]
}

interface QuizModeProps {
  deckId: number | null
  onBack: () => void
}

export default function QuizMode({ deckId, onBack }: QuizModeProps) {
  const mockQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: 'What is the Spanish word for "Hello"?',
      correct: 'Hola',
      options: ['Gracias', 'Hola', 'Adiós', 'Por favor'],
    },
    {
      id: 2,
      question: 'How do you say "Good morning" in Spanish?',
      correct: 'Buenos días',
      options: ['Buenas noches', 'Buenos días', 'Buena suerte', 'Bienvenido'],
    },
    {
      id: 3,
      question: 'What is the Spanish word for "Cat"?',
      correct: 'Gato',
      options: ['Perro', 'Gato', 'Pajaro', 'Pez'],
    },
    {
      id: 4,
      question: 'What does "Gracias" mean?',
      correct: 'Thank you',
      options: ['Goodbye', 'Please', 'Thank you', 'Welcome'],
    },
    {
      id: 5,
      question: 'How do you say "Goodbye" in Spanish?',
      correct: 'Adiós',
      options: ['Hola', 'Gracias', 'Adiós', 'Buenas noches'],
    },
  ]

  const [questions] = useState<QuizQuestion[]>(
    mockQuestions.sort(() => Math.random() - 0.5)
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<
    (string | null)[]
  >(Array(questions.length).fill(null))
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  const handleSelectAnswer = (option: string) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentIndex] = option
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setSelectedAnswers(Array(questions.length).fill(null))
    setShowResults(false)
    setTimeLeft(300)
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correct++
      }
    })
    return correct
  }

  const score = calculateScore()
  const percentage = Math.round((score / questions.length) * 100)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

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
          Quiz Mode
        </h1>
      </div>

      {!showResults ? (
        <>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-2 text-secondary font-semibold">
                <Clock size={18} />
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-secondary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="p-8 bg-white border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-8">
                  {currentQuestion?.question}
                </h2>

                <div className="space-y-3 mb-8">
                  {currentQuestion?.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(option)}
                      className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                        selectedAnswers[currentIndex] === option
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswers[currentIndex] === option
                              ? 'border-primary bg-primary'
                              : 'border-border'
                          }`}
                        >
                          {selectedAnswers[currentIndex] === option && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span
                          className={`font-medium ${
                            selectedAnswers[currentIndex] === option
                              ? 'text-primary'
                              : 'text-foreground'
                          }`}
                        >
                          {option}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex gap-4">
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
                    disabled={selectedAnswers[currentIndex] === null}
                    className="flex-1 bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50"
                  >
                    {currentIndex === questions.length - 1
                      ? 'Submit Quiz'
                      : 'Next →'}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Sidebar - Progress Overview */}
            <div>
              <Card className="p-6 bg-white border border-border sticky top-8">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Progress
                </h3>
                <div className="space-y-2 mb-6">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-full py-2 px-3 rounded-lg transition-all text-sm font-medium ${
                        idx === currentIndex
                          ? 'bg-secondary text-white'
                          : selectedAnswers[idx]
                            ? 'bg-accent/20 text-accent'
                            : 'bg-muted text-foreground'
                      }`}
                    >
                      Q{idx + 1}
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-secondary/10 rounded-lg">
                  <p className="text-xs text-muted-foreground font-medium mb-1">
                    Answered
                  </p>
                  <p className="text-2xl font-bold text-secondary">
                    {selectedAnswers.filter(a => a !== null).length}/{questions.length}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </>
      ) : (
        /* Results Screen */
        <div className="max-w-2xl mx-auto">
          <Card className="p-12 bg-white border border-border text-center">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-foreground mb-2">
                Quiz Complete! 🎓
              </h2>
              <p className="text-muted-foreground">
                Here's how you performed
              </p>
            </div>

            {/* Score Circle */}
            <div className="mb-12">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  percentage >= 80
                    ? 'bg-accent/20'
                    : percentage >= 60
                      ? 'bg-secondary/20'
                      : 'bg-destructive/20'
                }`}
              >
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">
                    {percentage}%
                  </p>
                  <p className="text-sm text-muted-foreground">Score</p>
                </div>
              </div>

              <p className="text-2xl font-bold text-foreground">
                {score} out of {questions.length} correct
              </p>
            </div>

            {/* Feedback */}
            <div className="p-6 bg-muted rounded-lg mb-8">
              <p className="text-lg font-semibold text-foreground">
                {percentage >= 80
                  ? 'Excellent work! You really know your material! 🌟'
                  : percentage >= 60
                    ? 'Good job! Keep practicing to improve further. 📚'
                    : 'Keep studying! You will do better next time. 💪'}
              </p>
            </div>

            {/* Answer Review */}
            <div className="text-left mb-8">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Answer Review
              </h3>
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      selectedAnswers[idx] === q.correct
                        ? 'border-accent bg-accent/10'
                        : 'border-destructive bg-destructive/10'
                    }`}
                  >
                    <p className="font-semibold text-foreground mb-2">
                      Q{idx + 1}: {q.question}
                    </p>
                    <p
                      className={`text-sm ${
                        selectedAnswers[idx] === q.correct
                          ? 'text-accent'
                          : 'text-destructive'
                      }`}
                    >
                      {selectedAnswers[idx] === q.correct
                        ? `✓ Correct: ${selectedAnswers[idx]}`
                        : `✗ Your answer: ${selectedAnswers[idx] || 'Not answered'} | Correct: ${q.correct}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleReset}
                className="flex-1 gap-2 bg-secondary text-white hover:bg-secondary/90"
              >
                <RotateCw size={20} />
                Retake Quiz
              </Button>
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
              >
                Back to Deck
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
