# Flashcard Frenzy — Backend Context Reference
**For:** AI Agent (Antigravity)  
**Purpose:** Project context and reference document — read this before doing anything  
**Scope:** Spring Boot Backend only  
**SDD Version:** 1.0 | **API Version:** 2.0  
**Last Updated:** March 18, 2026

---

## 0. How to Use This Document

This is a reference document. It tells you what the project is, how it is structured, what already exists on paper, and what the rules are. Before writing any code or making any decisions, read this top to bottom. When in doubt about any behavior — auth, endpoints, error codes, database shape — come back here first.

---

## 1. Project Overview

**Name:** Flashcard Frenzy  
**Type:** EdTech / Active Recall Study Platform  
**Primary Users:** Students and Learners  
**Problem it solves:** Users need a simple way to study and retain information across devices using flashcards.

The system has three clients:
- A **React web app** (deck management, admin panel)
- An **Android mobile app** in Kotlin/Jetpack Compose (on-the-go study sessions)
- A **Spring Boot REST API** — this is what you are working on

Your job as the backend agent is the Spring Boot API. The web and mobile clients consume it. You do not touch those.

---

## 2. Tech Stack (Backend Only)

| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.x |
| Security | Spring Security + JWT |
| ORM | Spring Data JPA (Hibernate) |
| Database | PostgreSQL 14+ (hosted on Supabase) |
| Build Tool | Maven |
| Deployment Target | Railway or Heroku |

Do not switch any of these unless explicitly told to.

---

## 3. Architecture

The backend is a standard **three-layer Spring Boot application**:

```
Controller Layer     →  Receives HTTP requests, validates input, returns responses
Service Layer        →  Business logic, orchestration
Repository Layer     →  Spring Data JPA interfaces talking to PostgreSQL
```

All communication with clients is over **HTTPS**. All request and response bodies are **JSON**. The backend does not render any HTML or templates.

---

## 4. User Roles

There are exactly two roles in this system:

| Role | Description |
|---|---|
| `USER` | Standard student/learner. Manages their own decks, cards, and quiz results. |
| `ADMIN` | Platform administrator. Can view stats and manage all user accounts. |

Role is stored in the `users` table as a string enum. Spring Security enforces role-based access on endpoints. A `USER` hitting an `ADMIN` endpoint must receive `403 Forbidden`.

---

## 5. Database Schema

### 5.1 Tables

**users**
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| email | VARCHAR | Unique, not null |
| password_hash | VARCHAR | bcrypt hashed, not null |
| full_name | VARCHAR | Nullable |
| role | VARCHAR | `USER` or `ADMIN`, default `USER` |
| created_at | TIMESTAMP | Auto-set on insert |
| updated_at | TIMESTAMP | Auto-set on update |

**decks**
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | FK → users.id |
| title | VARCHAR | Not null |
| category | VARCHAR | Nullable |
| description | TEXT | Nullable |
| created_at | TIMESTAMP | Auto-set on insert |
| updated_at | TIMESTAMP | Auto-set on update |

**flashcards**
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| deck_id | UUID | FK → decks.id |
| question | TEXT | Not null |
| answer | TEXT | Not null |
| tags | TEXT[] | PostgreSQL array, nullable |
| created_at | TIMESTAMP | Auto-set on insert |
| updated_at | TIMESTAMP | Auto-set on update |

**quiz_results**
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | FK → users.id |
| deck_id | UUID | FK → decks.id |
| score | INTEGER | Not null |
| time_spent | INTEGER | Seconds, not null |
| date_taken | TIMESTAMP | Auto-set on insert |

### 5.2 Relationships

- `users` → `decks` : One-to-Many (one user owns many decks)
- `decks` → `flashcards` : One-to-Many (one deck contains many flashcards)
- `users` → `quiz_results` : One-to-Many (one user has many quiz result records)
- `quiz_results` → `decks` : Many-to-One (each result is tied to one deck)

### 5.3 Cascade Rules

- Deleting a **deck** must cascade-delete all its **flashcards**
- Deleting a **user** (admin action) must cascade-delete their **decks**, **flashcards**, and **quiz_results**

---

## 6. Authentication & Security

### 6.1 How Auth Works

1. User registers or logs in → backend issues a **JWT access token** and a **refresh token**
2. Client sends `Authorization: Bearer <jwt>` on every protected request
3. When access token expires (`AUTH-002`), client calls `POST /auth/refresh` with the refresh token to get a new pair
4. Logout invalidates the session

### 6.2 Password Rules

- Hashed with **bcrypt**, salt rounds = **12**
- Minimum 8 characters enforced at validation layer (not DB layer)

### 6.3 Security Rules

- HTTPS enforced for all communications
- SQL injection prevention via JPA parameterized queries (never raw SQL string concatenation)
- XSS protection headers enabled
- Admin-prefixed endpoints (`/admin/**`) require role `ADMIN` verified by Spring Security

---

## 7. Standard Response Envelope

Every single response from the API — success or error — must follow this exact structure:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "timestamp": "2026-03-18T10:00:00Z"
}
```

On error, `data` is `null` and `error` is populated:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "AUTH-001",
    "message": "Invalid credentials",
    "details": "Email or password is incorrect"
  },
  "timestamp": "2026-03-18T10:00:00Z"
}
```

Do not break this envelope for any reason. All controllers must wrap their output in this format.

---

## 8. Error Codes

