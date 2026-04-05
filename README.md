# LinguaAI — Frontend

> AI-powered language learning platform, currently focused on **English** — Frontend

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white&style=flat-square)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white&style=flat-square)

---

## About

LinguaAI is an AI-powered language learning platform currently focused on **English**. More languages may be added in the future. The platform is designed with the following core learning tools:

- **Text-to-Speech** — listen to any text read aloud to improve pronunciation and listening skills
- **Sentence Builder** — construct sentences from a given set of words to practise grammar and structure
- **Topic-based Text Generation** — generate reading passages on any topic to build vocabulary and comprehension

Authentication, user profiles, and an admin panel are also included as part of the full-stack foundation.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 + Dark mode |
| Animations | Framer Motion |
| Routing | React Router v7 |
| Forms | React Hook Form + Yup |
| HTTP | Axios with auto-refresh interceptor |
| Icons | Lucide React |
| Testing | Vitest + Testing Library |

## Features

### Learning (in development)
- 🔊 **Text-to-Speech** — listen to text read aloud for pronunciation practice
- ✍️ **Sentence Builder** — form correct sentences from a given set of words
- 📝 **Text Generator** — generate reading passages on any chosen topic

### Auth & Platform
- 🔐 Register & login with email/password
- 🔑 Google OAuth 2.0 one-click sign in
- 📧 Email verification flow
- 🔄 Forgot / reset password flow
- 🛡️ JWT access token stored in React memory (never in localStorage)
- ♻️ Auto token refresh on 401 via Axios interceptor
- 🔑 Two-Factor Authentication (TOTP) — setup QR code, enable/disable from profile
- 👤 User profile page — edit name, change password
- 🛠️ Admin panel — view users, change roles, delete users, pagination
- 🔒 Protected routes with role-based access control (REGULAR / ADMIN)
- 🌙 Dark / light mode toggle with system preference detection
- 📱 Fully responsive on all screen sizes

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

## Project Structure

```
src/
├── components/        # Shared components (ProtectedRoute, GoogleButton, ThemeToggle)
├── constants/         # Route constants
├── context/           # AuthContext, ThemeContext
├── pages/
│   ├── homePage/          # Landing page
│   ├── loginPage/
│   ├── registerPage/
│   ├── profilePage/       # User profile + change password
│   ├── adminPage/         # Admin user management
│   ├── verifyEmailPage/
│   ├── forgotPasswordPage/
│   ├── resetPasswordPage/
│   ├── twoFactorVerifyPage/
│   └── googleAuthSuccess/
├── router/            # AppRouter
├── schemas/           # Yup validation schemas
├── test/              # Vitest unit & component tests
└── types/             # TypeScript type definitions
```

## Routes

| Path | Description | Protected |
|------|-------------|-----------|
| `/` | Home / landing page | No |
| `/register` | Create account | No |
| `/login` | Sign in | No |
| `/profile` | User profile | Yes |
| `/adminPanel` | Admin panel | Yes (ADMIN) |
| `/auth/verify-email` | Email verification | No |
| `/passwordRecovery` | Forgot password | No |
| `/auth/reset-password` | Reset password | No |
| `/auth/2fa/verify` | Two-factor verification | No |
| `/auth/success` | Google OAuth callback | No |
