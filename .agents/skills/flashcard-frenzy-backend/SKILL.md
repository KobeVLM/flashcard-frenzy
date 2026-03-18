---
name: flashcard-frenzy-backend
description: Provides full project context for the Flashcard Frenzy Spring Boot backend. Use this when working on any backend task for Flashcard Frenzy — entity creation, endpoint implementation, security configuration, database schema, business logic, or error handling.
---

# Flashcard Frenzy — Backend Context Reference

**Scope:** Spring Boot Backend only  
**SDD Version:** 1.0 | **API Version:** 2.0  
**Last Updated:** March 18, 2026

---

## When to use this skill

- Use this when implementing or modifying any part of the Flashcard Frenzy Spring Boot backend
- Use this when creating JPA entities, repositories, services, or controllers
- Use this when configuring Spring Security, JWT, or role-based access
- Use this when writing or modifying database schema or migrations
- Use this when unsure about business logic rules, error codes, or response format

---

## 0. Read This First

This is a reference document. Before writing any code or making any decisions, read this top to bottom. When in doubt about any behavior — auth, endpoints, error codes, database shape — come back here first.

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

Your job is the Spring Boot API only. The web and mobile clients consume it. You do not touch those.

---

## 2. Tech Stack

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

The backend is a standard three-layer Spring Boot application:

```
Controller Layer  →  Receives HTTP requests, validates input, returns responses
Service Layer     →  Business logic, orchestration
Repository Layer  →  Spring Data JPA interfaces talking to PostgreSQL
```

All communication with clients is over HTTPS. All request and response bodies are JSON. The backend does not render any HTML or templates.

---

## 4. User Roles

There are exactly two roles:

| Role | Description |
|---|---|
| `USER` | Standard student/learner. Manages their own decks, cards, and quiz results. |
| `ADMIN` | Platform administrator. Can view stats and manage all user accounts. |

Role is stored in the `users` table as a string enum. Spring Security enforces role-based access. A `USER` hitting an `ADMIN` endpoint must receive `403 Forbidden`.

---

## 5. Database Schema

### Tables

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

### Relationships

- `users` → `decks` : One-to-Many
- `decks` → `flashcards` : One-to-Many
- `users` → `quiz_results` : One-to-Many
- `quiz_results` → `decks` : Many-to-One

### Cascade Rules

- Deleting a **deck** must cascade-delete all its **flashcards**
- Deleting a **user** must cascade-delete their **decks**, **flashcards**, and **quiz_results**

---

## 6. Authentication & Security

### How Auth Works

1. User registers or logs in → backend issues a **JWT access token** and a **refresh token**
2. Client sends `Authorization: Bearer <jwt>` on every protected request
3. When access token expires (`AUTH-002`), client calls `POST /auth/refresh` with the refresh token
4. Logout invalidates the session

### Password Rules

- Hashed with **bcrypt**, salt rounds = **12**
- Minimum 8 characters enforced at the validation layer, not the DB layer

### Security Rules

- SQL injection prevention via JPA parameterized queries — never raw SQL string concatenation
- XSS protection headers enabled
- `/admin/**` endpoints require role `ADMIN` enforced by Spring Security

---

## 7. Standard Response Envelope

Every response — success or error — must follow this exact structure. No exceptions.

**Success:**
```json
{
  "success": true,
  "data": {},
  "error": null,
  "timestamp": "2026-03-18T10:00:00Z"
}
```

**Error:**
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

All controllers must wrap output in this format. Do not return raw objects or Spring's default error responses.

---

## 8. Error Codes

| Code | Meaning | HTTP Status |
|---|---|---|
| `AUTH-001` | Invalid credentials | 401 |
| `AUTH-002` | JWT access token expired | 401 |
| `AUTH-003` | Insufficient role/permissions | 403 |
| `AUTH-004` | Refresh token invalid or expired | 401 |
| `VALID-001` | Validation failed (field errors in `details`) | 400 |
| `DB-001` | Resource not found | 404 |
| `DB-002` | Duplicate entry / conflict | 409 |
| `SYSTEM-001` | Unhandled internal server error | 500 |

---

## 9. API Endpoints

**Base URL:** `/api/v1`

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login, receive tokens |
| POST | `/auth/refresh` | ❌ | Exchange refresh token for new access token |
| POST | `/auth/logout` | ✅ USER | Invalidate session |

### Decks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/decks` | ✅ USER | List user's decks (paginated, searchable) |
| GET | `/decks/{id}` | ✅ USER | Get single deck |
| POST | `/decks` | ✅ USER | Create deck |
| PATCH | `/decks/{id}` | ✅ USER | Partially update deck |
| DELETE | `/decks/{id}` | ✅ USER | Delete deck + cascade flashcards |

### Flashcards

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/decks/{id}/cards` | ✅ USER | Get all cards in a deck |
| POST | `/decks/{id}/cards` | ✅ USER | Add card to deck |
| PATCH | `/cards/{cardId}` | ✅ USER | Partially update card |
| DELETE | `/cards/{cardId}` | ✅ USER | Delete card |

### Quiz

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/quizzes/results` | ✅ USER | Submit quiz session result |
| GET | `/quizzes/history` | ✅ USER | Get user's quiz history |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/stats` | ✅ ADMIN | Platform-wide stats |
| GET | `/admin/users` | ✅ ADMIN | List all users |
| PATCH | `/admin/users/{id}` | ✅ ADMIN | Deactivate or reactivate user |
| DELETE | `/admin/users/{id}` | ✅ ADMIN | Permanently delete user + all data |

> For full request/response body shapes, refer to `flashcard_frenzy_api_v2.md` in this same skill folder.

---

## 10. Business Logic Rules

These are enforceable rules — not suggestions. Implement all of them:

1. **Deck ownership** — A user can only read, update, or delete their own decks. Accessing another user's deck returns `403`, not `404`, to avoid leaking resource existence. ADMIN role bypasses this.
2. **Card ownership is inherited** — A card belongs to a deck which belongs to a user. Ownership checks on cards go through the deck.
3. **Cascade deletes are hard deletes** — No soft delete, no `deleted_at` flag. Deleted records are gone from the database.
4. **Quiz results are immutable** — Once submitted, a result cannot be edited or deleted by the user. Only an admin-triggered user deletion cascades remove them.
5. **PATCH means partial** — Only update fields present in the request body. Fields not included must remain unchanged.
6. **Pagination defaults** — `GET /decks` defaults to `page=1`, `limit=20` if not provided in query params.
7. **Admin self-delete guard** — `DELETE /admin/users/{id}` must reject the request if `id` matches the currently authenticated admin's own ID. Return `403`.

---

## 11. Non-Functional Requirements

| Requirement | Target |
|---|---|
| API response time | ≤ 2 seconds for 95% of requests |
| Database query time | ≤ 500ms |
| Concurrent users | 100 |
| Password hashing | bcrypt, salt rounds = 12 |

---

## 12. Out of Scope — Do Not Implement

- Social media / OAuth login
- Payment gateway integration
- Push notifications
- Email verification or password reset
- Soft deletes
- File uploads
- Real-time features (WebSockets, SSE)

---

## 13. Quick Reference

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
