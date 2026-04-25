# LinguaAI — Frontend

> AI-powered English language learning platform for Georgian speakers — Frontend

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white&style=flat-square)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white&style=flat-square)

---

## About

LinguaAI is an AI-powered English language learning platform built for Georgian speakers. It combines AI-generated content, grammar practice, vocabulary tools, and pronunciation support into a single platform.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 + Dark mode |
| Animations | Framer Motion |
| Routing | React Router v7 |
| Forms | React Hook Form + Yup |
| HTTP | Axios with auto-refresh interceptor |
| Icons | Lucide React |
| Testing | Vitest + Testing Library |

---

## Features

### Learning Tools
- **Generate Sentences** — AI generates 10 English sentences on any topic with Georgian translations and text-to-speech playback
- **Saved Sentences** — save and manage favourite sentences for later review
- **Translate Word** — instant word translation with examples
- **Translate Text** — full paragraph translation
- **Saved Words** — save and manage vocabulary words
- **Vocabulary Quiz** — test your saved vocabulary knowledge
- **Tenses** — learn all 12 English tenses with formulas, explanations in Georgian, and examples
- **Tenses Quiz** — AI-generated fill-in-the-blank quiz per tense and difficulty level; word bank with click-to-fill interaction and text-to-speech on completion
- **Weekly Goal** — set weekly sentence and word targets; progress bars update in real time based on saves made since Monday

### Auth & Platform
- Register & login with email/password
- Google OAuth 2.0 one-click sign in
- Email verification flow
- Forgot / reset password flow
- JWT access token stored in React memory (never in localStorage)
- Auto token refresh on 401 via Axios interceptor
- Two-Factor Authentication (TOTP) — setup QR code, enable/disable from profile
- User profile page — edit name, change password
- Admin panel — view users, change roles, delete users
- Protected routes with role-based access control (REGULAR / ADMIN)
- Dark / light mode toggle
- Fully responsive — burger menu on screens below 1280px

---

## Getting Started

### Prerequisites

- Node.js 18+
- LinguaAI backend running (see [`linguaai-backend`](../linguaai-backend))

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:4000
```

### 3. Start the development server

```bash
npm run dev
```

App runs on `http://localhost:5173`.

### 4. Run tests

```bash
npm run test:run
```

---

## Project Structure

```
src/
├── components/              # Shared components (ProtectedRoute, PomodoroTimer, ThemeToggle, Toast...)
├── constants/               # Route constants
├── context/                 # AuthContext, ThemeContext, PomodoroContext
├── data/                    # Static data (tenses, tense quiz data)
├── pages/
│   ├── homePage/
│   ├── loginPage/
│   ├── registerPage/
│   ├── profilePage/         # Profile, password, 2FA management
│   ├── generateSentencesPage/
│   ├── savedSentencesPage/
│   ├── translateWordPage/
│   ├── translateTextPage/
│   ├── savedWordsPage/
│   ├── vocabularyQuizPage/
│   ├── tensesPage/          # Tenses overview + detail (Learn / Practice / Quiz tabs)
│   ├── tensesQuizPage/      # AI-powered tenses fill-in-the-blank quiz
│   ├── adminPage/
│   ├── verifyEmailPage/
│   ├── forgotPasswordPage/
│   ├── resetPasswordPage/
│   ├── twoFactorVerifyPage/
│   └── googleAuthSuccess/
├── router/                  # AppRouter
├── schemas/                 # Yup validation schemas
├── test/                    # Vitest setup
└── types/                   # TypeScript type definitions
```

---

## Routes

| Path | Description | Protected |
|------|-------------|-----------|
| `/` | Home / landing page | No |
| `/register` | Create account | No |
| `/login` | Sign in | No |
| `/profile` | User profile | Yes |
| `/generate-sentences` | AI sentence generator | Yes |
| `/saved-sentences` | Saved sentences | Yes |
| `/translate-word` | Word translator | Yes |
| `/translate-text` | Text translator | Yes |
| `/saved-words` | Saved words | Yes |
| `/vocabulary-quiz` | Vocabulary quiz | Yes |
| `/tenses` | Tenses overview | Yes |
| `/tenses/:tenseId` | Tense detail | Yes |
| `/tenses-quiz` | AI tenses quiz | Yes |
| `/adminPanel` | Admin panel | Yes (ADMIN) |
| `/auth/verify-email` | Email verification | No |
| `/passwordRecovery` | Forgot password | No |
| `/auth/reset-password` | Reset password | No |
| `/auth/2fa-verify` | Two-factor verification | No |
| `/auth/success` | Google OAuth callback | No |
