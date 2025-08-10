"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, Zap, Award, Star, Flame } from 'lucide-react';
import { cn } from '../../lib/utils';
export interface MotivationCardProps {
  metric?: string;
  remaining?: number;
  progress?: number;
  isVisible: boolean;
  onHide?: () => void;
  duration?: number;
}
const METRIC_LABELS: Record<string, string> = {
  voice: 'Voice',
  bts: 'BTS',
  tfb: 'TFB',
  p360: 'P360',
  acc: 'Accessories',
  devices: 'Devices',
  csat: 'CSAT'
};
const MOTIVATION_TEMPLATES = [
// Close to goal (remaining <= 2)
{
  condition: (remaining: number) => remaining <= 2 && remaining > 0,
  messages: ["🎯 Just {remaining} more {metric} to hit your goal!", "🔥 You're SO close! {remaining} {metric} left!", "⚡ Almost there! {remaining} more {metric}!", "🚀 Final push! {remaining} {metric} to victory!"]
},
// Medium progress (remaining 3-5)
{
  condition: (remaining: number) => remaining >= 3 && remaining <= 5,
  messages: ["💪 Keep pushing! {remaining} {metric} to go!", "🌟 Great momentum! {remaining} more {metric}!", "🎪 You've got this! {remaining} {metric} left!", "⭐ Steady progress! {remaining} more {metric}!"]
},
// Longer way to go (remaining > 5)
{
  condition: (remaining: number) => remaining > 5,
  messages: ["🎯 Every {metric} counts! {remaining} to go!", "💫 Building momentum! {remaining} {metric} left!", "🔥 One step at a time! {remaining} more {metric}!", "⚡ You're making progress! {remaining} {metric} remaining!"]
},
// Goal achieved
{
  condition: (remaining: number) => remaining === 0,
  messages: ["🎉 {metric} goal CRUSHED! Amazing work!", "🏆 {metric} target achieved! You're on fire!", "⭐ {metric} goal complete! Keep the streak!", "🚀 {metric} mission accomplished! Legendary!"]
},
// High progress (>80%)
{
  condition: (remaining: number, progress: number) => progress > 80 && remaining > 0,
  messages: ["🔥 {progress}% complete! You're crushing it!", "⚡ {progress}% done! Almost at the finish line!", "🌟 {progress}% achieved! Incredible progress!", "🎯 {progress}% there! Victory is in sight!"]
},
// General encouragement
{
  condition: () => true,
  messages: ["💪 Every action moves you forward!", "🌟 You're building something great!", "🔥 Consistency is your superpower!", "⚡ Progress over perfection!", "🎯 Focus and determination!", "🚀 You've got the momentum!"]
}];
const ICONS = [Target, TrendingUp, Zap, Award, Star, Flame];
export default function MotivationCard({
  metric = 'goal',
  remaining = 0,
  progress = 0,
  isVisible,
  onHide,
  duration = 3000
}: MotivationCardProps) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentIcon, setCurrentIcon] = useState<React.ComponentType<{
    className?: string;
  }>>(Target);
  useEffect(() => {
    if (isVisible) {
      // Find the first matching template
      const template = MOTIVATION_TEMPLATES.find(t => t.condition(remaining, progress));
      if (template) {
        const randomMessage = template.messages[Math.floor(Math.random() * template.messages.length)];

        // Replace placeholders
        const formattedMessage = randomMessage.replace(/{remaining}/g, remaining.toString()).replace(/{metric}/g, METRIC_LABELS[metric] || metric).replace(/{progress}/g, Math.round(progress).toString());
        setCurrentMessage(formattedMessage);
      }

      // Random icon
      setCurrentIcon(ICONS[Math.floor(Math.random() * ICONS.length)]);

      // Auto-hide after duration
      if (onHide && duration > 0) {
        const timer = setTimeout(onHide, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, metric, remaining, progress, onHide, duration]);
  const IconComponent = currentIcon;
  return <AnimatePresence data-magicpath-id="0" data-magicpath-path="MotivationCard.tsx">
      {isVisible && <motion.div className="fixed top-20 left-4 right-4 z-50 pointer-events-none" initial={{
      opacity: 0,
      y: -20,
      scale: 0.9
    }} animate={{
      opacity: 1,
      y: 0,
      scale: 1
    }} exit={{
      opacity: 0,
      y: -20,
      scale: 0.9
    }} transition={{
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.4
    }} data-magicpath-id="1" data-magicpath-path="MotivationCard.tsx">
          <div className="max-w-sm mx-auto" data-magicpath-id="2" data-magicpath-path="MotivationCard.tsx">
            <motion.div className={cn("bg-gradient-to-r from-[#E20074]/90 to-[#20074]/90 backdrop-blur-xl", "rounded-2xl border border-[#E20074]/30 shadow-2xl", "p-4 text-center pointer-events-auto")} initial={{
          scale: 0.8
        }} animate={{
          scale: 1
        }} transition={{
          delay: 0.1
        }} data-magicpath-id="3" data-magicpath-path="MotivationCard.tsx">
              <div className="flex items-center justify-center space-x-3" data-magicpath-id="4" data-magicpath-path="MotivationCard.tsx">
                <motion.div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center" initial={{
              rotate: -10
            }} animate={{
              rotate: 0
            }} transition={{
              delay: 0.2
            }} data-magicpath-id="5" data-magicpath-path="MotivationCard.tsx">
                  <IconComponent className="w-5 h-5 text-white" data-magicpath-id="6" data-magicpath-path="MotivationCard.tsx" />
                </motion.div>
                
                <motion.p className="text-white font-medium text-sm leading-relaxed flex-1" initial={{
              opacity: 0,
              x: 10
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: 0.3
            }} data-magicpath-id="7" data-magicpath-path="MotivationCard.tsx">
                  {currentMessage}
                </motion.p>
              </div>
              
              {/* Progress indicator */}
              {progress > 0 && <motion.div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden" initial={{
            scaleX: 0
          }} animate={{
            scaleX: 1
          }} transition={{
            delay: 0.4,
            duration: 0.3
          }} data-magicpath-id="8" data-magicpath-path="MotivationCard.tsx">
                  <motion.div className="h-full bg-white/60 rounded-full" initial={{
              width: 0
            }} animate={{
              width: `${Math.min(progress, 100)}%`
            }} transition={{
              delay: 0.5,
              duration: 0.6,
              ease: "easeOut"
            }} data-magicpath-id="9" data-magicpath-path="MotivationCard.tsx" />
                </motion.div>}
            </motion.div>
          </div>
        </motion.div>}
    </AnimatePresence>;
}