# FLASHCARD FRENZY - DESIGN & WIREFRAME DOCUMENTATION

## 7.0 UI/UX DESIGN

### 7.1 Web Application Wireframes

#### **Page 1: Login / Authentication Page**

**Header Section:**
- Centered Logo: "Flashcard Frenzy"
- Tagline: "Master Your Learning"

**Main Content Area:**
- Two-tab interface: "Login" | "Sign Up"
- Login Form:
  - Email input field (placeholder: "Enter your email")
  - Password input field (password toggle visibility)
  - "Forgot Password?" link (bottom-left)
  - "Login" button (primary blue, full-width)
  - "Don't have an account? Sign Up" link
- Sign Up Form:
  - Full Name input field
  - Email input field
  - Password input field (with strength indicator)
  - Confirm Password input field
  - "Sign Up" button (primary blue, full-width)
  - "Already have an account? Login" link

**Footer:**
- "© 2024 Flashcard Frenzy. All rights reserved."

---

#### **Page 2: Dashboard (Main Landing Page)**

**Header Navigation:**
- Left: Logo + "Flashcard Frenzy"
- Center: Breadcrumb (if nested)
- Right: User Avatar (gradient blue-to-purple) with dropdown menu

**Sidebar Navigation (Desktop Only):**
- Logo section
- Navigation Items:
  - 🏠 Dashboard (active/highlighted in blue)
  - 📚 My Decks
  - 🧠 Study Mode
  - 📊 Quiz Mode
  - 👤 Profile
- User Section: Avatar + "Logout" button

**Main Content Area:**
- Welcome header: "Welcome back, [Student Name]! 👋"
- Stats Grid (3 cards, responsive):
  - Card 1: "Total Decks" | Large number (e.g., 3)
  - Card 2: "Cards Due Today" | Large number (e.g., 12)
  - Card 3: "Current Streak" | Large number (e.g., 15 days)
  - Each card has icon + colored background (purple accent)

**Decks Section:**
- Section Title: "Your Decks"
- "Create New Deck" button (blue, icon: +)
- Deck Grid (3 columns desktop, responsive):
  - Each Deck Card:
    - Card image/icon (gradient background)
    - Deck title (e.g., "Spanish Vocabulary")
    - Description (2 lines max)
    - Metrics: "12 cards | 3 due today | Last studied: 2 days ago"
    - Progress bar (percentage filled)
    - Action buttons: "Study" | "Edit" | "Delete"

**Empty State (if no decks):**
- Illustration placeholder
- Message: "No decks yet. Create your first deck to get started!"
- "Create Deck" CTA button

**Footer:**
- Links: About | Help | Privacy | Terms
- Copyright notice

---

#### **Page 3: Deck Detail Page**

**Header Section:**
- Back button (arrow icon)
- Deck title: "Spanish Vocabulary"
- Three-dot menu (Edit, Delete, Duplicate)

**Action Buttons (sticky top):**
- "Study Mode" button (primary blue, prominent)
- "Quiz Mode" button (secondary outline)

**Cards Section:**
- Section Title: "Flashcards (12 total)"
- "Add Card" button (blue, icon: +)

**Flashcard List (vertical stack):**
- Each Card Item:
  - Front text: "Hola" (bold, 16px)
  - Separator (dash)
  - Back text: "Hello" (16px)
  - Tags (small badges): [Spanish] [Greeting]
  - Action buttons: Edit | Delete
  - Visual divider between cards

**Empty State (if no cards):**
- Message: "No cards in this deck yet."
- "Add your first card" CTA button

---

#### **Page 4: Study Mode Page**

**Header Bar:**
- Deck title + card number: "Spanish Vocabulary - Card 1 of 12"
- Progress indicator: Visual bar showing 1/12

**Main Content Area (Centered Flexbox):**
- Large Flashcard Container:
  - Front side (default):
    - Large centered text (24px): "Hola"
    - "Click to reveal answer" hint text (small, muted)
  - Back side (flipped):
    - Large centered text (24px): "Hello"
    - Subtle background color change (light blue)

**Difficulty Buttons (below card):**
- Three buttons in horizontal row:
  - "Easy" button (green accent) - moves to next card
  - "Medium" button (yellow accent) - moves to next card
  - "Hard" button (red accent) - moves to next card

