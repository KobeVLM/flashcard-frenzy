'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X } from 'lucide-react'

interface Flashcard {
  id: number
  front: string
  back: string
  tags: string[]
}

interface CreateCardModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (card: { front: string; back: string; tags: string }) => void
  editingCard?: Flashcard | null
}

export default function CreateCardModal({
  isOpen,
  onClose,
  onCreate,
  editingCard,
}: CreateCardModalProps) {
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [tags, setTags] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingCard) {
      setFront(editingCard.front)
      setBack(editingCard.back)
      setTags(editingCard.tags.join(', '))
    } else {
      setFront('')
      setBack('')
      setTags('')
    }
  }, [editingCard])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!front.trim()) newErrors.front = 'Front side is required'
    if (!back.trim()) newErrors.back = 'Back side is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onCreate({ front, back, tags })
      setFront('')
      setBack('')
      setTags('')
      setErrors({})
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {editingCard ? 'Edit Card' : 'Create New Card'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Front Side
            </label>
            <textarea
              value={front}
              onChange={e => {
                setFront(e.target.value)
                if (errors.front) setErrors(prev => ({ ...prev, front: '' }))
              }}
              placeholder="What students will see first"
              rows={2}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                errors.front ? 'border-destructive' : 'border-border'
              }`}
            />
            {errors.front && (
              <p className="text-destructive text-sm mt-1">{errors.front}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Back Side
            </label>
            <textarea
              value={back}
              onChange={e => {
                setBack(e.target.value)
                if (errors.back) setErrors(prev => ({ ...prev, back: '' }))
              }}
              placeholder="The answer or explanation"
              rows={2}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                errors.back ? 'border-destructive' : 'border-border'
              }`}
            />
            {errors.back && (
              <p className="text-destructive text-sm mt-1">{errors.back}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Tags (comma-separated, optional)
            </label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="e.g., vocabulary, important"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-primary text-white hover:bg-primary/90"
            >
              {editingCard ? 'Update Card' : 'Create Card'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
