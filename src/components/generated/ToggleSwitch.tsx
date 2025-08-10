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
  className?: string;
}
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  leftLabel,
  rightLabel,
  disabled = false,
  size = 'md',
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
  const sizes = sizeClasses[size];
  return <div className={cn('flex items-center space-x-3', className)} data-magicpath-id="0" data-magicpath-path="ToggleSwitch.tsx">
      {leftLabel && <span className={cn('font-medium transition-colors duration-200', sizes.text, !checked ? 'text-white' : 'text-gray-400')} data-magicpath-id="1" data-magicpath-path="ToggleSwitch.tsx">
          {leftLabel}
        </span>}
      
      <button type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={() => !disabled && onChange(!checked)} className={cn('relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#E20074] focus:ring-offset-2 focus:ring-offset-gray-900', sizes.container, checked ? 'bg-gradient-to-r from-[#E20074] to-[#20074]' : 'bg-gray-700', disabled && 'opacity-50 cursor-not-allowed')} data-magicpath-id="2" data-magicpath-path="ToggleSwitch.tsx">
        <span className="sr-only" data-magicpath-id="3" data-magicpath-path="ToggleSwitch.tsx">Toggle switch</span>
        <motion.span layout className={cn('pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out', sizes.thumb, checked ? sizes.translate : 'translate-x-0')} style={{
        filter: checked ? 'drop-shadow(0 0 8px rgba(226, 0, 116, 0.4))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
      }} data-magicpath-id="4" data-magicpath-path="ToggleSwitch.tsx" />
      </button>
      
      {rightLabel && <span className={cn('font-medium transition-colors duration-200', sizes.text, checked ? 'text-white' : 'text-gray-400')} data-magicpath-id="5" data-magicpath-path="ToggleSwitch.tsx">
          {rightLabel}
        </span>}
    </div>;
};
export default ToggleSwitch;