import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
interface MatteCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  elevation?: 'low' | 'medium' | 'high';
  border?: boolean;
  hover?: boolean;
  onClick?: () => void;
  animate?: boolean;
  mpid?: string;
}
const MatteCard: React.FC<MatteCardProps> = ({
  children,
  className = '',
  variant = 'primary',
  elevation = 'medium',
  border = true,
  hover = false,
  onClick,
  animate = true
}) => {
  const variantClasses = {
    primary: 'bg-gray-900/95',
    secondary: 'bg-gray-800/90',
    accent: 'bg-gradient-to-br from-gray-900/95 to-gray-800/95'
  };
  const elevationClasses = {
    low: 'shadow-sm shadow-black/20',
    medium: 'shadow-lg shadow-black/40',
    high: 'shadow-xl shadow-black/60'
  };
  const baseClasses = cn('relative overflow-hidden rounded-2xl', variantClasses[variant], elevationClasses[elevation], border && 'border border-gray-700/50', hover && 'hover:bg-gray-800/95 transition-all duration-300 hover:shadow-xl hover:shadow-black/50 hover:border-gray-600/60', onClick && 'cursor-pointer', className);
  const cardContent = <div className={baseClasses} onClick={onClick} data-magicpath-id="0" data-magicpath-path="GlassCard.tsx">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-black/[0.02] pointer-events-none" data-magicpath-id="1" data-magicpath-path="GlassCard.tsx" />
      
      {/* Matte finish highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" data-magicpath-id="2" data-magicpath-path="GlassCard.tsx" />
      
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
export default MatteCard;