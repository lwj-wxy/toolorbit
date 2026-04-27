import React, { useState, useEffect, useCallback } from 'react';
import { Gamepad2, RotateCcw, Trophy, ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Grid = number[][];

const GRID_SIZE = 4;

const getRandomEmptyCell = (grid: Grid) => {
  const emptyCells = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) emptyCells.push({ r, c });
    }
  }
  if (emptyCells.length === 0) return null;
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const addNumber = (grid: Grid) => {
  const newGrid = grid.map(row => [...row]);
  const cell = getRandomEmptyCell(newGrid);
  if (cell) {
    newGrid[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
  }
  return newGrid;
};

const Game2048 = () => {
  const [grid, setGrid] = useState<Grid>(() => {
    let initialGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    initialGrid = addNumber(initialGrid);
    initialGrid = addNumber(initialGrid);
    return initialGrid;
  });
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('2048-best-score')) || 0);
  const [gameOver, setGameOver] = useState(false);

  const slide = (row: number[]) => {
    let arr = row.filter(val => val !== 0);
    let newScore = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        newScore += arr[i];
        arr.splice(i + 1, 1);
      }
    }
    while (arr.length < GRID_SIZE) arr.push(0);
    return { arr, addedScore: newScore };
  };

  const move = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (gameOver) return;

    let newGrid = grid.map(row => [...row]);
    let totalAddedScore = 0;
    let changed = false;

    if (direction === 'LEFT' || direction === 'RIGHT') {
      for (let i = 0; i < GRID_SIZE; i++) {
        let row = newGrid[i];
        if (direction === 'RIGHT') row.reverse();
        const { arr, addedScore } = slide(row);
        if (direction === 'RIGHT') arr.reverse();
        if (JSON.stringify(newGrid[i]) !== JSON.stringify(arr)) changed = true;
        newGrid[i] = arr;
        totalAddedScore += addedScore;
      }
    } else {
      for (let j = 0; j < GRID_SIZE; j++) {
        let col = [newGrid[0][j], newGrid[1][j], newGrid[2][j], newGrid[3][j]];
        if (direction === 'DOWN') col.reverse();
        const { arr, addedScore } = slide(col);
        if (direction === 'DOWN') arr.reverse();
        
        let originalCol = [grid[0][j], grid[1][j], grid[2][j], grid[3][j]];
        if (JSON.stringify(originalCol) !== JSON.stringify(arr)) changed = true;

        for (let i = 0; i < GRID_SIZE; i++) {
          newGrid[i][j] = arr[i];
        }
        totalAddedScore += addedScore;
      }
    }

    if (changed) {
      const finalGrid = addNumber(newGrid);
      setGrid(finalGrid);
      setScore(s => s + totalAddedScore);
      
      // Check Game Over
      if (!getRandomEmptyCell(finalGrid)) {
        let canMove = false;
        for (let i = 0; i < GRID_SIZE; i++) {
          for (let j = 0; j < GRID_SIZE; j++) {
            if ((i < GRID_SIZE - 1 && finalGrid[i][j] === finalGrid[i + 1][j]) ||
                (j < GRID_SIZE - 1 && finalGrid[i][j] === finalGrid[i][j + 1])) {
              canMove = true;
              break;
            }
          }
        }
        if (!canMove) setGameOver(true);
      }
    }
  }, [grid, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': move('UP'); break;
        case 'ArrowDown': move('DOWN'); break;
        case 'ArrowLeft': move('LEFT'); break;
        case 'ArrowRight': move('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048-best-score', score.toString());
    }
  }, [score, bestScore]);

  const resetGame = () => {
    let initialGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    initialGrid = addNumber(initialGrid);
    initialGrid = addNumber(initialGrid);
    setGrid(initialGrid);
    setScore(0);
    setGameOver(false);
  };

  const getTileColor = (val: number) => {
    switch (val) {
      case 2: return 'bg-slate-100 text-slate-700';
      case 4: return 'bg-orange-50 text-orange-700';
      case 8: return 'bg-orange-100 text-orange-800';
      case 16: return 'bg-orange-200 text-orange-900 text-[24px]';
      case 32: return 'bg-orange-300 text-white text-[24px]';
      case 64: return 'bg-orange-400 text-white text-[24px]';
      case 128: return 'bg-orange-500 text-white text-[20px]';
      case 256: return 'bg-orange-600 text-white text-[20px]';
      case 512: return 'bg-yellow-400 text-white text-[20px]';
      case 1024: return 'bg-yellow-500 text-white text-[16px]';
      case 2048: return 'bg-yellow-600 text-white text-[16px] shadow-[0_0_20px_rgba(202,138,4,0.4)]';
      default: return 'bg-slate-800 text-white';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 flex flex-col items-center">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">2048 经典智力挑战</h1>
            <p className="text-slate-500 mt-1 text-sm">简单数学逻辑，无穷乐趣体验。</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl px-6 py-2 shadow-sm text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SCORE</div>
            <div className="text-xl font-black text-slate-700 font-mono tracking-tighter">{score}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl px-6 py-2 shadow-sm text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BEST</div>
            <div className="text-xl font-black text-slate-700 font-mono tracking-tighter">{bestScore}</div>
          </div>
          <button 
            onClick={resetGame}
            className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-slate-700 transition-all shadow-lg active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative bg-slate-200/50 p-4 rounded-3xl border-4 border-slate-200/80 shadow-inner">
        <div className="grid grid-cols-4 gap-3 bg-slate-200 rounded-xl p-1 overflow-hidden" 
             style={{ width: 'min(90vw, 400px)', height: 'min(90vw, 400px)' }}>
          {grid.map((row, r) => row.map((val, c) => (
             <div key={`${r}-${c}`} className="relative bg-slate-300/50 rounded-lg w-full h-full flex items-center justify-center">
                {val !== 0 && (
                  <motion.div 
                    layoutId={`tile-${val}-${r}-${c}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`absolute inset-0 rounded-lg flex items-center justify-center font-black text-[28px] font-sans shadow-sm ${getTileColor(val)}`}
                  >
                    {val}
                  </motion.div>
                )}
             </div>
          )))}
        </div>

        <AnimatePresence>
          {gameOver && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center border-4 border-white shadow-2xl z-20"
            >
               <Trophy className="w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
               <h2 className="text-4xl font-black text-slate-900 mb-2 font-sans tracking-tight">GAME OVER</h2>
               <p className="text-slate-500 mb-8 font-bold">最终得分：{score}</p>
               <button 
                 onClick={resetGame}
                 className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:bg-slate-800 transition-all"
               >
                 重新开始
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full max-w-sm">
         <div className="hidden md:block"/>
         <button onClick={() => move('UP')} 
                 className="h-14 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 active:scale-95 transition-all text-slate-600">
           <ArrowUp className="w-6 h-6" />
         </button>
         <div className="hidden md:block"/>
         <div className="hidden md:block"/>
         
         <button onClick={() => move('LEFT')} 
                 className="h-14 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 active:scale-95 transition-all text-slate-600">
           <ArrowLeft className="w-6 h-6" />
         </button>
         <button onClick={() => move('DOWN')} 
                 className="h-14 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 active:scale-95 transition-all text-slate-600">
           <ArrowDown className="w-6 h-6" />
         </button>
         <button onClick={() => move('RIGHT')} 
                 className="h-14 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 active:scale-95 transition-all text-slate-600">
           <ArrowRight className="w-6 h-6" />
         </button>
      </div>

      <div className="bg-transparent border border-slate-200/60 rounded-2xl p-8 lg:p-12 mb-12 mt-12 bg-gradient-to-b from-white/50 to-transparent w-full">
        <h2 className="text-xl font-bold text-slate-800 mb-6">2048 游戏规则说明</h2>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
           <p><strong>玩法介绍：</strong> 使用键盘上的【方向键】或点击界面按钮移动所有方块。当两个相同数字的方块撞在一起时，它们会合并成它们的总和。</p>
           <p><strong>终极目标：</strong> 合并方块，直到拼凑出传奇的 <strong>2048</strong>！当然，大神们往往能挑战更极限的 4096 甚至更高。</p>
           <p><strong>技巧提示：</strong> 尽量将最大的数字保留在角落里（例如右下角），并保持该行列填满，这样可以避免最大的数字在移动中发生位移导致节奏混乱。</p>
        </div>
      </div>
    </div>
  );
};

export default Game2048;
