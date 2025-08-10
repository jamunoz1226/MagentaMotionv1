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
  return <div className="min-h-screen bg-gradient-to-br from-gray-950 via-[#20074] to-gray-900 p-4 pb-20" data-magicpath-id="0" data-magicpath-path="CatchUpView.tsx">
      <div className="max-w-md mx-auto space-y-4" data-magicpath-id="1" data-magicpath-path="CatchUpView.tsx">
        {/* Header */}
        <div className="flex justify-between items-center pt-4 mb-6" data-magicpath-id="2" data-magicpath-path="CatchUpView.tsx">
          <h1 className="text-2xl font-display text-white" data-magicpath-id="3" data-magicpath-path="CatchUpView.tsx">Catch Up</h1>
          <ToggleSwitch checked={viewMode === 'EOM'} onChange={checked => onViewModeChange(checked ? 'EOM' : 'MTD')} leftLabel="MTD" rightLabel="EOM" data-magicpath-id="4" data-magicpath-path="CatchUpView.tsx" />
        </div>

        {/* Summary Card */}
        <MatteCard className="p-6" variant="accent" data-magicpath-id="5" data-magicpath-path="CatchUpView.tsx">
          <div className="flex items-center justify-between mb-4" data-magicpath-id="6" data-magicpath-path="CatchUpView.tsx">
            <div data-magicpath-id="7" data-magicpath-path="CatchUpView.tsx">
              <h3 className="text-white font-heading text-lg" data-magicpath-id="8" data-magicpath-path="CatchUpView.tsx">Overall Progress</h3>
              <p className="text-gray-400 text-sm" data-magicpath-id="9" data-magicpath-path="CatchUpView.tsx">
                Projected EOM: {catchUpStore.state.projectedEom}%
              </p>
            </div>
            <div className="text-right" data-magicpath-id="10" data-magicpath-path="CatchUpView.tsx">
              <div className="text-2xl font-bold text-white" data-magicpath-id="11" data-magicpath-path="CatchUpView.tsx">
                {catchUpStore.state.overallProgress}%
              </div>
              <div className="text-xs text-gray-400" data-magicpath-id="12" data-magicpath-path="CatchUpView.tsx">to target</div>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden" data-magicpath-id="13" data-magicpath-path="CatchUpView.tsx">
            <motion.div initial={{
            width: 0
          }} animate={{
            width: `${catchUpStore.state.overallProgress}%`
          }} transition={{
            duration: 1,
            ease: "easeOut"
          }} className="h-full bg-gradient-to-r from-[#E20074] to-[#20074] rounded-full" data-magicpath-id="14" data-magicpath-path="CatchUpView.tsx" />
          </div>
        </MatteCard>

        {/* Controls Row */}
        <MatteCard className="p-4" variant="secondary" data-magicpath-id="15" data-magicpath-path="CatchUpView.tsx">
          <div className="space-y-4" data-magicpath-id="16" data-magicpath-path="CatchUpView.tsx">
            <div className="flex items-center justify-between mb-3" data-magicpath-id="17" data-magicpath-path="CatchUpView.tsx">
              <h4 className="text-white font-medium" data-magicpath-id="18" data-magicpath-path="CatchUpView.tsx">Calculation Controls</h4>
              <button onClick={() => catchUpStore.updateSortBy(catchUpStore.state.sortBy === 'gap' ? 'priority' : 'gap')} className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white transition-colors" data-magicpath-id="19" data-magicpath-path="CatchUpView.tsx">
                <ArrowUpDown className="w-3 h-3" data-magicpath-id="20" data-magicpath-path="CatchUpView.tsx" />
                <span data-magicpath-id="21" data-magicpath-path="CatchUpView.tsx">Sort by {catchUpStore.state.sortBy === 'gap' ? 'Priority' : 'Gap'}</span>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3" data-magicpath-id="22" data-magicpath-path="CatchUpView.tsx">
              <div data-magicpath-id="23" data-magicpath-path="CatchUpView.tsx">
                <label className="block text-xs text-gray-400 mb-1" data-magicpath-id="24" data-magicpath-path="CatchUpView.tsx">Data Through Day</label>
                <input type="number" value={catchUpStore.state.dataThroughDay} onChange={e => catchUpStore.updateControl('dataThroughDay', parseInt(e.target.value) || 0)} className="w-full px-2 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E20074] focus:border-transparent" min="1" max="31" data-magicpath-id="25" data-magicpath-path="CatchUpView.tsx" />
              </div>
              <div data-magicpath-id="26" data-magicpath-path="CatchUpView.tsx">
                <label className="block text-xs text-gray-400 mb-1" data-magicpath-id="27" data-magicpath-path="CatchUpView.tsx">Shifts Left</label>
                <input type="number" value={catchUpStore.state.shiftsLeft} onChange={e => catchUpStore.updateControl('shiftsLeft', parseInt(e.target.value) || 0)} className="w-full px-2 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E20074] focus:border-transparent" min="0" data-magicpath-id="28" data-magicpath-path="CatchUpView.tsx" />
              </div>
              <div data-magicpath-id="29" data-magicpath-path="CatchUpView.tsx">
                <label className="block text-xs text-gray-400 mb-1" data-magicpath-id="30" data-magicpath-path="CatchUpView.tsx">Catch-Up Day</label>
                <input type="number" value={catchUpStore.state.catchUpDay} onChange={e => catchUpStore.updateControl('catchUpDay', parseInt(e.target.value) || 0)} className="w-full px-2 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E20074] focus:border-transparent" min="1" max="31" data-magicpath-id="31" data-magicpath-path="CatchUpView.tsx" />
              </div>
            </div>
          </div>
        </MatteCard>

        {/* Priority List */}
        <div className="space-y-3" data-magicpath-id="32" data-magicpath-path="CatchUpView.tsx">
          <div className="flex items-center justify-between" data-magicpath-id="33" data-magicpath-path="CatchUpView.tsx">
            <h3 className="text-white font-heading" data-magicpath-id="34" data-magicpath-path="CatchUpView.tsx">Metrics Priority</h3>
            <div className="text-xs text-gray-400" data-magicpath-id="35" data-magicpath-path="CatchUpView.tsx">
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
          }} data-magicpath-id="36" data-magicpath-path="CatchUpView.tsx">
                <MatteCard className="p-4" variant="primary" data-magicpath-id="37" data-magicpath-path="CatchUpView.tsx">
                  <div className="space-y-3" data-magicpath-id="38" data-magicpath-path="CatchUpView.tsx">
                    {/* Header Row */}
                    <div className="flex items-center justify-between" data-magicpath-id="39" data-magicpath-path="CatchUpView.tsx">
                      <div className="flex items-center space-x-2" data-magicpath-id="40" data-magicpath-path="CatchUpView.tsx">
                        <div className="px-2 py-1 bg-[#E20074]/20 text-[#E20074] rounded text-xs font-mono" data-magicpath-id="41" data-magicpath-path="CatchUpView.tsx">
                          {metric.code}
                        </div>
                        <div className="relative" data-magicpath-id="42" data-magicpath-path="CatchUpView.tsx">
                          <button onMouseEnter={() => setShowTooltip(metric.code)} onMouseLeave={() => setShowTooltip(null)} className="text-gray-400 hover:text-white transition-colors" data-magicpath-id="43" data-magicpath-path="CatchUpView.tsx">
                            <Info className="w-3 h-3" data-magicpath-id="44" data-magicpath-path="CatchUpView.tsx" />
                          </button>
                          {showTooltip === metric.code && <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300 whitespace-nowrap z-10" data-magicpath-id="45" data-magicpath-path="CatchUpView.tsx">
                              {metric.name}
                            </div>}
                        </div>
                      </div>
                      <div className={cn("px-2 py-1 rounded-full text-xs font-medium", statusBg, statusColor)} data-magicpath-id="46" data-magicpath-path="CatchUpView.tsx">
                        {metric.status}
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm" data-magicpath-id="47" data-magicpath-path="CatchUpView.tsx">
                      <div data-magicpath-id="48" data-magicpath-path="CatchUpView.tsx">
                        <div className="text-gray-400 text-xs" data-magicpath-id="49" data-magicpath-path="CatchUpView.tsx">Actual</div>
                        <div className="text-white font-medium" data-magicpath-id="50" data-magicpath-path="CatchUpView.tsx">{metric.actual.toFixed(1)}</div>
                      </div>
                      <div data-magicpath-id="51" data-magicpath-path="CatchUpView.tsx">
                        <div className="text-gray-400 text-xs" data-magicpath-id="52" data-magicpath-path="CatchUpView.tsx">MTD Oppty</div>
                        <div className="text-white font-medium" data-magicpath-id="53" data-magicpath-path="CatchUpView.tsx">{metric.mtdOppty.toFixed(1)}</div>
                      </div>
                      <div className="relative" data-magicpath-id="54" data-magicpath-path="CatchUpView.tsx">
                        <button onMouseEnter={() => setShowTooltip(`${metric.code}-deficit`)} onMouseLeave={() => setShowTooltip(null)} className="text-left w-full" data-magicpath-id="55" data-magicpath-path="CatchUpView.tsx">
                          <div className="text-gray-400 text-xs flex items-center space-x-1" data-magicpath-id="56" data-magicpath-path="CatchUpView.tsx">
                            <span data-magicpath-id="57" data-magicpath-path="CatchUpView.tsx">Deficit</span>
                            <Info className="w-2 h-2" data-magicpath-id="58" data-magicpath-path="CatchUpView.tsx" />
                          </div>
                          <div className={cn("font-medium", metric.deficit > 0 ? "text-red-400" : "text-green-400")} data-magicpath-id="59" data-magicpath-path="CatchUpView.tsx">
                            {metric.deficit > 0 ? `+${metric.deficit.toFixed(1)}` : metric.deficit.toFixed(1)}
                          </div>
                        </button>
                        {showTooltip === `${metric.code}-deficit` && <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300 whitespace-nowrap z-10" data-magicpath-id="60" data-magicpath-path="CatchUpView.tsx">
                            {getFormulaDescription('deficit')}
                          </div>}
                      </div>
                      <div className="relative" data-magicpath-id="61" data-magicpath-path="CatchUpView.tsx">
                        <button onMouseEnter={() => setShowTooltip(`${metric.code}-pershift`)} onMouseLeave={() => setShowTooltip(null)} className="text-left w-full" data-magicpath-id="62" data-magicpath-path="CatchUpView.tsx">
                          <div className="text-gray-400 text-xs flex items-center space-x-1" data-magicpath-id="63" data-magicpath-path="CatchUpView.tsx">
                            <span data-magicpath-id="64" data-magicpath-path="CatchUpView.tsx">Per-Shift</span>
                            <Info className="w-2 h-2" data-magicpath-id="65" data-magicpath-path="CatchUpView.tsx" />
                          </div>
                          <div className="text-white font-medium" data-magicpath-id="66" data-magicpath-path="CatchUpView.tsx">{metric.perShiftToCatchUp.toFixed(1)}</div>
                        </button>
                        {showTooltip === `${metric.code}-pershift` && <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300 whitespace-nowrap z-10 max-w-48" data-magicpath-id="67" data-magicpath-path="CatchUpView.tsx">
                            {getFormulaDescription('perShiftToCatchUp')}
                          </div>}
                      </div>
                    </div>

                    {/* Priority Score */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-700/50" data-magicpath-id="68" data-magicpath-path="CatchUpView.tsx">
                      <div className="relative" data-magicpath-id="69" data-magicpath-path="CatchUpView.tsx">
                        <button onMouseEnter={() => setShowTooltip(`${metric.code}-priority`)} onMouseLeave={() => setShowTooltip(null)} className="flex items-center space-x-1 text-gray-400 text-xs" data-magicpath-id="70" data-magicpath-path="CatchUpView.tsx">
                          <span data-magicpath-id="71" data-magicpath-path="CatchUpView.tsx">Priority Score</span>
                          <Info className="w-2 h-2" data-magicpath-id="72" data-magicpath-path="CatchUpView.tsx" />
                        </button>
                        {showTooltip === `${metric.code}-priority` && <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300 whitespace-nowrap z-10" data-magicpath-id="73" data-magicpath-path="CatchUpView.tsx">
                            {getFormulaDescription('priorityScore')}
                          </div>}
                      </div>
                      <div className="flex items-center space-x-3" data-magicpath-id="74" data-magicpath-path="CatchUpView.tsx">
                        <span className="text-white font-medium" data-magicpath-id="75" data-magicpath-path="CatchUpView.tsx">{metric.priorityScore.toFixed(1)}</span>
                        <button onClick={() => setSelectedMetricForActions(metric.code)} className="px-3 py-1 bg-[#E20074] text-white rounded-lg text-xs font-medium hover:bg-[#C21E68] transition-colors" data-magicpath-id="76" data-magicpath-path="CatchUpView.tsx">
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
        <CatchUpBottomSheet isOpen={selectedMetricForActions !== null} onClose={() => setSelectedMetricForActions(null)} metricCode={selectedMetricForActions || ''} metricName={selectedMetricForActions ? catchUpStore.state.calculations.find(m => m.code === selectedMetricForActions)?.name || '' : ''} deficit={selectedMetricForActions ? catchUpStore.state.calculations.find(m => m.code === selectedMetricForActions)?.deficit || 0 : 0} perShiftTarget={selectedMetricForActions ? catchUpStore.state.calculations.find(m => m.code === selectedMetricForActions)?.perShiftToCatchUp || 0 : 0} data-magicpath-id="77" data-magicpath-path="CatchUpView.tsx" />
      </div>
    </div>;
};
export default CatchUpView;