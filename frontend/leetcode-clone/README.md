# AlgoArena (LeetCode Clone)

A standalone React + Vite coding practice app with:

- Problem catalog with search, difficulty filter, and tag filter
- Problem detail pages (description, examples, constraints)
- JavaScript code editor with starter templates
- `Run Sample Tests` and `Submit` flows
- Hidden test evaluation on submit
- Submission history and solved tracking with local persistence

## Run Locally

```powershell
cd frontend/leetcode-clone
npm install
npm run dev
```

App URL: `http://localhost:5174`

## Build

```powershell
cd frontend/leetcode-clone
npm run build
```

## Notes

- This MVP runs code directly in the browser for JavaScript functions.
- State is stored in `localStorage` under `algo_arena_state_v1`.
- It is intentionally framework-light so you can later plug in a backend judge service.
