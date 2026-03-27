# Code Arena

A LeetCode-style coding platform built with React + Vite.

Live app: [https://leetcode-clone-two-tau.vercel.app](https://leetcode-clone-two-tau.vercel.app)

## Project Highlights

- Problem catalog with search, difficulty filter, and tag filter
- Detailed problem view (description, examples, constraints)
- In-browser JavaScript code editor with starter templates
- `Run Sample Tests` mode with case-by-case output
- `Submit` mode with hidden test evaluation
- Submission history, runtime/memory stats, solved tracking
- Persistent local state using browser `localStorage`

## Tech Stack

- React 18
- Vite 5
- Plain CSS (responsive custom UI)
- Vercel (production deployment)

## Folder Structure

```text
.
├─ frontend/
│  └─ leetcode-clone/        # Main Code Arena app
└─ README.md
```

## Run Locally

```powershell
cd frontend/leetcode-clone
npm install
cmd /c npm run dev
```

App runs on `http://localhost:5174`.

## Build

```powershell
cd frontend/leetcode-clone
cmd /c npm run build
```

## Deploy

```powershell
cd frontend/leetcode-clone
cmd /c npm run deploy:vercel
```

## Current Scope

This version is an MVP focused on frontend interview-practice workflows using JavaScript execution in-browser. It is designed so a backend judge service can be added later for secure multi-language execution.

## Next Improvements

1. Backend judge workers (secure sandboxed execution)
2. Multi-language support (Java, Python, C++, JavaScript)
3. Authentication, profiles, and streak tracking
4. Contests, leaderboards, and discussion threads
