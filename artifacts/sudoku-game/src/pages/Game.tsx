import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BoardState, Difficulty, generatePuzzle, checkBoard, isBoardFull } from '@/lib/sudoku';
import Board from '@/components/Board';
import Controls from '@/components/Controls';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const CONFETTI_COLORS = ['#f59e0b', '#fbbf24', '#a78bfa', '#60a5fa', '#34d399', '#f87171', '#fb923c'];

function ConfettiParticle({ index }: { index: number }) {
  const x = Math.random() * 100;
  const delay = Math.random() * 0.6;
  const size = 6 + Math.random() * 8;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const rotate = Math.random() * 360;
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: '-10px',
        width: size,
        height: size * 0.5,
        backgroundColor: color,
        borderRadius: 2,
        rotate,
      }}
      initial={{ y: -10, opacity: 1 }}
      animate={{ y: '110vh', opacity: [1, 1, 0], rotate: rotate + 720 }}
      transition={{ duration: 2.5 + Math.random(), delay, ease: 'linear' }}
    />
  );
}

export default function Game() {
  const [board, setBoard] = useState<BoardState | null>(null);
  const [selectedCell, setSelectedCell] = useState<{r: number, c: number} | null>(null);
  const [notesMode, setNotesMode] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [errors, setErrors] = useState<{r: number, c: number}[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const startNewGame = useCallback((diff: Difficulty) => {
    const { board: newBoard } = generatePuzzle(diff);
    setBoard(newBoard);
    setDifficulty(diff);
    setSelectedCell(null);
    setErrors([]);
    setIsWon(false);
    setTime(0);
    setTimerActive(true);
  }, []);

  useEffect(() => {
    startNewGame('normal');
  }, [startNewGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && !isWon) {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, isWon]);

  const handleInput = useCallback((num: number | null) => {
    if (!board || !selectedCell || isWon) return;
    const { r, c } = selectedCell;
    const cell = board[r][c];

    if (cell.isGiven) return;

    setBoard(prev => {
      if (!prev) return prev;
      const newBoard = prev.map(row => row.map(c => ({...c, notes: new Set(c.notes)})));
      
      if (num === null) {
        newBoard[r][c].value = null;
      } else if (notesMode) {
        if (newBoard[r][c].notes.has(num)) {
          newBoard[r][c].notes.delete(num);
        } else {
          newBoard[r][c].notes.add(num);
        }
      } else {
        newBoard[r][c].value = num;
        newBoard[r][c].notes.clear();
      }
      
      // Real-time error check
      const currentErrors = checkBoard(newBoard);
      setErrors(currentErrors);

      // Check win condition
      if (currentErrors.length === 0 && isBoardFull(newBoard)) {
        setIsWon(true);
        setTimerActive(false);
      }

      return newBoard;
    });
  }, [board, selectedCell, notesMode, isWon]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell || !board) return;
      const { r, c } = selectedCell;

      if (e.key >= '1' && e.key <= '9') {
        handleInput(parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleInput(null);
      } else if (e.key === 'ArrowUp') {
        setSelectedCell({ r: Math.max(0, r - 1), c });
      } else if (e.key === 'ArrowDown') {
        setSelectedCell({ r: Math.min(8, r + 1), c });
      } else if (e.key === 'ArrowLeft') {
        setSelectedCell({ r, c: Math.max(0, c - 1) });
      } else if (e.key === 'ArrowRight') {
        setSelectedCell({ r, c: Math.min(8, c + 1) });
      } else if (e.key === 'n' || e.key === 'N') {
        setNotesMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, handleInput, board]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCheck = () => {
    if (board) {
      setErrors(checkBoard(board));
    }
  };

  if (!board) return <div className="flex h-screen items-center justify-center text-primary">Loading...</div>;

  const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 lg:p-8 bg-background text-foreground selection:bg-primary/20">

      {/* Full-screen Winner Modal */}
      <AnimatePresence>
        {isWon && (
          <motion.div
            data-testid="win-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          >
            {/* Confetti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 60 }).map((_, i) => (
                <ConfettiParticle key={i} index={i} />
              ))}
            </div>

            {/* Card */}
            <motion.div
              initial={{ scale: 0.7, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
              className="relative z-10 bg-card border border-yellow-400/40 rounded-2xl shadow-2xl shadow-yellow-400/10 px-10 py-10 flex flex-col items-center gap-5 max-w-sm w-full mx-4"
            >
              {/* Trophy */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.25 }}
                className="text-7xl select-none"
                style={{ filter: 'drop-shadow(0 0 18px #f59e0b)' }}
              >
                🏆
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-4xl font-bold font-serif text-yellow-400 text-center tracking-wide"
              >
                You Won!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="text-muted-foreground text-center text-sm"
              >
                Puzzle solved successfully
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-6 w-full justify-center"
              >
                <div className="flex flex-col items-center bg-background/60 rounded-xl px-5 py-3 border border-white/10">
                  <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-1">Time</span>
                  <span className="text-2xl font-bold text-yellow-400 font-mono">{formatTime(time)}</span>
                </div>
                <div className="flex flex-col items-center bg-background/60 rounded-xl px-5 py-3 border border-white/10">
                  <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-1">Level</span>
                  <span className="text-2xl font-bold text-yellow-400 font-mono">{difficultyLabel}</span>
                </div>
              </motion.div>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-3 w-full pt-1"
              >
                <Button
                  data-testid="btn-play-again"
                  onClick={() => startNewGame(difficulty)}
                  className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 text-base py-5 rounded-xl shadow-lg shadow-yellow-400/30"
                >
                  Play Again
                </Button>
                <Button
                  data-testid="btn-change-difficulty"
                  variant="outline"
                  onClick={() => startNewGame(difficulty === 'easy' ? 'normal' : difficulty === 'normal' ? 'hard' : 'easy')}
                  className="w-full border-white/20 text-muted-foreground hover:text-foreground text-sm py-4 rounded-xl"
                >
                  Try {difficulty === 'easy' ? 'Normal' : difficulty === 'normal' ? 'Hard' : 'Easy'} Next
                </Button>
              </motion.div>

              {/* Developer credit inside modal */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
                className="flex items-center gap-2 pt-1"
              >
                <img src="/prince-malhotra.jpg" alt="Prince Malhotra" className="w-6 h-6 rounded-full object-cover border border-yellow-400/60" />
                <span className="text-xs text-muted-foreground font-mono">Made by Prince Malhotra</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="w-full max-w-md space-y-6">
        
        <header className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-serif tracking-tight text-primary font-bold">SUDOKU</h1>
          <div className="flex items-center justify-between w-full text-sm font-mono text-muted-foreground mt-2">
            <div>TIME {formatTime(time)}</div>
            <div className="flex gap-2">
              {(['easy', 'normal', 'hard'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  data-testid={`btn-diff-${d}`}
                  className={`capitalize hover:text-primary transition-colors ${difficulty === d ? 'text-primary font-bold' : ''}`}
                  onClick={() => startNewGame(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="relative">
          <Board 
            board={board} 
            selectedCell={selectedCell} 
            onSelectCell={(r, c) => setSelectedCell({r, c})}
            errors={errors}
          />

          
        </div>

        <Controls 
          onInput={handleInput}
          notesMode={notesMode}
          onToggleNotes={() => setNotesMode(n => !n)}
          onCheck={handleCheck}
          onNewGame={() => startNewGame(difficulty)}
        />

        <footer className="flex items-center justify-center gap-3 pt-8 pb-2">
          <img
            src="/prince-malhotra.jpg"
            alt="Prince Malhotra"
            className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400 shadow-lg shadow-yellow-400/30"
          />
          <div className="flex flex-col items-start">
            <span className="text-yellow-400 font-semibold text-sm leading-tight">Prince Malhotra</span>
            <span className="text-muted-foreground text-xs font-mono leading-tight">Developer</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