**Session Stats Sidebar (right, desktop only):**
- "Session Progress"
- Progress bar (cards completed)
- Stat line: "2 of 12 complete"
- Breakdown stats:
  - Easy: 1
  - Medium: 1
  - Hard: 0

**Navigation Buttons (bottom):**
- "Previous" button (disabled on first card)
- "Next" button (disabled on last card)

**End of Session Summary (after last card):**
- Centered card with title: "Session Complete! 🎉"
- Stats displayed:
  - Total cards: 12
  - Easy: 4
  - Medium: 5
  - Hard: 3
  - Duration: 5 minutes
- Buttons: "Study Again" | "Back to Deck"

---

#### **Page 5: Quiz Mode Page**

**Layout: Two-Column (Desktop)**
- Left: Main quiz content area (70%)
- Right: Progress sidebar (30%)

**Quiz Header (Mobile: full-width, Desktop: left column):**
- Quiz title: "Spanish Vocabulary - Quiz"
- Timer display (if enabled): "4:32 remaining" (red if < 1 min)

**Main Quiz Area:**
- Question number and text (bold, 18px):
  - "Question 1 of 10: What is the Spanish word for 'Hello'?"
- Multiple-choice options (radio buttons):
  - ○ Adiós
  - ○ Hola (correct answer)
  - ○ Gracias
  - ○ De nada
- Hover state: Light background highlight on option

**Quiz Navigation (bottom of main area):**
- "Previous" button (disabled on Q1)
- "Next" button (enabled, moves to Q2)
- "Submit Quiz" button (primary blue, visible on last question)

**Progress Sidebar (Right, Desktop Only):**
- Title: "Progress"
- Question list (vertical):
  - Q1 ☑ (checkmark - answered)
  - Q2 ☐ (empty - not answered)
  - Q3 ☐
  - ... Q10
- Visual: Answered questions show blue checkmark

**Quiz Results Screen (shown after submission):**
- Centered card with title: "Quiz Complete!"
- Score display: "8 out of 10 (80%)"
- Performance message: "Great job! Keep it up!" (message varies by score)
- Results breakdown:
  - Correct: 8
  - Incorrect: 2
- "Review Answers" button (secondary)
- "Retake Quiz" button (primary blue)
- "Back to Deck" button (secondary)

**Answer Review (optional modal):**
- List of all questions with:
  - Question text
  - User's answer (green if correct, red if incorrect)
  - Correct answer (if wrong)
  - Explanation (if available)

---

#### **Page 6: Profile / Settings Page**

**Layout: Two-Column (Desktop) | Single-Column (Mobile)**

**Left Column: User Information**
- Section Title: "Profile Information"
- Avatar (large, gradient background)
- Editable fields:
  - Full Name: [Text Input] (edit icon)
  - Email: [Text Input] (edit icon, disabled)
  - Username: [Text Input] (edit icon)
- "Save Changes" button (blue)

**Right Column: Learning Statistics**
- Section Title: "Your Statistics"
- Stats cards (2x2 grid):
  - Card 1: "Total Decks" | "3"
  - Card 2: "Total Cards" | "156"
  - Card 3: "Accuracy" | "82%"
  - Card 4: "Total Sessions" | "24"

**Streaks Section:**
- "Current Streak" | "15 days" (green accent, icon: flame)
- "Longest Streak" | "47 days" (icon: trophy)

**Achievements / Badges Section:**
- Section Title: "Achievements"
- Badge grid (4 columns desktop, 2 on mobile):
  - Badge 1: "First Steps" (locked/unlocked state, icon)
  - Badge 2: "Week Warrior" (locked/unlocked)
  - Badge 3: "Quiz Master" (locked/unlocked)
  - Badge 4: "Speed Runner" (locked/unlocked)
- Each badge shows: Icon + Name + Status (locked = greyed out)

**Notifications & Settings Section:**
- Section Title: "Preferences"
- Toggle switches:
  - "Email reminders" [ON/OFF]
  - "Daily notifications" [ON/OFF]
  - "Sound effects" [ON/OFF]

**Danger Zone Section:**
- "Delete Account" button (red, destructive style)
- Confirmation text: "This action cannot be undone."

**Footer:**
- "Logout" button (secondary outline)
- Account created date: "Joined: January 15, 2024"

---

### 7.2 Mobile Application Wireframes

#### **Mobile Bottom Navigation**

