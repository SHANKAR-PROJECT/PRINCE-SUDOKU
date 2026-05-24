# Sudoku by Prince Malhotra

A fully playable Sudoku game with Easy, Normal, and Hard difficulty levels — built with React + Vite, featuring a premium deep navy/gold theme.

## Run & Operate

- `pnpm --filter @workspace/sudoku-game run dev` — run the Sudoku game (uses PORT env var)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, shadcn/ui, framer-motion
- Routing: wouter
- Build: Vite

## Where things live

- `artifacts/sudoku-game/src/lib/sudoku.ts` — Sudoku engine (backtracking generator, validator, solver)
- `artifacts/sudoku-game/src/pages/Game.tsx` — main game page with state management
- `artifacts/sudoku-game/src/components/Board.tsx` — 9x9 grid component
- `artifacts/sudoku-game/src/components/Controls.tsx` — number pad and control buttons
- `artifacts/sudoku-game/src/index.css` — theme (deep indigo/navy + gold palette)

## Architecture decisions

- Pure client-side app — no backend or database needed; all game logic runs in the browser
- Sudoku puzzles generated at runtime using backtracking algorithm — guaranteed unique solutions
- Difficulty controls how many cells are removed from a completed board (Easy: ~36, Normal: ~46, Hard: ~54)
- Framer Motion used for cell selection and win animations

## Product

A polished, fully functional Sudoku game with:
- Three difficulty levels (Easy / Normal / Hard)
- Real-time error highlighting
- Notes/pencil mode for candidate numbers
- Keyboard + mouse/touch input
- Timer
- Win detection with celebration
- "Made by Prince Malhotra" branding

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_No backend — this is a pure frontend app. Deploy as a static site._
