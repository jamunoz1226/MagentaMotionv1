"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import MatteCard from './GlassCard';
import ToggleSwitch from './ToggleSwitch';
import { useCatchUpStore } from './CatchUpStore';
import { getFormulaDescription } from './CatchUpUtils';
import CatchUpBottomSheet from './CatchUpBottomSheet';
type ViewMode = 'MTD' | 'EOM';
interface CatchUpViewProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}
const CatchUpView: React.FC<CatchUpViewProps> = ({
  viewMode,
  onViewModeChange
}) => {
  const [selectedMetricForActions, setSelectedMetricForActions] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Catch-up store
  const catchUpStore = useCatchUpStore();
  return <div className="min-h-screen bg-gradient-to-br from-gray-950 via-[#20074] to-gray-900 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pt-4 mb-6">
          <h1 className="text-2xl font-display text-white">Catch Up</h1>
          <ToggleSwitch checked={viewMode === 'EOM'} onChange={checked => onViewModeChange(checked ? 'EOM' : 'MTD')} leftLabel="MTD" rightLabel="EOM" />
        </div>

        {/* Summary Card */}
        <MatteCard className="p-6" variant="accent">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-heading text-lg">Overall Progress</h3>
              <p className="text-gray-400 text-sm">
                Projected EOM: {catchUpStore.state.projectedEom}%
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {catchUpStore.state.overallProgress}%
              </div>
              <div className="text-xs text-gray-400">to target</div>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div initial={{
            width: 0
          }} animate={{
            width: `${catchUpStore.state.overallProgress}%`
          }} transition={{
            duration: 1,
            ease: "easeOut"
          }} className="h-full bg-gradient-to-r from-[#E20074] to-[#20074] rounded-full" />
          </div>
        </MatteCard>

        {/* Controls Row */}
        <MatteCard className="p-4" variant="secondary">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-medium">Calculation Controls</h4>
              <button onClick={() => catchUpStore.updateSortBy(catchUpStore.state.sortBy === 'gap' ? 'priority' : 'gap')} className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white transition-colors">
                <ArrowUpDown className="w-3 h-3" />
                <span>Sort by {catchUpStore.state.sortBy === 'gap' ? 'Priority' : 'Gap'}</span>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Data Through Day</label>
                <input type="number" value={catchUpStore.state.dataThroughDay} onChange={e => catchUpStore.updateControl('dataThroughDay', parseInt(e.target.value) || 0)} className="w-full px-2 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E20074] focus:border-transparent" min="1" max="31" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Shifts Left</label>
                <input type="number" value={catchUpStore.state.shiftsLeft} onChange={e => catchUpStore.updateControl('shiftsLeft', parseInt(e.target.value) || 0)} className="w-full px-2 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E20074] focus:border-transparent" min="0" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Catch-Up Day</label>
                <input type="number" value={catchUpStore.state.catchUpDay} onChange={e => catchUpStore.updateControl('catchUpDay', parseInt(e.target.value) || 0)} className="w-full px-2 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E20074] focus:border-transparent" min="1" max="31" />
              </div>
            </div>
          </div>
        </MatteCard>

        {/* Priority List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-heading">Metrics Priority</h3>
            <div className="text-xs text-gray-400">
              Sorted by {catchUpStore.state.sortBy === 'gap' ? 'Gap' : 'Priority Score'}
            </div>
          </div>
          
          {catchUpStore.state.calculations.map((metric, index) => {
          const statusColor = metric.status === 'On Track' ? 'text-green-400' : metric.status === 'Needs Focus' ? 'text-yellow-400' : 'text-red-400';
          const statusBg = metric.status === 'On Track' ? 'bg-green-400/20' : metric.status === 'Needs Focus' ? 'bg-yellow-400/20' : 'bg-red-400/20';
          return <motion.div key={metric.code} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1
          }}>
                <MatteCard className="p-4" variant="primary">
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="px-2 py-1 bg-[#E20074]/20 text-[#E20074] rounded text-xs font-mono">
                          {metric.code}
                        </div>
                        <div className="relative">
                          <button onMouseEnter={() => setShowTooltip(metric.code)} onMouseLeave={() => setShowTooltip(null)} className="text-gray-400 hover:text-white transition-colors">
                            <Info className="w-3 h-3" />
                          </button>
                          {showTooltip === metric.code && <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300 whitespace-nowrap z-10">
                              {metric.name}
                            </div>}
                        </div>
                      </div>
                      <div className={cn("px-2 py-1 rounded-full text-xs font-medium", statusBg, statusColor)}>
                        {metric.status}
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-400 text-xs">Actual</div>
                        <div className="text-white font-medium">{metric.actual.toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs">MTD Oppty</div>
                        <div className="text-white font-medium">{metric.mtdOppty.toFixed(1)}</div>
                      </div>
                      <div className="relative">
                        <button onMouseEnter={() => setShowTooltip(`${metric.code}-deficit`)} onMouseLeave={() => setShowTooltip(null)} className="text-left w-full">
                          <div className="text-gray-400 text-xs flex items-center space-x-1">
                            <span>Deficit</span>
                            <Info className="w-2 h-2" />
                          </div>
                          <div className={cn("font-medium", metric.deficit > 0 ? "text-red-400" : "text-green-400")}>
                            {metric.deficit > 0 ? `+${metric.deficit.toFixed(1)}` : metric.deficit.toFixed(1)}
                          </div>
                        </button>
                        {showTooltip === `${metric.code}-deficit` && <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300 whitespace-nowrap z-10">
                            {getFormulaDescription('deficit')}
                          </div>}
                      </div>
                      <div className="relative">
                        <button onMouseEnter={() => setShowTooltip(`${metric.code}-pershift`)} onMouseLeave={() => setShowTooltip(null)} className="text-left w-full">
                          <div className="text-gray-400 text-xs flex items-center space-x-1">
                            <span>Per-Shift</span>
                            <Info className="w-2 h-2" />
                          </div>
                          <div className="text-white font-medium">{metric.perShiftToCatchUp.toFixed(1)}</div>
                        </button>
                        {showTooltip === `${metric.code}-pershift` && <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300 whitespace-nowrap z-10 max-w-48">
                            {getFormulaDescription('perShiftToCatchUp')}
                          </div>}
                      </div>
                    </div>

                    {/* Priority Score */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
                      <div className="relative">
                        <button onMouseEnter={() => setShowTooltip(`${metric.code}-priority`)} onMouseLeave={() => setShowTooltip(null)} className="flex items-center space-x-1 text-gray-400 text-xs">
                          <span>Priority Score</span>
                          <Info className="w-2 h-2" />
                        </button>
                        {showTooltip === `${metric.code}-priority` && <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300 whitespace-nowrap z-10">
                            {getFormulaDescription('priorityScore')}
                          </div>}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-white font-medium">{metric.priorityScore.toFixed(1)}</span>
                        <button onClick={() => setSelectedMetricForActions(metric.code)} className="px-3 py-1 bg-[#E20074] text-white rounded-lg text-xs font-medium hover:bg-[#C21E68] transition-colors">
                          See Actions
                        </button>
                      </div>
                    </div>
                  </div>
                </MatteCard>
              </motion.div>;
        })}
        </div>

        {/* Bottom Sheet */}
        <CatchUpBottomSheet isOpen={selectedMetricForActions !== null} onClose={() => setSelectedMetricForActions(null)} metricCode={selectedMetricForActions || ''} metricName={selectedMetricForActions ? catchUpStore.state.calculations.find(m => m.code === selectedMetricForActions)?.name || '' : ''} deficit={selectedMetricForActions ? catchUpStore.state.calculations.find(m => m.code === selectedMetricForActions)?.deficit || 0 : 0} perShiftTarget={selectedMetricForActions ? catchUpStore.state.calculations.find(m => m.code === selectedMetricForActions)?.perShiftToCatchUp || 0 : 0} />
      </div>
    </div>;
};
export default CatchUpView;