- Fixed at bottom: 5 nav items
  - [🏠 Home] [📚 Decks] [🧠 Study] [📊 Quiz] [👤 Profile]
- Active state: Item highlighted in blue with underline

---

#### **Mobile Page 1: Login (Responsive)**

**Header:**
- Logo centered: "Flashcard Frenzy"
- Tagline (smaller font)

**Main Content:**
- Full-width form, single-column
- Tab interface: "Login" | "Sign Up" (swipeable or clickable)
- Form fields stack vertically
- Each input: full width, 44px min height (touch-friendly)
- Buttons: full width, 48px height
- Links centered below

**Footer:**
- Copyright centered

---

#### **Mobile Page 2: Dashboard (Responsive)**

**Header Bar (sticky):**
- Left: Hamburger menu icon (opens sidebar)
- Center: Logo
- Right: User avatar (tap to open profile menu)

**Sidebar Navigation (overlay, slides from left):**
- Semi-transparent backdrop
- Navigation items stack vertically
- Touch-friendly spacing (44px+ tap targets)
- Close button (X) top-right

**Main Content (full-width):**
- Welcome message (single line, truncated if long)
- Stats Section: Stack vertically (3 cards, full-width)
  - Each stat card: full width, centered content
- Decks Section:
  - Title: "Your Decks"
  - Grid: 2 columns (fills screen width)
  - Cards scale responsively
  - "Create Deck" button: full-width, sticky at bottom

**Gestures:**
- Swipe left/right: Move between decks (optional)
- Pull-to-refresh: Reload deck list
- Tap deck: Navigate to deck detail

---

#### **Mobile Page 3: Deck Detail (Responsive)**

**Header Bar (sticky):**
- Back arrow (navigates to dashboard)
- Deck title (truncated if long)
- Three-dot menu icon

**Action Buttons:**
- Full-width stack on mobile:
  - "Study Mode" (full width, blue)
  - "Quiz Mode" (full width, outline)

**Flashcards Section:**
- Title: "Cards (12)"
- "Add Card" button: full width
- Cards list: vertical stack, each card takes full width
- Card item: Front text | Separator | Back text
- Action buttons: small icons on right side (Edit, Delete)

**Gestures:**
- Swipe card: Optional left-swipe to delete
- Tap card: Open card edit modal

---

#### **Mobile Page 4: Study Mode (Responsive)**

**Header Bar (sticky):**
- Back button
- Progress: "Card 1 of 12"
- Deck title

**Main Content (full-width):**
- Flashcard: takes up majority of screen
  - Large text, centered, readable
  - Tap to flip animation
- Difficulty buttons (below card):
  - 3 buttons stacked horizontally, equal width
  - Touch-friendly: 48px height

**Navigation Buttons (sticky bottom):**
- "Previous" | "Next" (horizontal, equal width)

**Session Stats:**
- Sticky header or collapsible panel showing:
  - Progress bar (full width)
  - "2 of 12 complete"

**Session Complete Summary:**
- Full-screen card
- Centered stats
- Buttons stacked vertically, full-width
- Bottom: "Study Again" (primary) | "Back to Deck" (secondary)

**Gestures:**
- Swipe left: Move to next card
- Swipe right: Move to previous card
- Tap card: Flip animation

---

#### **Mobile Page 5: Quiz Mode (Responsive)**

**Header Bar (sticky):**
- Back button
- Quiz title
- Timer (if enabled)

**Main Content (full-width):**
- Question text (bold, readable size, wraps naturally)
- Multiple-choice options:
  - Stack vertically, full width
  - Each option: 56px height (touch-friendly radio button)
  - Option text: left-aligned after radio button
  - Hover/active: light blue background

**Quiz Navigation (sticky bottom):**
- Buttons stack horizontally: "Previous" | "Next"
- On last question: "Next" replaced with "Submit Quiz"

**Progress Indicator:**
- Collapsible panel or tab that shows:
  - Question list (swipeable carousel or list)
  - Checkmarks for answered questions

**Quiz Results:**
- Full-screen card
- Score displayed prominently (large text)
- Stats stacked vertically
- Buttons stacked full-width:
  - "Review Answers"
  - "Retake Quiz"
  - "Back to Deck"

**Gestures:**
- Swipe left/right: Navigate between questions (optional)
- Tap answer: Select option with instant feedback
- Pull-to-refresh: Restart quiz

---

