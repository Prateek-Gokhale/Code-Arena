# CodeArena

CodeArena is a full-stack LeetCode-style coding practice platform with a React/Vite/Tailwind frontend, Node/Express API, MongoDB persistence, JWT authentication, Monaco Editor, submissions, progress analytics, and an admin problem manager.

Live frontend: https://leetcode-clone-two-tau.vercel.app

## Features

- Landing, login, register, problemset, coding workspace, submissions, dashboard, and admin pages
- LeetCode-inspired split workspace with problem statement, examples, constraints, submissions, Monaco editor, language selector, test cases, result panel, and console output
- JWT auth with bcrypt password hashing and protected routes
- Problem model with title, slug, difficulty, tags, description, examples, constraints, starter code, public tests, and hidden tests
- Submissions stored with language, status, runtime, memory, submitted code, and test result details
- Dashboard with solved totals, difficulty breakdown, recent submissions, and activity chart
- Admin CRUD for problems and test cases
- Judge0 API integration when configured; local JavaScript runner fallback for seeded problems

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, Monaco Editor, React Router, Axios, Recharts
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, express-validator
- Code execution: Judge0 API or local JavaScript fallback

## Project Structure

```text
.
├─ client/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ layouts/
│  │  ├─ pages/
│  │  ├─ services/
│  │  └─ utils/
│  └─ .env.example
├─ server/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ seed/
│  │  └─ services/
│  └─ .env.example
└─ package.json
```

## Local Setup

1. Install dependencies:

```powershell
npm install
cmd /c npm install --prefix client
cmd /c npm install --prefix server
```

2. Create environment files:

```powershell
Copy-Item client/.env.example client/.env
Copy-Item server/.env.example server/.env
```

3. Start MongoDB locally or set `MONGO_URI` in `server/.env`.

4. Seed dummy data:

```powershell
cmd /c npm run seed --prefix server
```

Seeded admin account:

```text
admin@codearena.dev / Admin123!
```

5. Run the app:

```powershell
cmd /c npm run dev
```

Frontend: http://127.0.0.1:5179  
Backend: http://localhost:5000/api/health

## Judge0

JavaScript seed problems run locally when `JUDGE0_KEY` is empty. To enable Python, Java, and C++ execution, add Judge0 values to `server/.env`:

```text
JUDGE0_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_KEY=your-key
JUDGE0_HOST=judge0-ce.p.rapidapi.com
```

## Build

```powershell
cmd /c npm run build --prefix client
```

## Deployment Notes

- Deploy `client/` to Vercel and set `VITE_API_URL` to the deployed API URL.
- Deploy `server/` to Render/Railway/Fly/etc. and set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and optional Judge0 variables.
- Hidden tests are excluded from public problem API responses and only loaded by admin routes or submit execution.
