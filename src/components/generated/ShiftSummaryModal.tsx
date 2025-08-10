"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, TrendingUp, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import MatteCard from './GlassCard';
interface ShiftSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalActivations: number;
  totalIncremental: number;
  averageSurveyScore: number;
  shiftHours?: number | null;
}
export default function ShiftSummaryModal({
  isOpen,
  onClose,
  totalActivations,
  totalIncremental,
  averageSurveyScore,
  shiftHours
}: ShiftSummaryModalProps) {
  if (!isOpen) return null;
  const motivationalMessages = ["Fantastic work today! Keep the momentum going tomorrow.", "Outstanding performance! You're crushing your goals.", "Amazing effort today! Tomorrow is another opportunity to excel.", "Incredible dedication! Your hard work is paying off.", "Stellar performance! You're setting the bar high.", "Exceptional work today! Keep up the fantastic energy."];
  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  return <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} />
        
        {/* Modal */}
        <motion.div className="relative w-full max-w-md" initial={{
        opacity: 0,
        scale: 0.9,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.9,
        y: 20
      }} transition={{
        type: "spring",
        duration: 0.5
      }}>
          <MatteCard className="p-6" variant="primary">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E20074] to-[#20074] flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-display text-white">Shift Complete!</h2>
                  <p className="text-sm text-gray-400">Great work today</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Summary Stats */}
            <div className="space-y-4 mb-6">
              {/* Shift Hours */}
              {shiftHours && <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-white font-medium">Shift Hours</span>
                  </div>
                  <span className="text-xl font-bold text-white">{shiftHours}</span>
                </div>}

              {/* Total Activations */}
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-white font-medium">Total Activations</span>
                </div>
                <span className="text-xl font-bold text-green-400">{totalActivations}</span>
              </div>

              {/* Total Incremental */}
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-white font-medium">Total Incremental</span>
                </div>
                <span className="text-xl font-bold text-blue-400">{totalIncremental}</span>
              </div>

              {/* Average Survey Score */}
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-white font-medium">Average Survey Score</span>
                </div>
                <span className="text-xl font-bold text-yellow-400">
                  {averageSurveyScore > 0 ? averageSurveyScore.toFixed(1) : '—'}
                </span>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="p-4 bg-gradient-to-r from-[#E20074]/10 to-[#20074]/10 rounded-lg border border-[#E20074]/20 mb-6">
              <p className="text-white text-center font-medium leading-relaxed">
                {randomMessage}
              </p>
            </div>

            {/* Close Button */}
            <button onClick={onClose} className="w-full py-3 bg-gradient-to-r from-[#E20074] to-[#20074] hover:from-[#C21E68] hover:to-[#1A0660] rounded-xl text-white font-medium transition-all shadow-lg">
              Close
            </button>
          </MatteCard>
        </motion.div>
      </div>
    </AnimatePresence>;
}