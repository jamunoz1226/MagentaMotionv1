import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
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
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
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
  const handleCardClick = () => {
    if (hover) {
      setIsOverlayOpen(true);
    }
    onClick?.();
  };
  const cardContent = <div className={baseClasses} onClick={handleCardClick}>
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-black/[0.02] pointer-events-none" />
      
      {/* Matte finish highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Full Screen Overlay */}
      <AnimatePresence>
        {isOverlayOpen && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.3
      }} className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => {
        if (e.target === e.currentTarget) {
          setIsOverlayOpen(false);
        }
      }}>
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} transition={{
          duration: 0.3,
          ease: "easeOut"
        }} className={cn("relative max-w-4xl max-h-[90vh] overflow-auto", baseClasses)} onClick={e => e.stopPropagation()}>
              {/* Close Button */}
              <button onClick={() => setIsOverlayOpen(false)} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-200 text-gray-300 hover:text-white" aria-label="Close overlay">
                <X size={20} />
              </button>

              {/* Overlay Content */}
              <div className="relative z-10">
                {children}
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
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
    } : undefined}>
        {cardContent}
      </motion.div>;
  }
  return cardContent;
};
export default MatteCard;