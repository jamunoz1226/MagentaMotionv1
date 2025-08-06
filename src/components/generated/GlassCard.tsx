import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: 'low' | 'medium' | 'high';
  border?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
  animate?: boolean;
  mpid?: string;
}
const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  blur = 'md',
  opacity = 'medium',
  border = true,
  shadow = 'lg',
  hover = false,
  onClick,
  animate = true
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };
  const opacityClasses = {
    low: 'bg-white/5',
    medium: 'bg-white/10',
    high: 'bg-white/15'
  };
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg shadow-black/25',
    xl: 'shadow-xl shadow-black/30'
  };
  const baseClasses = cn('relative overflow-hidden rounded-xl', blurClasses[blur], opacityClasses[opacity], shadowClasses[shadow], border && 'border border-white/10', hover && 'hover:bg-white/20 transition-all duration-300 hover:shadow-xl', onClick && 'cursor-pointer', className);
  const cardContent = <div className={baseClasses} onClick={onClick} data-magicpath-id="0" data-magicpath-path="GlassCard.tsx">
      {/* Gradient overlay for extra depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-gray-900/10 pointer-events-none" data-magicpath-id="1" data-magicpath-path="GlassCard.tsx" />
      
      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 pointer-events-none" data-magicpath-id="2" data-magicpath-path="GlassCard.tsx" />
      
      {/* Content */}
      <div className="relative z-10" data-magicpath-id="3" data-magicpath-path="GlassCard.tsx">
        {children}
      </div>
    </div>;
  if (animate) {
    return <motion.div initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3,
      ease: 'easeOut'
    }} whileHover={hover ? {
      scale: 1.02,
      y: -2
    } : undefined} whileTap={onClick ? {
      scale: 0.98
    } : undefined} data-magicpath-id="4" data-magicpath-path="GlassCard.tsx">
        {cardContent}
      </motion.div>;
  }
  return cardContent;
};
export default GlassCard;