'use client';

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Home, BookOpen, Brain, BarChart3, User, LogOut } from 'lucide-react'

type Page = 'login' | 'dashboard' | 'deck' | 'study' | 'quiz' | 'profile'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  onLogout: () => void
}

export default function Navigation({
  currentPage,
  onNavigate,
  onLogout,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(true)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'deck', label: 'Decks', icon: BookOpen },
    { id: 'study', label: 'Study', icon: Brain },
    { id: 'quiz', label: 'Quiz', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-primary text-white p-2 rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static lg:translate-x-0 transition-transform duration-300 w-64 h-screen bg-white border-r border-border flex flex-col shadow-lg lg:shadow-none z-40`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary">Flashcard</h1>
          <p className="text-sm text-muted-foreground">Frenzy</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id as Page)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border space-y-2">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
              S
            </div>
            <div>
              <p className="text-sm font-medium">Student</p>
              <p className="text-xs text-muted-foreground">user@email.com</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full justify-start gap-2 bg-transparent"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
        />
      )}
    </>
  )
}
