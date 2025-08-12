"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, Zap, Award, Star, Flame, Pin } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAutoDismiss } from '../../hooks/useAutoDismiss';
import { zIndex } from '../../settings/z';
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
  const [pinned, setPinned] = useState(false);
  const [docked, setDocked] = useState(false);
  const [interactive, setInteractive] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-dismiss between 5-7s when visible and not pinned
  const { start, cancel, onMouseEnter, onMouseLeave } = useAutoDismiss(() => {
    if (!pinned) onHide?.();
  }, { minMs: 5000, maxMs: 7000, pauseOnHover: true, enabled: isVisible && !pinned });
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
      // Start auto-dismiss if allowed
      start();
    }
    return () => cancel();
  }, [isVisible, metric, remaining, progress]);

  // Dismiss on ESC and outside click
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (pinned) {
          setDocked(true);
          setInteractive(false);
        } else {
          onHide?.();
        }
      }
    }
    function onPointerDown(e: MouseEvent) {
      const el = containerRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) {
        if (pinned) {
          setDocked(true);
          setInteractive(false);
        } else {
          onHide?.();
        }
      }
    }
    if (isVisible) {
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('mousedown', onPointerDown);
      return () => {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('mousedown', onPointerDown);
      };
    }
  }, [isVisible, pinned]);

  // Dock or hide on chart interaction
  useEffect(() => {
    function onChart() {
      if (!isVisible) return;
      if (pinned) {
        setDocked(true);
        setInteractive(false);
      } else {
        onHide?.();
      }
    }
    window.addEventListener('chart-interaction', onChart as EventListener);
    return () => window.removeEventListener('chart-interaction', onChart as EventListener);
  }, [isVisible, pinned]);

  // Respond to line detail opening explicitly
  useEffect(() => {
    function onDetailOpen() {
      if (!isVisible) return;
      if (pinned) {
        setDocked(true);
        setInteractive(false);
      } else {
        onHide?.();
      }
    }
    window.addEventListener('line-detail-open', onDetailOpen as EventListener);
    return () => window.removeEventListener('line-detail-open', onDetailOpen as EventListener);
  }, [isVisible, pinned]);

  // Focus management: remember previous focus and restore when hidden
  const prevFocusRef = useRef<Element | null>(null);
  useEffect(() => {
    if (isVisible) {
      prevFocusRef.current = document.activeElement;
    } else {
      const el = prevFocusRef.current as HTMLElement | null;
      if (el && typeof el.focus === 'function') {
        try { el.focus(); } catch {}
      }
    }
  }, [isVisible]);

  // When docked, inner content blocks clicks only when interactive
  const innerPointerEvents = docked && !interactive ? 'none' : 'auto';

  const handleMouseEnter = () => {
    onMouseEnter();
    if (docked && !interactive) setInteractive(true);
  };
  const handleMouseLeave = () => {
    onMouseLeave();
    if (docked && interactive) setInteractive(false);
  };

  const togglePin = () => {
    const next = !pinned;
    setPinned(next);
    if (next) {
      setDocked(true);
      setInteractive(false);
    } else {
      setDocked(false);
      setInteractive(true);
    }
  };
  const IconComponent = currentIcon;
  const isDocked = isVisible && docked;
  const isFloating = isVisible && !docked;

  return (
    <AnimatePresence>
      {isFloating && (
        <motion.div
          ref={containerRef}
          className="fixed top-20 left-4 right-4 pointer-events-none"
          style={{ zIndex: zIndex.banner }}
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-live="polite"
          role="status"
        >
          <div className="max-w-sm mx-auto">
            <motion.div
              className={cn(
                "bg-gradient-to-r from-[#E20074]/90 to-[#20074]/90 backdrop-blur-xl",
                "rounded-2xl border border-[#E20074]/30 shadow-2xl",
                "p-3 text-center pointer-events-none"
              )}
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
            >
              <div className="flex items-center gap-2">
                <motion.div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center" initial={{ rotate: -8 }} animate={{ rotate: 0 }}>
                  <IconComponent className="w-4 h-4 text-white" />
                </motion.div>
                <motion.p className="text-white font-medium text-sm leading-relaxed flex-1" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
                  {currentMessage}
                </motion.p>
                <button
                  aria-pressed={pinned}
                  aria-label={pinned ? 'Unpin motivation' : 'Pin motivation'}
                  onClick={togglePin}
                  className={cn("p-1 rounded-md text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40", pinned && 'bg-white/10')}
                  style={{ pointerEvents: 'auto' }}
                >
                  <Pin className="w-4 h-4" />
                </button>
              </div>
              {progress > 0 && (
                <motion.div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}>
                  <motion.div className="h-full bg-white/60 rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.min(progress, 100)}%` }} transition={{ duration: 0.4 }} />
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}

      {isDocked && (
        <motion.div
          ref={containerRef}
          className="fixed"
          style={{
            bottom: 84, // safe above bottom nav (~64) + margin
            right: 12,
            zIndex: zIndex.banner,
            width: 360,
            maxWidth: '90vw',
            // Container must receive hover to restore interactivity
            pointerEvents: 'auto',
          }}
          initial={{ opacity: 0.85, scale: 0.98 }}
          animate={{ opacity: 0.85, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-live="polite"
          role="status"
        >
          <motion.div
            className={cn(
              "bg-gradient-to-r from-[#E20074]/90 to-[#20074]/90 backdrop-blur-xl",
              "rounded-2xl border border-[#E20074]/30 shadow-2xl",
              "p-3 text-left"
            )}
            style={{ pointerEvents: innerPointerEvents as any }}
          >
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white/95 text-sm leading-snug">{currentMessage}</p>
                {pinned && (
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/80">
                    <Pin className="w-3 h-3" /> pinned
                  </span>
                )}
              </div>
              <button
                aria-pressed={pinned}
                aria-label={pinned ? 'Unpin motivation' : 'Pin motivation'}
                onClick={togglePin}
                className={cn("p-1 rounded-md text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40", pinned && 'bg-white/10')}
                style={{ pointerEvents: 'auto' }}
              >
                <Pin className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}