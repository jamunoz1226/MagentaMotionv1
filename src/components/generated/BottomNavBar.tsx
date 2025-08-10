import React from 'react';
import { motion } from 'framer-motion';
import { Home, BarChart3, Upload, Target, TrendingUp, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
type Screen = 'welcome' | 'dashboard' | 'home' | 'metrics' | 'upload' | 'daily' | 'goals' | 'catchup' | 'shift';
interface NavItem {
  id: Screen;
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  activeScreens: Screen[];
}
interface BottomNavBarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  className?: string;
}
const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
  className = ''
}) => {
  const navItems: NavItem[] = [{
    id: 'dashboard',
    icon: BarChart3,
    label: 'Dashboard',
    activeScreens: ['dashboard']
  }, {
    id: 'metrics',
    icon: TrendingUp,
    label: 'Metrics',
    activeScreens: ['metrics']
  }, {
    id: 'upload',
    icon: Upload,
    label: 'Upload',
    activeScreens: ['upload']
  }, {
    id: 'catchup',
    icon: Target,
    label: 'Catch-Up',
    activeScreens: ['catchup']
  }, {
    id: 'daily',
    icon: Clock,
    label: 'Shift',
    activeScreens: ['daily']
  }];
  const isActive = (item: NavItem) => {
    return item.activeScreens.includes(currentScreen) || item.id === currentScreen;
  };
  return <motion.div initial={{
    y: 100,
    opacity: 0
  }} animate={{
    y: 0,
    opacity: 1
  }} transition={{
    duration: 0.3,
    ease: 'easeOut'
  }} className={cn('fixed bottom-0 left-0 right-0 z-40', className)}>
      {/* Matte background */}
      <div className="relative">
        {/* Background layer */}
        <div className="absolute inset-0 bg-gray-900/95 border-t border-gray-700/50" />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/[0.02]" />
        
        {/* Top highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Navigation content */}
        <div className="relative px-4 py-2 safe-area-pb">
          <nav className="flex items-center justify-around max-w-md mx-auto">
            {navItems.map((item, index) => {
            const active = isActive(item);
            const Icon = item.icon;
            return <motion.button key={item.id} onClick={() => onNavigate(item.id)} className={cn('relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300', 'min-w-[60px] min-h-[60px]', active ? 'text-white' : 'text-gray-400 hover:text-gray-200')} whileTap={{
              scale: 0.95
            }} initial={{
              y: 20,
              opacity: 0
            }} animate={{
              y: 0,
              opacity: 1
            }} transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: 'easeOut'
            }}>
                  {/* Active background */}
                  {active && <motion.div layoutId="activeTab" className="absolute inset-0 bg-gradient-to-br from-[#E20074]/20 to-[#20074]/20 rounded-xl border border-gray-600/30" transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }} />}
                  
                  {/* Icon container */}
                  <div className="relative z-10 mb-1">
                    <Icon className={cn('w-6 h-6 transition-all duration-300', active && 'drop-shadow-[0_0_8px_rgba(226,0,116,0.5)]')} />
                    
                    {/* Active indicator dot */}
                    {active && <motion.div initial={{
                  scale: 0,
                  opacity: 0
                }} animate={{
                  scale: 1,
                  opacity: 1
                }} className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-[#E20074] to-[#20074] rounded-full shadow-lg" />}
                  </div>
                  
                  {/* Label */}
                  <span className={cn('text-xs font-medium transition-all duration-300 relative z-10', active ? 'text-white font-semibold' : 'text-gray-400')}>
                    {item.label}
                  </span>
                  
                  {/* Ripple effect on tap */}
                  <motion.div className="absolute inset-0 rounded-xl bg-white/5" initial={{
                scale: 0,
                opacity: 0
              }} whileTap={{
                scale: 1.2,
                opacity: 0.3
              }} transition={{
                duration: 0.2
              }} />
                </motion.button>;
          })}
          </nav>
        </div>
        
        {/* Bottom safe area for devices with home indicators */}
        <div className="h-safe-area-inset-bottom bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    </motion.div>;
};
export default BottomNavBar;