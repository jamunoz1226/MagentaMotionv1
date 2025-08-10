"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
export interface CounterRowProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  onInc: () => void;
  onDec: () => void;
  target?: number;
  remaining?: number;
  accent?: 'green' | 'orange' | 'blue';
}
export default function CounterRow({
  icon,
  label,
  value,
  onInc,
  onDec,
  target,
  remaining,
  accent = 'blue'
}: CounterRowProps) {
  const isGoalMet = target && value >= target;
  const progressPct = target ? Math.min(value / target * 100, 100) : 0;
  const accentColors = {
    green: 'text-green-400 bg-green-400/10',
    orange: 'text-orange-400 bg-orange-400/10',
    blue: 'text-blue-400 bg-blue-400/10'
  };
  const progressColors = {
    green: 'from-green-500 to-green-400',
    orange: 'from-orange-500 to-orange-400',
    blue: 'from-blue-500 to-blue-400'
  };
  return <div className="counter-row flex items-center justify-between min-h-[56px] p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm">
      {/* Left side - Icon, Label, Progress */}
      <div className="flex items-center space-x-3 flex-1">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", accentColors[accent])}>
          {icon}
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium text-sm">{label}</span>
            {isGoalMet && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
          </div>
          
          {target && <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-400">
                {value} / {target}
              </span>
              {remaining !== undefined && remaining > 0 && <span className="text-xs px-2 py-0.5 bg-gray-700/50 rounded-full text-gray-300">
                  {remaining} left
                </span>}
            </div>}
          
          {/* Progress pill */}
          {target && <div className="w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden mt-2">
              <motion.div className={cn("h-full bg-gradient-to-r rounded-full", progressColors[accent])} initial={{
            width: 0
          }} animate={{
            width: `${progressPct}%`
          }} transition={{
            duration: 0.3,
            ease: "easeOut"
          }} />
            </div>}
        </div>
      </div>

      {/* Right side - Counter controls */}
      <div className="flex items-center space-x-3 ml-4">
        <motion.button onClick={onDec} className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg flex items-center justify-center transition-colors border border-gray-600/50" whileTap={{
        scale: 0.95
      }} whileHover={{
        scale: 1.05
      }}>
          <Minus className="w-4 h-4 text-gray-300" />
        </motion.button>
        
        <div className="min-w-[3rem] text-center">
          <motion.span key={value} className="text-xl font-bold text-white" initial={{
          scale: 1.2,
          opacity: 0.8
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          duration: 0.2
        }}>
            {value}
          </motion.span>
        </div>
        
        <motion.button onClick={onInc} className="w-10 h-10 bg-[#E20074] hover:bg-[#C21E68] rounded-lg flex items-center justify-center transition-colors shadow-lg" whileTap={{
        scale: 0.95
      }} whileHover={{
        scale: 1.05
      }}>
          <Plus className="w-4 h-4 text-white" />
        </motion.button>
      </div>
    </div>;
}