import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  leftLabel?: string;
  rightLabel?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'magenta' | 'glass';
  className?: string;
  mpid?: string;
}
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  leftLabel,
  rightLabel,
  disabled = false,
  size = 'md',
  variant = 'magenta',
  className = ''
}) => {
  const sizeClasses = {
    sm: {
      container: 'h-6 w-11',
      thumb: 'h-4 w-4',
      translate: 'translate-x-5',
      text: 'text-xs'
    },
    md: {
      container: 'h-7 w-12',
      thumb: 'h-5 w-5',
      translate: 'translate-x-5',
      text: 'text-sm'
    },
    lg: {
      container: 'h-8 w-14',
      thumb: 'h-6 w-6',
      translate: 'translate-x-6',
      text: 'text-base'
    }
  };
  const variantClasses = {
    default: {
      bg: checked ? 'bg-blue-600' : 'bg-gray-300',
      thumb: 'bg-white',
      shadow: 'shadow-md'
    },
    magenta: {
      bg: checked ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-600/50',
      thumb: 'bg-white',
      shadow: 'shadow-lg shadow-pink-500/25'
    },
    glass: {
      bg: checked ? 'bg-white/20 backdrop-blur-md' : 'bg-white/10 backdrop-blur-md',
      thumb: checked ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-white/80',
      shadow: 'shadow-lg shadow-black/25'
    }
  };
  const sizes = sizeClasses[size];
  const variants = variantClasses[variant];
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };
  return <div className={cn('flex items-center space-x-3', className)} data-magicpath-id="0" data-magicpath-path="ToggleSwitch.tsx">
      {leftLabel && <span className={cn(sizes.text, 'font-medium transition-colors duration-200', !checked ? 'text-white' : 'text-gray-400', disabled && 'opacity-50')} data-magicpath-id="1" data-magicpath-path="ToggleSwitch.tsx">
          {leftLabel}
        </span>}

      <button type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={handleToggle} className={cn('relative inline-flex items-center rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-transparent', sizes.container, variants.bg, variants.shadow, disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl', variant === 'glass' && 'border-white/20')} data-magicpath-id="2" data-magicpath-path="ToggleSwitch.tsx">
        <span className="sr-only" data-magicpath-id="3" data-magicpath-path="ToggleSwitch.tsx">
          {leftLabel && rightLabel ? `Switch between ${leftLabel} and ${rightLabel}` : 'Toggle switch'}
        </span>
        
        <motion.span className={cn('inline-block rounded-full transition-all duration-300 ease-in-out', sizes.thumb, variants.thumb, variants.shadow)} animate={{
        x: checked ? sizes.translate.replace('translate-x-', '') : '0'
      }} transition={{
        type: "spring",
        stiffness: 500,
        damping: 30
      }} style={{
        filter: variant === 'magenta' && checked ? 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.5))' : undefined
      }} data-magicpath-id="4" data-magicpath-path="ToggleSwitch.tsx" />

        {/* Glow effect for active state */}
        {checked && variant === 'magenta' && <motion.div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-30" initial={{
        scale: 1
      }} animate={{
        scale: [1, 1.1, 1]
      }} transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }} data-magicpath-id="5" data-magicpath-path="ToggleSwitch.tsx" />}
      </button>

      {rightLabel && <span className={cn(sizes.text, 'font-medium transition-colors duration-200', checked ? 'text-white' : 'text-gray-400', disabled && 'opacity-50')} data-magicpath-id="6" data-magicpath-path="ToggleSwitch.tsx">
          {rightLabel}
        </span>}
    </div>;
};
export default ToggleSwitch;