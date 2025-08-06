import React from 'react';
import { motion } from 'framer-motion';
import { Home, BarChart3, Upload, Target, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';
type Screen = 'welcome' | 'dashboard' | 'home' | 'metrics' | 'upload' | 'daily' | 'goals' | 'catchup';
interface NavItem {
  id: Screen;
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  activeScreens: Screen[];
  mpid?: string;
}
interface BottomNavBarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  className?: string;
  mpid?: string;
}
const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
  className = ''
}) => {
  const navItems: NavItem[] = [{
    id: 'home',
    icon: Home,
    label: 'Home',
    activeScreens: ['home'],
    mpid: "710393fb-385d-424b-9bc9-c92060f290d3"
  }, {
    id: 'dashboard',
    icon: BarChart3,
    label: 'Dashboard',
    activeScreens: ['dashboard'],
    mpid: "2b56c01d-d75d-4bc8-8196-2d1fc49e5724"
  }, {
    id: 'upload',
    icon: Upload,
    label: 'Upload',
    activeScreens: ['upload'],
    mpid: "56bd1632-2c50-4d0c-b35d-a81a08ceb16c"
  }, {
    id: 'metrics',
    icon: TrendingUp,
    label: 'Metrics',
    activeScreens: ['metrics'],
    mpid: "0f5d3f9f-73b6-48e9-8413-5f3ee403f59c"
  }, {
    id: 'goals',
    icon: Target,
    label: 'Goals',
    activeScreens: ['goals', 'daily', 'catchup'],
    mpid: "bb0b0a41-d515-4281-831e-3585d6fac91a"
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
  }} className={cn('fixed bottom-0 left-0 right-0 z-40', className)} data-magicpath-id="0" data-magicpath-path="BottomNavBar.tsx">
      {/* Glass background with blur effect */}
      <div className="relative" data-magicpath-id="1" data-magicpath-path="BottomNavBar.tsx">
        {/* Background blur layer */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-xl" data-magicpath-id="2" data-magicpath-path="BottomNavBar.tsx" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-white/5 to-transparent" data-magicpath-id="3" data-magicpath-path="BottomNavBar.tsx" />
        
        {/* Border glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" data-magicpath-id="4" data-magicpath-path="BottomNavBar.tsx" />
        
        {/* Navigation content */}
        <div className="relative px-4 py-2 safe-area-pb" data-magicpath-id="5" data-magicpath-path="BottomNavBar.tsx">
          <nav className="flex items-center justify-around max-w-md mx-auto" data-magicpath-id="6" data-magicpath-path="BottomNavBar.tsx">
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
            }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="7" data-magicpath-path="BottomNavBar.tsx">
                  {/* Active background */}
                  {active && <motion.div layoutId="activeTab" className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl border border-white/10" transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="8" data-magicpath-path="BottomNavBar.tsx" />}
                  
                  {/* Icon container */}
                  <div className="relative z-10 mb-1" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="9" data-magicpath-path="BottomNavBar.tsx">
                    <Icon className={cn('w-6 h-6 transition-all duration-300', active && 'drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]')} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="10" data-magicpath-path="BottomNavBar.tsx" />
                    
                    {/* Active indicator dot */}
                    {active && <motion.div initial={{
                  scale: 0,
                  opacity: 0
                }} animate={{
                  scale: 1,
                  opacity: 1
                }} className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" style={{
                  filter: 'drop-shadow(0 0 4px rgba(236, 72, 153, 0.8))'
                }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="11" data-magicpath-path="BottomNavBar.tsx" />}
                  </div>
                  
                  {/* Label */}
                  <span className={cn('text-xs font-medium transition-all duration-300 relative z-10', active ? 'text-white font-semibold' : 'text-gray-400')} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:string" data-magicpath-id="12" data-magicpath-path="BottomNavBar.tsx">
                    {item.label}
                  </span>
                  
                  {/* Ripple effect on tap */}
                  <motion.div className="absolute inset-0 rounded-xl bg-white/10" initial={{
                scale: 0,
                opacity: 0
              }} whileTap={{
                scale: 1.2,
                opacity: 0.3
              }} transition={{
                duration: 0.2
              }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="13" data-magicpath-path="BottomNavBar.tsx" />
                </motion.button>;
          })}
          </nav>
        </div>
        
        {/* Bottom safe area for devices with home indicators */}
        <div className="h-safe-area-inset-bottom bg-gradient-to-t from-black/40 to-transparent" data-magicpath-id="14" data-magicpath-path="BottomNavBar.tsx" />
      </div>
    </motion.div>;
};
export default BottomNavBar;