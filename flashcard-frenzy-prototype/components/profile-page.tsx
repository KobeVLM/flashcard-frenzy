'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  ArrowLeft,
  Mail,
  User,
  Award,
  BookOpen,
  Flame,
  BarChart3,
} from 'lucide-react'

interface ProfilePageProps {
  onBack: () => void
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: 'Student',
    email: 'student@email.com',
  })
  const [formData, setFormData] = useState(userInfo)

  const handleSave = () => {
    setUserInfo(formData)
    setIsEditing(false)
  }

  const stats = {
    totalDecks: 3,
    totalCards: 175,
    accuracy: 78,
    currentStreak: 15,
    longestStreak: 32,
    cardsStudied: 234,
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-secondary transition-colors"
        >
          <ArrowLeft size={24} />
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <Card className="p-8 bg-white border border-border">
            {/* Avatar */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-4xl font-bold">
                S
              </div>
              {!isEditing ? (
                <>
                  <h2 className="text-2xl font-bold text-foreground">
                    {userInfo.name}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {userInfo.email}
                  </p>
                </>
              ) : null}
            </div>

            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-primary text-white hover:bg-primary/90"
              >
                Edit Profile
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-primary text-white hover:bg-primary/90"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false)
                      setFormData(userInfo)
                    }}
                    variant="outline"
                    className="flex-1 border-border text-foreground hover:bg-muted"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Stats Section */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Learning Statistics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Total Decks */}
              <Card className="p-6 bg-white border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium mb-1">
                      Total Decks
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      {stats.totalDecks}
                    </p>
                  </div>
                  <BookOpen className="text-primary/20" size={40} />
                </div>
              </Card>

              {/* Total Cards */}
              <Card className="p-6 bg-white border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium mb-1">
                      Total Cards
                    </p>
                    <p className="text-4xl font-bold text-secondary">
                      {stats.totalCards}
                    </p>
                  </div>
                  <div className="text-4xl">📋</div>
                </div>
              </Card>

              {/* Cards Studied */}
              <Card className="p-6 bg-white border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium mb-1">
                      Cards Studied
                    </p>
                    <p className="text-4xl font-bold text-accent">
                      {stats.cardsStudied}
                    </p>
                  </div>
                  <Award className="text-accent/20" size={40} />
                </div>
              </Card>

              {/* Accuracy */}
              <Card className="p-6 bg-white border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium mb-1">
                      Accuracy
                    </p>
                    <p className="text-4xl font-bold text-secondary">
                      {stats.accuracy}%
                    </p>
                  </div>
                  <BarChart3 className="text-secondary/20" size={40} />
                </div>
              </Card>
            </div>
          </div>

          {/* Streak Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Streak Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Streak */}
              <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">
                    Current Streak
                  </h3>
                  <Flame className="text-accent" size={24} />
                </div>
                <p className="text-5xl font-bold text-accent mb-2">
                  {stats.currentStreak}
                </p>
                <p className="text-sm text-muted-foreground">
                  Days in a row studying
                </p>
              </Card>

              {/* Longest Streak */}
              <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">
                    Longest Streak
                  </h3>
                  <Award className="text-secondary" size={24} />
                </div>
                <p className="text-5xl font-bold text-secondary mb-2">
                  {stats.longestStreak}
                </p>
                <p className="text-sm text-muted-foreground">
                  Best consecutive days
                </p>
              </Card>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Achievements
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '🌟', label: 'First Steps', unlocked: true },
                { icon: '📚', label: '50 Cards', unlocked: true },
                { icon: '🎯', label: '100% Accuracy', unlocked: true },
                { icon: '🔥', label: '7-Day Streak', unlocked: true },
                { icon: '👑', label: '30-Day Streak', unlocked: false },
                { icon: '💎', label: '1000 Cards', unlocked: false },
              ].map((badge, idx) => (
                <Card
                  key={idx}
                  className={`p-4 text-center border border-border ${
                    badge.unlocked
                      ? 'bg-white'
                      : 'bg-muted opacity-50'
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="text-sm font-semibold text-foreground">
                    {badge.label}
                  </p>
                  {badge.unlocked && (
                    <p className="text-xs text-accent mt-1">✓ Unlocked</p>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Settings
            </h2>

            <Card className="p-6 bg-white border border-border space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-medium text-foreground">
                  Email Notifications
                </label>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium text-foreground">
                  Daily Reminders
                </label>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
              <div className="border-t border-border pt-4">
                <Button
                  variant="outline"
                  className="w-full border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                >
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