| Code | Meaning | HTTP Status |
|---|---|---|
| `AUTH-001` | Invalid credentials | 401 |
| `AUTH-002` | JWT access token expired | 401 |
| `AUTH-003` | Insufficient role/permissions | 403 |
| `AUTH-004` | Refresh token invalid or expired | 401 |
| `VALID-001` | Validation failed (field-level errors in `details`) | 400 |
| `DB-001` | Resource not found | 404 |
| `DB-002` | Duplicate entry / conflict | 409 |
| `SYSTEM-001` | Unhandled internal server error | 500 |

---

## 9. API Endpoints

**Base URL:** `/api/v1`  
**Format:** JSON only  
**Auth header:** `Authorization: Bearer <jwt>`

### 9.1 Authentication

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login, receive tokens |
| POST | `/auth/refresh` | ❌ | Exchange refresh token for new access token |
| POST | `/auth/logout` | ✅ USER | Invalidate session |

### 9.2 Decks

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/decks` | ✅ USER | List authenticated user's decks (paginated, searchable) |
| GET | `/decks/{id}` | ✅ USER | Get single deck by ID |
| POST | `/decks` | ✅ USER | Create a new deck |
| PATCH | `/decks/{id}` | ✅ USER | Partially update a deck |
| DELETE | `/decks/{id}` | ✅ USER | Delete deck and cascade-delete its flashcards |

### 9.3 Flashcards

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/decks/{id}/cards` | ✅ USER | Get all cards in a deck |
| POST | `/decks/{id}/cards` | ✅ USER | Add a card to a deck |
| PATCH | `/cards/{cardId}` | ✅ USER | Partially update a card |
| DELETE | `/cards/{cardId}` | ✅ USER | Delete a single card |

### 9.4 Quiz

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/quizzes/results` | ✅ USER | Submit quiz session result |
| GET | `/quizzes/history` | ✅ USER | Get authenticated user's quiz history |

### 9.5 Admin

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/admin/stats` | ✅ ADMIN | Get platform-wide stats |
| GET | `/admin/users` | ✅ ADMIN | List all users |
| PATCH | `/admin/users/{id}` | ✅ ADMIN | Deactivate or reactivate a user |
| DELETE | `/admin/users/{id}` | ✅ ADMIN | Permanently delete a user and all their data |

> For full request/response body shapes per endpoint, refer to `flashcard_frenzy_api_v2.md`.

---

## 10. Business Logic Rules

These are behavioral rules the backend must enforce — not just schema constraints:

1. **Deck ownership** — A user can only read, update, or delete their own decks. Accessing another user's deck returns `403`, not `404`, to avoid leaking resource existence. *(Exception: ADMIN role can access any resource.)*
2. **Card ownership is inherited** — A card belongs to a deck which belongs to a user. Ownership checks on cards go through the deck.
3. **Cascade deletes are hard deletes** — No soft delete / `deleted_at` flag. When something is deleted, it is gone from the database.
4. **Quiz results are immutable** — Once submitted via `POST /quizzes/results`, a result cannot be edited or deleted by the user. Only admin user deletion cascades remove them.
5. **PATCH means partial** — PATCH endpoints must only update fields that are present in the request body. Fields not included must remain unchanged.
6. **Pagination defaults** — `GET /decks` defaults to `page=1`, `limit=20` if not provided.
7. **Admin cannot delete themselves** — `DELETE /admin/users/{id}` must reject if `id` matches the currently authenticated admin's own ID. Return `403`.

---

## 11. Non-Functional Requirements (Backend-Relevant)

| Requirement | Target |
|---|---|
| API response time | ≤ 2 seconds for 95% of requests |
| Database query time | ≤ 500ms |
| Concurrent users supported | 100 |
| Password hashing | bcrypt, salt rounds = 12 |
| Token strategy | JWT (access) + refresh token |

---

## 12. Project Timeline (Backend Phase)

The backend is developed in **Phase 2 (Week 3–4)** of the overall project plan.

**Week 3:**
- Day 1: Spring Boot project setup with dependencies
- Day 2: Database configuration and JPA entities
- Day 3: JWT authentication implementation
- Day 4: User management endpoints
- Day 5: Deck and Flashcard CRUD operations

**Week 4:**
- Day 1: Quiz logic and scoring
- Day 2: Result management
- Day 3: Search and filtering
- Day 4: Error handling and validation
- Day 5: API documentation and testing

**Milestone:** End of Week 4 — Backend API fully functional and tested.

---

## 13. What Is Out of Scope for the Backend

Do not implement these — they are explicitly excluded from the project:

- Social media / OAuth login (Google, Facebook, etc.)
- Real payment gateway integration
- Push notification services
- Email verification or password reset flows
- Soft deletes
- File upload (profile pictures, card images)
- Real-time features (WebSockets, SSE)

---

## 14. Quick Reference Cheat Sheet

```
Project:        Flashcard Frenzy
Your role:      Spring Boot Backend API only
Language:       Java 17
Framework:      Spring Boot 3.x
Security:       Spring Security + JWT
ORM:            Spring Data JPA
Database:       PostgreSQL 14+ on Supabase
Build:          Maven
Base URL:       /api/v1
Roles:          USER, ADMIN
Response fmt:   Always wrap in {success, data, error, timestamp}
PATCH ≠ PUT:    PATCH = partial update only
Cascade:        Deck delete → flashcards deleted
                User delete → decks + flashcards + quiz_results deleted
Error codes:    AUTH-001..004, VALID-001, DB-001..002, SYSTEM-001
Full API spec:  See flashcard_frenzy_api_v2.md
```
