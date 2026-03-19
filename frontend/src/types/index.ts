// ─── API Response Envelope ────────────────────────────────────────────────────

export interface ApiError {
  code: string;
  message: string;
  details: Record<string, string> | string | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  timestamp: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl?: string | null;
  role: 'USER' | 'ADMIN';
}

export interface AuthData {
  token: string;
  refreshToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ─── Deck ─────────────────────────────────────────────────────────────────────

export interface Deck {
  id: string;
  userId: string;
  title: string;
  category: string | null;
  description: string | null;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeckPayload {
  title: string;
  category?: string;
  description?: string;
}

export interface UpdateDeckPayload {
  title?: string;
  category?: string;
  description?: string;
}

// ─── Flashcard ────────────────────────────────────────────────────────────────

export interface Flashcard {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFlashcardPayload {
  question: string;
  answer: string;
  tags?: string[];
}

export interface UpdateFlashcardPayload {
  question?: string;
  answer?: string;
  tags?: string[];
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export interface QuizResult {
  id: string;
  userId: string;
  deckId: string;
  deckTitle?: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  dateTaken: string;
}

export interface SubmitQuizPayload {
  deckId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  totalDecks: number;
  totalFlashcards: number;
  activeRate: number;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