#### **Mobile Page 6: Profile (Responsive)**

**Layout: Single-column, full-width**

**Header Bar (sticky):**
- Back button
- "Profile" title
- Settings icon (optional)

**Profile Section:**
- Avatar (centered, large)
- Name (centered, editable inline)
- Email (centered, smaller)

**Statistics Section:**
- Title: "Your Stats"
- Stats cards: 2x2 grid (responsive, each takes 50% width)
- Card content centered: stat name above, large number below

**Streaks Section:**
- Title: "Streaks"
- Two rows:
  - "Current: 15 days" (with flame icon)
  - "Longest: 47 days" (with trophy icon)

**Achievements Section:**
- Title: "Achievements"
- Grid: 4 columns (full-width responsive)
- Badges: Icons with names, locked/unlocked state

**Preferences Section:**
- Title: "Preferences"
- Toggle switches (full-width rows):
  - "Email reminders" [ON/OFF] toggle
  - "Daily notifications" [ON/OFF] toggle
  - "Sound effects" [ON/OFF] toggle

**Account Actions (sticky bottom):**
- "Logout" button (secondary, full-width)
- "Delete Account" button (destructive/red, full-width, below logout)

**Mobile-Specific Features:**
- Bottom navigation bar always visible
- Touch-optimized buttons (44-56px minimum height)
- Gesture support:
  - Swipe back to return to previous page
  - Tap to open profile menu from navbar
  - Toggle switches for instant feedback
- Simplified forms: single-column input fields
- Responsive grid: 2 columns (mobile), 3-4 (tablet), adjusts based on screen

---

## 7.3 Design System

### **Colors**

**Primary Brand Colors:**
- **Primary Blue**: `#2563EB` - Main CTAs, navigation highlights, primary actions
- **Secondary Purple**: `#7C3AED` - Secondary elements, accents, alternative CTAs
- **Success Green**: `#10B981` - Positive states, streak indicators, completion feedback
- **Error Red**: `#EF4444` - Errors, destructive actions, warning states

**Neutral Colors:**
- **Background**: `oklch(0.98 0.001 109.282)` - Off-white, clean base
- **Foreground**: `oklch(0.14 0.045 280)` - Dark text, excellent contrast
- **Muted**: `oklch(0.92 0.005 250)` - Secondary text, disabled states
- **Border**: `oklch(0.92 0.005 250)` - Card borders, input outlines
- **Card**: `oklch(1 0 0)` - Pure white, content containers

**Accessibility:**
- All color combinations maintain WCAG AAA compliance (7:1+ contrast ratio)
- Color is not the only indicator (icons, text, checkmarks used alongside colors)

---

### **Typography**

**Font Family:**
- Primary: **Geist** (Google Font, sans-serif)
- Monospace: **Geist Mono** (for data/code displays)

**Font Scales:**

| Element | Desktop Size | Mobile Size | Weight | Line-Height | Usage |
|---------|--------------|-------------|--------|-------------|-------|
| **H1 (Page Title)** | 48px | 36px | 700 (Bold) | 1.2 | Dashboard "Welcome back" |
| **H2 (Section)** | 24px | 20px | 700 (Bold) | 1.3 | "Your Decks", "Statistics" |
| **H3 (Card Title)** | 18px | 16px | 700 (Bold) | 1.3 | Deck names, quiz questions |
| **Body (Primary)** | 14px | 14px | 400 (Regular) | 1.6 | Descriptions, content text |
| **Button/Label** | 14px | 14px | 600 (Semi-bold) | 1.4 | Button text, form labels |
| **Small/Caption** | 12px | 12px | 400 (Regular) | 1.5 | Helper text, timestamps |
| **Metric (Stat)** | 32px | 28px | 700 (Bold) | 1.0 | Dashboard stats, scores |

**Typography Rules:**
- Body text: minimum 14px, 1.6 line-height for readability
- Headings: use `text-balance` for natural line breaks
- Color hierarchy: primary text in foreground, secondary in muted
- All interactive text: minimum 44px touch target height on mobile

---

### **Spacing System**

**8px Grid System:**
- Base unit: 8px
- Standard spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px
- Applied via Tailwind classes: `p-1` (4px), `p-2` (8px), `p-3` (12px), `p-4` (16px), `p-6` (24px), `p-8` (32px)

