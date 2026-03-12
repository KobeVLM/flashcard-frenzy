'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Navigation from '@/components/navigation'
import LoginPage from '@/components/login-page'
import Dashboard from '@/components/dashboard'
import DeckPage from '@/components/deck-page'
import StudyMode from '@/components/study-mode'
import QuizMode from '@/components/quiz-mode'
import ProfilePage from '@/components/profile-page'

type Page = 'login' | 'dashboard' | 'deck' | 'study' | 'quiz' | 'profile'

interface AppState {
  currentPage: Page
  isAuthenticated: boolean
  selectedDeckId: number | null
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'login',
    isAuthenticated: false,
    selectedDeckId: null,
  })

  const navigate = (page: Page, deckId?: number) => {
    setAppState(prev => ({
      ...prev,
      currentPage: page,
      selectedDeckId: deckId || null,
    }))
  }

  const handleLogin = () => {
    setAppState(prev => ({
      ...prev,
      isAuthenticated: true,
      currentPage: 'dashboard',
    }))
  }

  const handleLogout = () => {
    setAppState(prev => ({
      ...prev,
      isAuthenticated: false,
      currentPage: 'login',
    }))
  }

  if (!appState.isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="flex h-screen bg-background">
      <Navigation
        currentPage={appState.currentPage}
        onNavigate={navigate}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-auto">
        {appState.currentPage === 'dashboard' && (
          <Dashboard onDeckSelect={navigate} />
        )}
        {appState.currentPage === 'deck' && (
          <DeckPage
            deckId={appState.selectedDeckId}
            onBack={() => navigate('dashboard')}
            onStudy={() => navigate('study')}
          />
        )}
        {appState.currentPage === 'study' && (
          <StudyMode
            deckId={appState.selectedDeckId}
            onBack={() => navigate('deck', appState.selectedDeckId || 1)}
          />
        )}
        {appState.currentPage === 'quiz' && (
          <QuizMode
            deckId={appState.selectedDeckId}
            onBack={() => navigate('deck', appState.selectedDeckId || 1)}
          />
        )}
        {appState.currentPage === 'profile' && (
          <ProfilePage onBack={() => navigate('dashboard')} />
        )}
      </main>
    </div>
  )
}
