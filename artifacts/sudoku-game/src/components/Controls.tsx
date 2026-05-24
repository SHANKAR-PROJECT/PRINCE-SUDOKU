import React from 'react';
import { Button } from '@/components/ui/button';
import { Delete, Pencil, CheckCircle2, RotateCcw } from 'lucide-react';

interface ControlsProps {
  onInput: (num: number | null) => void;
  notesMode: boolean;
  onToggleNotes: () => void;
  onCheck: () => void;
  onNewGame: () => void;
}

export default function Controls({ onInput, notesMode, onToggleNotes, onCheck, onNewGame }: ControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map(n => (
          <Button 
            key={n} 
            data-testid={`btn-num-${n}`}
            variant="secondary" 
            className="h-12 text-lg font-serif bg-secondary hover:bg-primary/20 text-foreground"
            onClick={() => onInput(n)}
          >
            {n}
          </Button>
        ))}
        {[6, 7, 8, 9].map(n => (
          <Button 
            key={n} 
            data-testid={`btn-num-${n}`}
            variant="secondary" 
            className="h-12 text-lg font-serif bg-secondary hover:bg-primary/20 text-foreground"
            onClick={() => onInput(n)}
          >
            {n}
          </Button>
        ))}
        <Button 
          data-testid="btn-erase"
          variant="secondary" 
          className="h-12 bg-secondary hover:bg-destructive/20 text-foreground"
          onClick={() => onInput(null)}
        >
          <Delete className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex gap-3 justify-center mt-2">
        <Button 
          data-testid="btn-notes"
          variant={notesMode ? "default" : "outline"} 
          className={`flex-1 ${notesMode ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border-primary/50 text-foreground hover:bg-primary/10'}`}
          onClick={onToggleNotes}
        >
          <Pencil className="w-4 h-4 mr-2" />
          Notes {notesMode ? 'ON' : 'OFF'}
        </Button>
        
        <Button 
          data-testid="btn-check"
          variant="outline" 
          className="flex-1 border-primary/50 text-foreground hover:bg-primary/10"
          onClick={onCheck}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Check
        </Button>

        <Button 
          data-testid="btn-new-game"
          variant="outline" 
          className="flex-1 border-primary/50 text-foreground hover:bg-primary/10"
          onClick={onNewGame}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}