**Component Spacing:**
- Card padding: `p-6` (24px)
- Button padding: `px-4 py-2` (16px horizontal, 8px vertical)
- Section gap: `gap-4` (16px between items)
- Margin between sections: `mb-8` (32px)
- Grid gap: `gap-4` (tight), `gap-6` (medium), `gap-8` (loose)

---

### **Components**

#### **Buttons**

**Primary Button:**
- Background: `#2563EB`
- Text: White
- Padding: 8px 16px
- Border-radius: 10px
- Hover: `bg-primary/90`
- Active: Subtle scale down (0.98x)
- Disabled: Opacity 50%
- Min height: 44px (touch-friendly)

**Secondary/Outline Button:**
- Border: 1px solid `#7C3AED`
- Background: Transparent
- Text: Purple (`#7C3AED`)
- Padding: 8px 16px
- Hover: `bg-secondary/10`
- Border-radius: 10px

**Destructive Button:**
- Background: `#EF4444`
- Text: White
- Used for delete, logout actions
- Hover: `bg-destructive/90`

#### **Cards**
- Background: White
- Border: 1px solid border color
- Border-radius: 10px
- Padding: 24px
- Shadow: `shadow-sm` on hover
- Hover: `shadow-lg` expansion

#### **Forms & Inputs**
- Background: White
- Border: 1px solid border color
- Border-radius: 10px
- Padding: 8px 12px
- Focus ring: Blue (`#2563EB`)
- Min height: 40px (touch-friendly)
- Label: 12px, semi-bold, muted color
- Error border: Red (`#EF4444`)

#### **Progress Bars**
- Background: Muted color
- Fill: Primary blue or accent color
- Height: 8px
- Border-radius: 4px
- Animated fill on progress change

#### **Flashcards (Study Mode)**
- Size: 600px width (desktop), full-width (mobile)
- Aspect ratio: ~2:1
- Border-radius: 16px
- Flip animation: 300ms rotate Y
- Front/Back: Centered text, 24px
- Cursor: Pointer with scale transform on hover

#### **Modal Dialogs**
- Overlay: Semi-transparent black (50% opacity)
- Card: White background, centered
- Max-width: 500px
- Border-radius: 16px
- Padding: 24px
- Close button: X icon, top-right
- Fade-in animation: 200ms

#### **Navigation**
- Sidebar width: 256px (desktop), absolute overlay (mobile)
- Active state: Blue background, white text
- Hover state: Muted background transition
- Icons: 20px size
- Touch-friendly: 44px min height per item

---

### **Responsive Design**

**Mobile-First Approach:**
- Default: 375px viewport (mobile phones)
- Designs scale up for larger screens
- All text readable without zoom

**Breakpoints (Tailwind CSS):**
- **Mobile (default)**: < 640px
- **Small (sm)**: 640px+
- **Medium (md)**: 768px (2-column grids)
- **Large (lg)**: 1024px (3-column grids, sidebar visible)
- **XL/2XL**: 1280px+ (maximum content optimization)

**Grid Adjustments:**
- Mobile: 1 column for all layouts
- Tablet (md): 2-column grids
- Desktop (lg+): 3-column decks grid, 2-column quiz layout

**Touch Targets:**
- Minimum 44x44px for all interactive elements
- Buttons: minimum 48-56px height on mobile
- Radio/checkbox options: 48px height

**Layout Shifts:**
- Sidebar: Fixed (desktop) → Absolute overlay (mobile)
- Navigation: Top nav (desktop) → Bottom nav (mobile)
- Two-column layouts: Single column (mobile), two columns (desktop)
- Modals: Full-screen (mobile), centered (desktop)

**Responsive Typography:**
- Headlines scale down on mobile
- Body text remains readable (14px minimum)
- Stat numbers: 32px (desktop), 28px (mobile)

---

## 7.4 Summary

**Flashcard Frenzy** is built with a **clean, educational, modern minimalist design** that emphasizes clarity and engagement. The application uses a carefully curated 4-color palette with strong contrast for accessibility. Typography is readable and responsive, with consistent spacing using an 8px grid system. Components are designed to be touch-friendly on mobile and fully responsive across all breakpoints. The user interface prioritizes learning outcomes through clear visual hierarchy, intuitive navigation, and immediate feedback on user actions.

---

**Document Version:** 1.0  
**Last Updated:** February 5, 2024  
**Design System:** Flashcard Frenzy v1.0
