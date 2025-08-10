"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Delete } from 'lucide-react';
import { cn } from '../../lib/utils';
export interface KeypadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (score: number) => void;
  currentCsatAvg: number;
  currentCsatCount: number;
  title?: string;
}
export default function KeypadModal({
  isOpen,
  onClose,
  onSubmit,
  currentCsatAvg,
  currentCsatCount,
  title = "Add CSAT Score"
}: KeypadModalProps) {
  const [input, setInput] = useState('');
  const [previewAvg, setPreviewAvg] = useState(currentCsatAvg);

  // Update preview when input changes
  useEffect(() => {
    const score = parseFloat(input);
    if (!isNaN(score) && score >= 1 && score <= 5) {
      const newTotal = currentCsatAvg * currentCsatCount + score;
      const newCount = currentCsatCount + 1;
      setPreviewAvg(newTotal / newCount);
    } else {
      setPreviewAvg(currentCsatAvg);
    }
  }, [input, currentCsatAvg, currentCsatCount]);
  const handleNumberPress = (num: string) => {
    if (input.length < 3) {
      // Limit to 3 characters (e.g., "5.0")
      setInput(prev => prev + num);
    }
  };
  const handleDecimalPress = () => {
    if (!input.includes('.') && input.length > 0) {
      setInput(prev => prev + '.');
    }
  };
  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1));
  };
  const handleClear = () => {
    setInput('');
  };
  const handleSubmit = () => {
    const score = parseFloat(input);
    if (!isNaN(score) && score >= 1 && score <= 5) {
      onSubmit(score);
      setInput('');
      onClose();
    }
  };
  const isValidScore = () => {
    const score = parseFloat(input);
    return !isNaN(score) && score >= 1 && score <= 5;
  };
  const keypadNumbers = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['.', '0', '⌫']];
  return <AnimatePresence data-magicpath-id="0" data-magicpath-path="KeypadModal.tsx">
      {isOpen && <>
          {/* Backdrop */}
          <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} data-magicpath-id="1" data-magicpath-path="KeypadModal.tsx" />

          {/* Modal */}
          <motion.div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto" initial={{
        opacity: 0,
        scale: 0.9,
        y: -20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.9,
        y: -20
      }} transition={{
        type: "spring",
        damping: 25,
        stiffness: 300
      }} data-magicpath-id="2" data-magicpath-path="KeypadModal.tsx">
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden" data-magicpath-id="3" data-magicpath-path="KeypadModal.tsx">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700/50" data-magicpath-id="4" data-magicpath-path="KeypadModal.tsx">
                <h3 className="text-lg font-semibold text-white" data-magicpath-id="5" data-magicpath-path="KeypadModal.tsx">{title}</h3>
                <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center transition-colors" data-magicpath-id="6" data-magicpath-path="KeypadModal.tsx">
                  <X className="w-4 h-4 text-gray-400" data-magicpath-id="7" data-magicpath-path="KeypadModal.tsx" />
                </button>
              </div>

              {/* Display & Preview */}
              <div className="p-4 space-y-3" data-magicpath-id="8" data-magicpath-path="KeypadModal.tsx">
                {/* Input Display */}
                <div className="bg-gray-800/50 rounded-xl p-4 text-center" data-magicpath-id="9" data-magicpath-path="KeypadModal.tsx">
                  <div className="text-2xl font-bold text-white mb-1" data-magicpath-id="10" data-magicpath-path="KeypadModal.tsx">
                    {input || '0'}
                  </div>
                  <div className="text-xs text-gray-400" data-magicpath-id="11" data-magicpath-path="KeypadModal.tsx">
                    Score (1.0 - 5.0)
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gradient-to-r from-[#E20074]/10 to-[#20074]/10 rounded-xl p-3 border border-[#E20074]/20" data-magicpath-id="12" data-magicpath-path="KeypadModal.tsx">
                  <div className="flex items-center justify-between text-sm" data-magicpath-id="13" data-magicpath-path="KeypadModal.tsx">
                    <span className="text-gray-300" data-magicpath-id="14" data-magicpath-path="KeypadModal.tsx">New Average:</span>
                    <span className="text-white font-semibold" data-magicpath-id="15" data-magicpath-path="KeypadModal.tsx">
                      {previewAvg.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-1" data-magicpath-id="16" data-magicpath-path="KeypadModal.tsx">
                    <span data-magicpath-id="17" data-magicpath-path="KeypadModal.tsx">Total Responses:</span>
                    <span data-magicpath-id="18" data-magicpath-path="KeypadModal.tsx">{currentCsatCount + (isValidScore() ? 1 : 0)}</span>
                  </div>
                </div>
              </div>

              {/* Keypad */}
              <div className="p-4" data-magicpath-id="19" data-magicpath-path="KeypadModal.tsx">
                <div className="grid grid-cols-3 gap-3" data-magicpath-id="20" data-magicpath-path="KeypadModal.tsx">
                  {keypadNumbers.flat().map((key, index) => <motion.button key={index} className={cn("h-12 rounded-xl font-semibold text-lg transition-colors", key === '⌫' ? "bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30" : key === '.' ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-600/50" : "bg-gray-800/50 hover:bg-gray-700/50 text-white border border-gray-700/50")} whileTap={{
                scale: 0.95
              }} onClick={() => {
                if (key === '⌫') {
                  handleBackspace();
                } else if (key === '.') {
                  handleDecimalPress();
                } else {
                  handleNumberPress(key);
                }
              }} data-magicpath-id="21" data-magicpath-path="KeypadModal.tsx">
                      {key === '⌫' ? <Delete className="w-5 h-5 mx-auto" data-magicpath-id="22" data-magicpath-path="KeypadModal.tsx" /> : key}
                    </motion.button>)}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 pt-0 flex space-x-3" data-magicpath-id="23" data-magicpath-path="KeypadModal.tsx">
                <button onClick={handleClear} className="flex-1 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl text-gray-300 font-medium transition-colors" data-magicpath-id="24" data-magicpath-path="KeypadModal.tsx">
                  Clear
                </button>
                <button onClick={handleSubmit} disabled={!isValidScore()} className={cn("flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2", isValidScore() ? "bg-gradient-to-r from-[#E20074] to-[#20074] hover:from-[#C21E68] hover:to-[#1A0660] text-white shadow-lg" : "bg-gray-700/30 text-gray-500 cursor-not-allowed")} data-magicpath-id="25" data-magicpath-path="KeypadModal.tsx">
                  <Check className="w-4 h-4" data-magicpath-id="26" data-magicpath-path="KeypadModal.tsx" />
                  <span data-magicpath-id="27" data-magicpath-path="KeypadModal.tsx">Add Score</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}