"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Circle, BookOpen, Paperclip, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import MatteCard from './GlassCard';
interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: 'coaching' | 'attach' | 'today';
}
interface CatchUpBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  metricCode: string;
  metricName: string;
  deficit: number;
  perShiftTarget: number;
}
const CatchUpBottomSheet: React.FC<CatchUpBottomSheetProps> = ({
  isOpen,
  onClose,
  metricCode,
  metricName,
  deficit,
  perShiftTarget
}) => {
  const [activeTab, setActiveTab] = useState<'coaching' | 'attach' | 'today'>('coaching');
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Generate tasks based on metric type
    const baseTasks: Record<string, Task[]> = {
      CV: [{
        id: '1',
        title: 'Review high-value product features',
        completed: false,
        category: 'coaching'
      }, {
        id: '2',
        title: 'Practice value proposition pitch',
        completed: false,
        category: 'coaching'
      }, {
        id: '3',
        title: 'Study competitor comparison sheet',
        completed: false,
        category: 'coaching'
      }, {
        id: '4',
        title: 'Suggest premium accessories',
        completed: false,
        category: 'attach'
      }, {
        id: '5',
        title: 'Offer extended warranty',
        completed: false,
        category: 'attach'
      }, {
        id: '6',
        title: 'Complete 3 customer value calls',
        completed: false,
        category: 'today'
      }, {
        id: '7',
        title: 'Follow up on pending quotes',
        completed: false,
        category: 'today'
      }],
      BTS: [{
        id: '1',
        title: 'Review student discount programs',
        completed: false,
        category: 'coaching'
      }, {
        id: '2',
        title: 'Learn about education partnerships',
        completed: false,
        category: 'coaching'
      }, {
        id: '3',
        title: 'Study back-to-school promotions',
        completed: false,
        category: 'coaching'
      }, {
        id: '4',
        title: 'Bundle student accessories',
        completed: false,
        category: 'attach'
      }, {
        id: '5',
        title: 'Offer student protection plans',
        completed: false,
        category: 'attach'
      }, {
        id: '6',
        title: 'Target 2 student customers',
        completed: false,
        category: 'today'
      }, {
        id: '7',
        title: 'Promote education discounts',
        completed: false,
        category: 'today'
      }],
      SALES_QUALITY: [{
        id: '1',
        title: 'Practice objection handling',
        completed: false,
        category: 'coaching'
      }, {
        id: '2',
        title: 'Review call scripts',
        completed: false,
        category: 'coaching'
      }, {
        id: '3',
        title: 'Study product knowledge guide',
        completed: false,
        category: 'coaching'
      }, {
        id: '4',
        title: 'Focus on needs assessment',
        completed: false,
        category: 'attach'
      }, {
        id: '5',
        title: 'Improve closing techniques',
        completed: false,
        category: 'attach'
      }, {
        id: '6',
        title: 'Complete quality checklist',
        completed: false,
        category: 'today'
      }, {
        id: '7',
        title: 'Record practice calls',
        completed: false,
        category: 'today'
      }]
    };
    return baseTasks[metricCode] || baseTasks.CV;
  });
  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => task.id === taskId ? {
      ...task,
      completed: !task.completed
    } : task));
  };
  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'coaching':
        return BookOpen;
      case 'attach':
        return Paperclip;
      case 'today':
        return Calendar;
      default:
        return BookOpen;
    }
  };
  const filteredTasks = tasks.filter(task => task.category === activeTab);
  const completedCount = filteredTasks.filter(task => task.completed).length;
  const progressPercentage = filteredTasks.length > 0 ? completedCount / filteredTasks.length * 100 : 0;
  return <AnimatePresence data-magicpath-id="0" data-magicpath-path="CatchUpBottomSheet.tsx">
      {isOpen && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center" onClick={e => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }} data-magicpath-id="1" data-magicpath-path="CatchUpBottomSheet.tsx">
          <motion.div initial={{
        opacity: 0,
        y: '100%'
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: '100%'
      }} transition={{
        type: "spring",
        damping: 25,
        stiffness: 300
      }} className="w-full max-w-md max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()} data-magicpath-id="2" data-magicpath-path="CatchUpBottomSheet.tsx">
            <MatteCard className="rounded-t-3xl rounded-b-none" variant="primary" data-magicpath-id="3" data-magicpath-path="CatchUpBottomSheet.tsx">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50" data-magicpath-id="4" data-magicpath-path="CatchUpBottomSheet.tsx">
                <div data-magicpath-id="5" data-magicpath-path="CatchUpBottomSheet.tsx">
                  <h2 className="text-xl font-bold text-white" data-magicpath-id="6" data-magicpath-path="CatchUpBottomSheet.tsx">{metricName}</h2>
                  <p className="text-gray-400 text-sm" data-magicpath-id="7" data-magicpath-path="CatchUpBottomSheet.tsx">
                    Gap: {deficit > 0 ? `+${deficit.toFixed(1)}` : deficit.toFixed(1)} | 
                    Target: {perShiftTarget.toFixed(1)}/shift
                  </p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/50" data-magicpath-id="8" data-magicpath-path="CatchUpBottomSheet.tsx">
                  <X className="w-5 h-5" data-magicpath-id="9" data-magicpath-path="CatchUpBottomSheet.tsx" />
                </button>
              </div>

              {/* Progress Summary */}
              <div className="p-6 border-b border-gray-700/50" data-magicpath-id="10" data-magicpath-path="CatchUpBottomSheet.tsx">
                <div className="flex items-center justify-between mb-3" data-magicpath-id="11" data-magicpath-path="CatchUpBottomSheet.tsx">
                  <span className="text-gray-300 text-sm" data-magicpath-id="12" data-magicpath-path="CatchUpBottomSheet.tsx">Progress</span>
                  <span className="text-white font-medium" data-magicpath-id="13" data-magicpath-path="CatchUpBottomSheet.tsx">{completedCount}/{filteredTasks.length}</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden" data-magicpath-id="14" data-magicpath-path="CatchUpBottomSheet.tsx">
                  <motion.div initial={{
                width: 0
              }} animate={{
                width: `${progressPercentage}%`
              }} transition={{
                duration: 0.5,
                ease: "easeOut"
              }} className="h-full bg-gradient-to-r from-[#E20074] to-[#20074] rounded-full" data-magicpath-id="15" data-magicpath-path="CatchUpBottomSheet.tsx" />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-700/50" data-magicpath-id="16" data-magicpath-path="CatchUpBottomSheet.tsx">
                {(['coaching', 'attach', 'today'] as const).map(tab => {
              const IconComponent = getTabIcon(tab);
              const isActive = activeTab === tab;
              const tabTasks = tasks.filter(task => task.category === tab);
              const tabCompleted = tabTasks.filter(task => task.completed).length;
              return <button key={tab} onClick={() => setActiveTab(tab)} className={cn("flex-1 flex items-center justify-center space-x-2 py-4 px-3 transition-all relative", isActive ? "text-[#E20074] bg-[#E20074]/10" : "text-gray-400 hover:text-gray-300")} data-magicpath-id="17" data-magicpath-path="CatchUpBottomSheet.tsx">
                      <IconComponent className="w-4 h-4" data-magicpath-id="18" data-magicpath-path="CatchUpBottomSheet.tsx" />
                      <span className="text-sm font-medium capitalize" data-magicpath-id="19" data-magicpath-path="CatchUpBottomSheet.tsx">{tab}</span>
                      {tabCompleted > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center" data-magicpath-id="20" data-magicpath-path="CatchUpBottomSheet.tsx">
                          <span className="text-xs text-white font-bold" data-magicpath-id="21" data-magicpath-path="CatchUpBottomSheet.tsx">{tabCompleted}</span>
                        </div>}
                      {isActive && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E20074]" data-magicpath-id="22" data-magicpath-path="CatchUpBottomSheet.tsx" />}
                    </button>;
            })}
              </div>

              {/* Task List */}
              <div className="p-6 max-h-96 overflow-y-auto" data-magicpath-id="23" data-magicpath-path="CatchUpBottomSheet.tsx">
                <div className="space-y-3" data-magicpath-id="24" data-magicpath-path="CatchUpBottomSheet.tsx">
                  {filteredTasks.map((task, index) => <motion.div key={task.id} initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: index * 0.1
              }} className={cn("flex items-start space-x-3 p-3 rounded-lg transition-all cursor-pointer", task.completed ? "bg-green-500/10 border border-green-500/20" : "bg-gray-800/30 hover:bg-gray-700/30")} onClick={() => toggleTask(task.id)} data-magicpath-id="25" data-magicpath-path="CatchUpBottomSheet.tsx">
                      <motion.div whileTap={{
                  scale: 0.9
                }} className="flex-shrink-0 mt-0.5" data-magicpath-id="26" data-magicpath-path="CatchUpBottomSheet.tsx">
                        {task.completed ? <CheckCircle className="w-5 h-5 text-green-400" data-magicpath-id="27" data-magicpath-path="CatchUpBottomSheet.tsx" /> : <Circle className="w-5 h-5 text-gray-400" />}
                      </motion.div>
                      <div className="flex-1 min-w-0" data-magicpath-id="28" data-magicpath-path="CatchUpBottomSheet.tsx">
                        <p className={cn("text-sm transition-all", task.completed ? "text-gray-400 line-through" : "text-white")} data-magicpath-id="29" data-magicpath-path="CatchUpBottomSheet.tsx">
                          {task.title}
                        </p>
                      </div>
                    </motion.div>)}
                </div>

                {filteredTasks.length === 0 && <div className="text-center py-8" data-magicpath-id="30" data-magicpath-path="CatchUpBottomSheet.tsx">
                    <p className="text-gray-400" data-magicpath-id="31" data-magicpath-path="CatchUpBottomSheet.tsx">No tasks available for this category</p>
                  </div>}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-700/50" data-magicpath-id="32" data-magicpath-path="CatchUpBottomSheet.tsx">
                <div className="text-center" data-magicpath-id="33" data-magicpath-path="CatchUpBottomSheet.tsx">
                  <p className="text-gray-400 text-sm mb-2" data-magicpath-id="34" data-magicpath-path="CatchUpBottomSheet.tsx">
                    Complete these actions to reach your catch-up target
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500" data-magicpath-id="35" data-magicpath-path="CatchUpBottomSheet.tsx">
                    <span data-magicpath-id="36" data-magicpath-path="CatchUpBottomSheet.tsx">Target: {perShiftTarget.toFixed(1)}/shift</span>
                    <span data-magicpath-id="37" data-magicpath-path="CatchUpBottomSheet.tsx">•</span>
                    <span data-magicpath-id="38" data-magicpath-path="CatchUpBottomSheet.tsx">Gap: {deficit > 0 ? `+${deficit.toFixed(1)}` : deficit.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </MatteCard>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};
export default CatchUpBottomSheet;