import React from 'react';
import { BoardState } from '@/lib/sudoku';
import { motion } from 'framer-motion';

interface BoardProps {
  board: BoardState;
  selectedCell: { r: number, c: number } | null;
  onSelectCell: (r: number, c: number) => void;
  errors: { r: number, c: number }[];
}

export default function Board({ board, selectedCell, onSelectCell, errors }: BoardProps) {
  const selectedValue = selectedCell ? board[selectedCell.r][selectedCell.c].value : null;

  return (
    <div className="aspect-square w-full bg-border rounded-xl p-1 overflow-hidden shadow-2xl">
      <div className="grid grid-cols-9 grid-rows-9 gap-px bg-border h-full w-full">
        {board.map((row, r) => (
          row.map((cell, c) => {
            const isSelected = selectedCell?.r === r && selectedCell?.c === c;
            const isRelated = selectedCell && (selectedCell.r === r || selectedCell.c === c || (Math.floor(selectedCell.r / 3) === Math.floor(r / 3) && Math.floor(selectedCell.c / 3) === Math.floor(c / 3)));
            const isSameValue = cell.value !== null && cell.value === selectedValue;
            const isError = errors.some(e => e.r === r && e.c === c);

            // Calculate border classes for 3x3 grid separation
            let borders = '';
            if (c % 3 === 2 && c !== 8) borders += 'border-r-2 border-r-border ';
            if (r % 3 === 2 && r !== 8) borders += 'border-b-2 border-b-border ';
            if (c % 3 === 0 && c !== 0) borders += 'border-l-2 border-l-border ';
            if (r % 3 === 0 && r !== 0) borders += 'border-t-2 border-t-border ';

            let bgClass = 'bg-card hover:bg-muted/50';
            if (isSelected) bgClass = 'bg-primary/20';
            else if (isError) bgClass = 'bg-destructive/20';
            else if (isSameValue) bgClass = 'bg-primary/30';
            else if (isRelated) bgClass = 'bg-muted/40';

            return (
              <motion.div
                key={`${r}-${c}`}
                data-testid={`cell-${r}-${c}`}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 ${borders} ${bgClass}`}
                onClick={() => onSelectCell(r, c)}
                whileTap={{ scale: 0.95 }}
              >
                {cell.value ? (
                  <span className={`text-2xl sm:text-3xl font-serif ${cell.isGiven ? 'text-foreground' : 'text-primary font-bold'}`}>
                    {cell.value}
                  </span>
                ) : (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                      <span key={n} className="flex items-center justify-center text-[8px] sm:text-[10px] text-muted-foreground font-mono">
                        {cell.notes.has(n) ? n : ''}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })
        ))}
      </div>
    </div>
  );
}
