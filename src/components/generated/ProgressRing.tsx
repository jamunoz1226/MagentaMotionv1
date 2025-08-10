import React from 'react';
import { motion } from 'framer-motion';
interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  status?: 'excellent' | 'good' | 'needs-improvement';
  showPercentage?: boolean;
  animate?: boolean;
  className?: string;
}
const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 80,
  strokeWidth = 6,
  status = 'good',
  showPercentage = true,
  animate = true,
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - percentage / 100 * circumference;

  // Color mapping based on status
  const statusColors = {
    excellent: {
      stroke: '#10B981',
      // Green-500
      glow: '#10B981',
      text: '#10B981'
    },
    good: {
      stroke: '#F59E0B',
      // Amber-500
      glow: '#F59E0B',
      text: '#F59E0B'
    },
    'needs-improvement': {
      stroke: '#EF4444',
      // Red-500
      glow: '#EF4444',
      text: '#EF4444'
    }
  };
  const colors = statusColors[status];
  return <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90" style={{
      filter: `drop-shadow(0 0 6px ${colors.glow}40)`
    }}>
        {/* Background circle */}
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255, 255, 255, 0.1)" strokeWidth={strokeWidth} fill="transparent" />
        
        {/* Progress circle */}
        <motion.circle cx={size / 2} cy={size / 2} r={radius} stroke={colors.stroke} strokeWidth={strokeWidth} fill="transparent" strokeLinecap="round" strokeDasharray={strokeDasharray} strokeDashoffset={animate ? circumference : strokeDashoffset} animate={animate ? {
        strokeDashoffset
      } : undefined} transition={animate ? {
        duration: 1.5,
        ease: "easeInOut",
        delay: 0.2
      } : undefined} style={{
        filter: `drop-shadow(0 0 4px ${colors.glow}60)`
      }} />
        
        {/* Inner glow effect */}
        <motion.circle cx={size / 2} cy={size / 2} r={radius - strokeWidth / 2} stroke={colors.stroke} strokeWidth={1} fill="transparent" opacity={0.3} strokeDasharray={strokeDasharray} strokeDashoffset={animate ? circumference : strokeDashoffset} animate={animate ? {
        strokeDashoffset
      } : undefined} transition={animate ? {
        duration: 1.5,
        ease: "easeInOut",
        delay: 0.2
      } : undefined} />
      </svg>
      
      {/* Percentage text */}
      {showPercentage && <motion.div className="absolute inset-0 flex items-center justify-center" initial={animate ? {
      opacity: 0,
      scale: 0.5
    } : undefined} animate={animate ? {
      opacity: 1,
      scale: 1
    } : undefined} transition={animate ? {
      duration: 0.5,
      delay: 0.8,
      ease: "easeOut"
    } : undefined}>
          <span className="text-sm font-bold" style={{
        color: colors.text
      }}>
            {Math.round(percentage)}%
          </span>
        </motion.div>}
      
      {/* Pulsing dot at the end of progress */}
      {percentage > 0 && <motion.div className="absolute" style={{
      left: size / 2 + radius * Math.cos(percentage / 100 * 2 * Math.PI - Math.PI / 2) - 3,
      top: size / 2 + radius * Math.sin(percentage / 100 * 2 * Math.PI - Math.PI / 2) - 3
    }} initial={animate ? {
      scale: 0,
      opacity: 0
    } : undefined} animate={animate ? {
      scale: 1,
      opacity: 1
    } : undefined} transition={animate ? {
      duration: 0.3,
      delay: 1.2,
      ease: "easeOut"
    } : undefined}>
          <motion.div className="w-2 h-2 rounded-full" style={{
        backgroundColor: colors.stroke
      }} animate={animate ? {
        scale: [1, 1.3, 1],
        opacity: [1, 0.7, 1]
      } : undefined} transition={animate ? {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      } : undefined} />
        </motion.div>}
    </div>;
};
export default ProgressRing;