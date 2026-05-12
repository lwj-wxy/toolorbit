import React, { useState, useEffect, useCallback } from 'react';
import { Bomb, Flag, RefreshCw, Trophy, AlertTriangle, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

const DIFFICULTY = {
  BEGINNER: { rows: 9, cols: 9, mines: 12 },
  INTERMEDIATE: { rows: 16, cols: 16, mines: 45 },
};

export default function Minesweeper() {
  const [difficulty, setDifficulty] = useState(DIFFICULTY.BEGINNER);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');
  const [mineCount, setMineCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);

  const initGrid = useCallback(() => {
    const { rows, cols } = difficulty;
    const newGrid: Cell[][] = Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    );
    setGrid(newGrid);
    setGameState('PLAYING');
    setMineCount(difficulty.mines);
    setTimer(0);
    setIsFirstClick(true);
  }, [difficulty]);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  useEffect(() => {
    let interval: any;
    if (gameState === 'PLAYING' && timer < 999) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timer]);

  const placeMines = (startRow: number, startCol: number, currentGrid: Cell[][]) => {
    const { rows, cols, mines } = difficulty;
    let minesPlaced = 0;
    
    // 1. 随机布雷
    while (minesPlaced < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      
      // 绝对保证第一步点击的位置不是雷
      if (!currentGrid[r][c].isMine && (r !== startRow || c !== startCol)) {
        currentGrid[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // 2. 预计算每个格子的周围雷数 (只有这一步准确，数字才对)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!currentGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && currentGrid[nr][nc].isMine) {
                count++;
              }
            }
          }
          currentGrid[r][c].neighborMines = count;
        }
      }
    }
  };

  const revealCell = (r: number, c: number) => {
    if (gameState !== 'PLAYING' || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    let newGrid = grid.map(row => row.map(cell => ({ ...cell })));

    if (isFirstClick) {
      placeMines(r, c, newGrid);
      setIsFirstClick(false);
    }

    if (newGrid[r][c].isMine) {
      revealAllMines(newGrid);
      setGameState('LOST');
    } else {
      floodReveal(r, c, newGrid);
      if (checkWin(newGrid)) {
        setGameState('WON');
      }
    }
    setGrid(newGrid);
  };

  const floodReveal = (r: number, c: number, currentGrid: Cell[][]) => {
    const { rows, cols } = difficulty;
    if (r < 0 || r >= rows || c < 0 || c >= cols || currentGrid[r][c].isRevealed || currentGrid[r][c].isFlagged) return;

    currentGrid[r][c].isRevealed = true;

    if (currentGrid[r][c].neighborMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          floodReveal(r + dr, c + dc, currentGrid);
        }
      }
    }
  };

  const revealAllMines = (currentGrid: Cell[][]) => {
    currentGrid.forEach(row => row.forEach(cell => {
      if (cell.isMine) cell.isRevealed = true;
    }));
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState !== 'PLAYING' || grid[r][c].isRevealed) return;

    const newGrid = [...grid.map(row => [...row])];
    const cell = newGrid[r][c];
    cell.isFlagged = !cell.isFlagged;
    setMineCount(prev => cell.isFlagged ? prev - 1 : prev + 1);
    setGrid(newGrid);
  };

  const checkWin = (currentGrid: Cell[][]) => {
    return currentGrid.every(row => row.every(cell => 
      cell.isMine ? !cell.isRevealed : cell.isRevealed
    ));
  };

  const getTileColor = (count: number) => {
    const colors = [
      '', 'text-blue-600', 'text-emerald-600', 'text-rose-600', 
      'text-indigo-800', 'text-amber-800', 'text-cyan-700', 'text-slate-900', 'text-slate-400'
    ];
    return colors[count] || '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 flex flex-col items-center">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
              <Bomb className="w-6 h-6" />
           </div>
           <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">经典扫雷 (Minesweeper)</h1>
              <p className="text-slate-500 mt-1 text-sm font-medium">致敬经典，挑战你的逻辑思维极限。</p>
           </div>
        </div>

        <div className="flex gap-2">
           <button 
             onClick={() => setDifficulty(DIFFICULTY.BEGINNER)}
             className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${difficulty === DIFFICULTY.BEGINNER ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
           >
             初级
           </button>
           <button 
             onClick={() => setDifficulty(DIFFICULTY.INTERMEDIATE)}
             className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${difficulty === DIFFICULTY.INTERMEDIATE ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
           >
             中级
           </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6 flex flex-col items-center">
         {/* Status Header */}
         <div className="w-full bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100 px-8">
            <div className="flex flex-col items-center">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">剩余地雷</span>
               <span className="text-2xl font-black text-rose-500 font-mono tracking-tighter">
                  {Math.max(0, mineCount).toString().padStart(3, '0')}
               </span>
            </div>
            
            <button 
              onClick={initGrid}
              className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
            >
               {gameState === 'WON' ? <Trophy className="w-6 h-6 text-yellow-500" /> : gameState === 'LOST' ? <AlertTriangle className="w-6 h-6 text-rose-500" /> : <RefreshCw className="w-5 h-5 text-slate-400" />}
            </button>

            <div className="flex flex-col items-center">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">用时 (秒)</span>
               <span className="text-2xl font-black text-slate-700 font-mono tracking-tighter">
                  {timer.toString().padStart(3, '0')}
               </span>
            </div>
         </div>

         {/* Game Board */}
         <div 
           className="grid gap-1 bg-slate-200 p-1.5 rounded-xl select-none"
           style={{ 
             gridTemplateColumns: `repeat(${difficulty.cols}, minmax(0, 1fr))`,
             width: difficulty === DIFFICULTY.BEGINNER ? 'min(90vw, 360px)' : 'min(90vw, 560px)'
           }}
         >
            {grid.map((row, r) => row.map((cell, c) => (
               <div 
                 key={`${r}-${c}`}
                 onClick={() => revealCell(r, c)}
                 onContextMenu={(e) => toggleFlag(e, r, c)}
                 className={`
                    aspect-square rounded-sm flex items-center justify-center text-lg font-black cursor-pointer transition-all duration-75
                    ${cell.isRevealed 
                      ? 'bg-white shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] border border-slate-100' 
                      : 'bg-slate-300 border-t-2 border-l-2 border-white/60 border-r-2 border-b-2 border-slate-400 hover:bg-slate-200 active:bg-slate-300'}
                 `}
               >
                  <AnimatePresence>
                     {cell.isRevealed ? (
                        <motion.span 
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={cell.isMine ? 'text-rose-600' : getTileColor(cell.neighborMines)}
                        >
                           {cell.isMine ? <Bomb size={18} fill="currentColor" fillOpacity={0.2} /> : cell.neighborMines > 0 ? cell.neighborMines : ''}
                        </motion.span>
                     ) : cell.isFlagged && (
                        <motion.span 
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          className="text-rose-500"
                        >
                           <Flag size={16} fill="currentColor" />
                        </motion.span>
                     )}
                  </AnimatePresence>
               </div>
            )))}
         </div>

         <div className="flex items-center gap-6 text-slate-400 text-xs font-bold">
            <div className="flex items-center gap-2">
               <MousePointer2 size={14} className="text-slate-300" /> 左键：揭开
            </div>
            <div className="flex items-center gap-2">
               <Flag size={14} className="text-rose-400" /> 右键：插旗
            </div>
         </div>

         <AnimatePresence>
            {gameState !== 'PLAYING' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full p-4 rounded-2xl text-center font-bold text-sm ${gameState === 'WON' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}
              >
                 {gameState === 'WON' ? '卓越！你成功清除了所有地雷！' : '哎呀，不小心踩到地雷了...'}
              </motion.div>
            )}
         </AnimatePresence>
      </div>

      <div className="bg-transparent border border-slate-200/60 rounded-2xl p-8 lg:p-12 mb-12 mt-12 bg-gradient-to-b from-white/50 to-transparent w-full">
        <h2 className="text-xl font-bold text-slate-800 mb-6">扫雷战术指南</h2>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p><strong>基础逻辑：</strong> 数字表示该格子周围 8 个邻域格中埋藏的地雷总数。利用该信息排除安全区域。</p>
          <p><strong>致胜法则：</strong> 推导出百分之百确定的雷点并用右键标记。一旦所有非雷区都被揭开，即告胜利。 </p>
          <p><strong>第一步必安：</strong> 我们对算法进行了优化，您的首次点击绝对不会踩到地雷，并且会保证为您揭开一个基础的空旷区域。 </p>
        </div>
      </div>
    </div>
  );
}
