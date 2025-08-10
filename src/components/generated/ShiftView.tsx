"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Target, Clock, Save, ArrowRight, Phone, Smartphone, Wifi, Package, Headphones, Monitor } from 'lucide-react';
import { cn } from '../../lib/utils';
import MatteCard from './GlassCard';
import CounterRow from './CounterRow';
import KeypadModal from './KeypadModal';
import MotivationCard from './MotivationCard';
import { useShiftStore } from './stores-useShiftStore';
interface ShiftViewProps {
  onNavigateToCatchUp?: (metric?: string) => void;
}
const METRIC_LABELS = {
  voice: 'Voice',
  bts: 'BTS',
  tfb: 'TFB',
  p360: 'P360 Sold',
  acc: 'Accessories Sold',
  devices: 'Devices Sold'
};
const METRIC_ICONS = {
  voice: Phone,
  bts: Smartphone,
  tfb: Wifi,
  p360: Package,
  acc: Headphones,
  devices: Monitor
};
export default function ShiftView({
  onNavigateToCatchUp
}: ShiftViewProps) {
  const shiftStore = useShiftStore();
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);
  const [motivationData, setMotivationData] = useState({
    metric: '',
    remaining: 0,
    progress: 0
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (shiftStore.startedAt) {
      interval = setInterval(() => {
        setSessionTimer(Math.floor((Date.now() - shiftStore.startedAt!) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [shiftStore.startedAt]);
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const handleStartShift = () => {
    shiftStore.startShift();
    setIsRunning(true);
  };
  const handlePauseShift = () => {
    setIsRunning(false);
  };
  const handleEndShift = () => {
    shiftStore.endShift();
    setIsRunning(false);
    setSessionTimer(0);
  };
  const handleIncrement = (metricPath: string) => {
    shiftStore.inc(metricPath);
    showMotivationMessage(metricPath);
  };
  const handleDecrement = (metricPath: string) => {
    shiftStore.dec(metricPath);
  };
  const handleShiftHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      shiftStore.setShiftHours(null);
    } else {
      const hours = parseFloat(value);
      if (!isNaN(hours) && hours >= 0) {
        shiftStore.setShiftHours(hours);
      }
    }
  };
  const showMotivationMessage = (metricPath: string) => {
    const metric = metricPath.split('.')[1] || metricPath;
    const remaining = shiftStore.remaining(metric);
    const progress = shiftStore.progressPct(metric);
    setMotivationData({
      metric,
      remaining,
      progress
    });
    setShowMotivation(true);
  };
  const handleCsatSubmit = (score: number) => {
    shiftStore.inc('incremental.csatCount');
    const currentTotal = shiftStore.incremental.csatScore;
    // Update the total score by adding the new score
    const newTotal = currentTotal + score;
    // We need to manually set the csatScore since it's not a simple increment
    shiftStore.setTarget('csatScore', newTotal);
    showMotivationMessage('csat');
  };

  // Find metric with largest remaining/deficit for focus banner
  const getFocusMetric = () => {
    const metricsToCheck = ['voice', 'bts', 'tfb', 'p360', 'acc', 'devices'];
    let maxRemaining = 0;
    let focusMetric = 'voice';
    metricsToCheck.forEach(metric => {
      const remaining = shiftStore.remaining(metric);
      if (remaining > maxRemaining) {
        maxRemaining = remaining;
        focusMetric = metric;
      }
    });
    return {
      metric: focusMetric,
      remaining: maxRemaining
    };
  };
  const focusInfo = getFocusMetric();

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const metricsWithTargets = ['voice', 'bts', 'tfb', 'p360', 'acc', 'devices'].filter(metric => shiftStore.targets[metric as keyof typeof shiftStore.targets]);
    if (metricsWithTargets.length === 0) return 0;
    const totalProgress = metricsWithTargets.reduce((sum, metric) => {
      return sum + shiftStore.progressPct(metric);
    }, 0);
    return Math.round(totalProgress / metricsWithTargets.length);
  };
  const overallProgress = calculateOverallProgress();
  const CSATRow = () => {
    const csatAvg = shiftStore.csatAvg();
    const csatCount = shiftStore.incremental.csatCount;
    return <div className="sh-csat-row p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm" data-magicpath-id="0" data-magicpath-path="ShiftView.tsx">
        <div className="flex items-center justify-between" data-magicpath-id="1" data-magicpath-path="ShiftView.tsx">
          <div className="flex items-center space-x-3" data-magicpath-id="2" data-magicpath-path="ShiftView.tsx">
            <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center" data-magicpath-id="3" data-magicpath-path="ShiftView.tsx">
              <Target className="w-5 h-5 text-yellow-400" data-magicpath-id="4" data-magicpath-path="ShiftView.tsx" />
            </div>
            <div data-magicpath-id="5" data-magicpath-path="ShiftView.tsx">
              <span className="text-white font-medium text-sm" data-magicpath-id="6" data-magicpath-path="ShiftView.tsx">CSAT Average</span>
              <div className="text-xs text-gray-400" data-magicpath-id="7" data-magicpath-path="ShiftView.tsx">
                {csatAvg.toFixed(1)} ({csatCount} responses)
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3" data-magicpath-id="8" data-magicpath-path="ShiftView.tsx">
            <div className="text-xl font-bold text-white" data-magicpath-id="9" data-magicpath-path="ShiftView.tsx">
              {csatAvg.toFixed(1)}
            </div>
            <button onClick={() => setShowKeypad(true)} className="px-4 py-2 bg-[#E20074] hover:bg-[#C21E68] rounded-lg text-white text-sm font-medium transition-colors" data-magicpath-id="10" data-magicpath-path="ShiftView.tsx">
              Add Score
            </button>
          </div>
        </div>
      </div>;
  };
  return <div className="min-h-screen bg-gradient-to-br from-gray-950 via-[#20074] to-gray-900 p-4 pb-32" data-magicpath-id="11" data-magicpath-path="ShiftView.tsx">
      <div className="max-w-md mx-auto space-y-4" data-magicpath-id="12" data-magicpath-path="ShiftView.tsx">
        {/* Header */}
        <div className="flex items-center justify-between pt-4 mb-6" data-magicpath-id="13" data-magicpath-path="ShiftView.tsx">
          <h1 className="text-2xl font-display text-white" data-magicpath-id="14" data-magicpath-path="ShiftView.tsx">Shift</h1>
          <div className="px-3 py-1 bg-gray-800/50 rounded-full text-sm text-gray-300" data-magicpath-id="15" data-magicpath-path="ShiftView.tsx">
            {shiftStore.date}
          </div>
        </div>

        {/* Shift Hours Input */}
        <MatteCard className="p-4" variant="primary" data-magicpath-id="16" data-magicpath-path="ShiftView.tsx">
          <div className="space-y-2" data-magicpath-id="17" data-magicpath-path="ShiftView.tsx">
            <label htmlFor="shift-hours" className="block text-sm font-medium text-white" data-magicpath-id="18" data-magicpath-path="ShiftView.tsx">
              Shift Hours
            </label>
            <input id="shift-hours" type="number" step="0.5" min="0" max="24" placeholder="e.g., 8.5" value={shiftStore.shiftHours || ''} onChange={handleShiftHoursChange} className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E20074] focus:border-transparent transition-colors" data-magicpath-id="19" data-magicpath-path="ShiftView.tsx" />
          </div>
        </MatteCard>

        {/* Session Controls */}
        <MatteCard className="p-4" variant="primary" data-magicpath-id="20" data-magicpath-path="ShiftView.tsx">
          <div className="flex items-center justify-center space-x-3" data-magicpath-id="21" data-magicpath-path="ShiftView.tsx">
            {!shiftStore.startedAt ? <button onClick={handleStartShift} className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-medium transition-colors" data-magicpath-id="22" data-magicpath-path="ShiftView.tsx">
                <Play className="w-4 h-4" data-magicpath-id="23" data-magicpath-path="ShiftView.tsx" />
                <span data-magicpath-id="24" data-magicpath-path="ShiftView.tsx">Start Shift</span>
              </button> : <>
                <button onClick={isRunning ? handlePauseShift : () => setIsRunning(true)} className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-medium transition-colors" data-magicpath-id="25" data-magicpath-path="ShiftView.tsx">
                  {isRunning ? <Pause className="w-4 h-4" data-magicpath-id="26" data-magicpath-path="ShiftView.tsx" /> : <Play className="w-4 h-4" data-magicpath-id="27" data-magicpath-path="ShiftView.tsx" />}
                  <span data-magicpath-id="28" data-magicpath-path="ShiftView.tsx">{isRunning ? 'Pause' : 'Resume'}</span>
                </button>
                <button onClick={handleEndShift} className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors" data-magicpath-id="29" data-magicpath-path="ShiftView.tsx">
                  <Square className="w-4 h-4" data-magicpath-id="30" data-magicpath-path="ShiftView.tsx" />
                  <span data-magicpath-id="31" data-magicpath-path="ShiftView.tsx">End</span>
                </button>
              </>}
          </div>
        </MatteCard>

        {/* Focus Banner */}
        {focusInfo.remaining > 0 && <MatteCard className="p-4" variant="accent" data-magicpath-id="32" data-magicpath-path="ShiftView.tsx">
            <div className="flex items-center justify-between" data-magicpath-id="33" data-magicpath-path="ShiftView.tsx">
              <div data-magicpath-id="34" data-magicpath-path="ShiftView.tsx">
                <h3 className="text-white font-medium" data-magicpath-id="35" data-magicpath-path="ShiftView.tsx">Today's Focus</h3>
                <p className="text-gray-300 text-sm" data-magicpath-id="36" data-magicpath-path="ShiftView.tsx">
                  {METRIC_LABELS[focusInfo.metric as keyof typeof METRIC_LABELS]} - {focusInfo.remaining} remaining
                </p>
              </div>
              <button onClick={() => onNavigateToCatchUp?.(focusInfo.metric)} className="flex items-center space-x-1 px-3 py-1 bg-[#E20074] hover:bg-[#C21E68] rounded-lg text-white text-xs font-medium transition-colors" data-magicpath-id="37" data-magicpath-path="ShiftView.tsx">
                <span data-magicpath-id="38" data-magicpath-path="ShiftView.tsx">See actions</span>
                <ArrowRight className="w-3 h-3" data-magicpath-id="39" data-magicpath-path="ShiftView.tsx" />
              </button>
            </div>
          </MatteCard>}

        {/* Activations Section */}
        <div className="space-y-3" data-magicpath-id="40" data-magicpath-path="ShiftView.tsx">
          <h2 className="text-lg font-heading text-white" data-magicpath-id="41" data-magicpath-path="ShiftView.tsx">Activations</h2>
          <div className="space-y-2" data-magicpath-id="42" data-magicpath-path="ShiftView.tsx">
            <CounterRow icon={<Phone className="w-5 h-5" data-magicpath-id="44" data-magicpath-path="ShiftView.tsx" />} label="Voice" value={shiftStore.activations.voice} onInc={() => handleIncrement('activations.voice')} onDec={() => handleDecrement('activations.voice')} target={shiftStore.targets.voice} remaining={shiftStore.remaining('voice')} accent="green" data-magicpath-id="43" data-magicpath-path="ShiftView.tsx" />
            <CounterRow icon={<Smartphone className="w-5 h-5" data-magicpath-id="46" data-magicpath-path="ShiftView.tsx" />} label="BTS" value={shiftStore.activations.bts} onInc={() => handleIncrement('activations.bts')} onDec={() => handleDecrement('activations.bts')} target={shiftStore.targets.bts} remaining={shiftStore.remaining('bts')} accent="blue" data-magicpath-id="45" data-magicpath-path="ShiftView.tsx" />
            <CounterRow icon={<Wifi className="w-5 h-5" data-magicpath-id="48" data-magicpath-path="ShiftView.tsx" />} label="TFB" value={shiftStore.activations.tfb} onInc={() => handleIncrement('activations.tfb')} onDec={() => handleDecrement('activations.tfb')} target={shiftStore.targets.tfb} remaining={shiftStore.remaining('tfb')} accent="orange" data-magicpath-id="47" data-magicpath-path="ShiftView.tsx" />
          </div>
        </div>

        {/* Incremental Section */}
        <div className="space-y-3" data-magicpath-id="49" data-magicpath-path="ShiftView.tsx">
          <h2 className="text-lg font-heading text-white" data-magicpath-id="50" data-magicpath-path="ShiftView.tsx">Incremental</h2>
          <div className="space-y-2" data-magicpath-id="51" data-magicpath-path="ShiftView.tsx">
            <CounterRow icon={<Package className="w-5 h-5" data-magicpath-id="53" data-magicpath-path="ShiftView.tsx" />} label="P360 Sold" value={shiftStore.incremental.p360} onInc={() => handleIncrement('incremental.p360')} onDec={() => handleDecrement('incremental.p360')} target={shiftStore.targets.p360} remaining={shiftStore.remaining('p360')} accent="green" data-magicpath-id="52" data-magicpath-path="ShiftView.tsx" />
            <CounterRow icon={<Headphones className="w-5 h-5" data-magicpath-id="55" data-magicpath-path="ShiftView.tsx" />} label="Accessories Sold" value={shiftStore.incremental.acc} onInc={() => handleIncrement('incremental.acc')} onDec={() => handleDecrement('incremental.acc')} target={shiftStore.targets.acc} remaining={shiftStore.remaining('acc')} accent="blue" data-magicpath-id="54" data-magicpath-path="ShiftView.tsx" />
            <CounterRow icon={<Monitor className="w-5 h-5" data-magicpath-id="57" data-magicpath-path="ShiftView.tsx" />} label="Devices Sold" value={shiftStore.incremental.devices} onInc={() => handleIncrement('incremental.devices')} onDec={() => handleDecrement('incremental.devices')} target={shiftStore.targets.devices} remaining={shiftStore.remaining('devices')} accent="orange" data-magicpath-id="56" data-magicpath-path="ShiftView.tsx" />
            <CSATRow data-magicpath-id="58" data-magicpath-path="ShiftView.tsx" />
          </div>
        </div>
      </div>

      {/* Motivation Card */}
      <MotivationCard metric={motivationData.metric} remaining={motivationData.remaining} progress={motivationData.progress} isVisible={showMotivation} onHide={() => setShowMotivation(false)} duration={2500} data-magicpath-id="59" data-magicpath-path="ShiftView.tsx" />

      {/* CSAT Keypad Modal */}
      <KeypadModal isOpen={showKeypad} onClose={() => setShowKeypad(false)} onSubmit={handleCsatSubmit} currentCsatAvg={shiftStore.csatAvg()} currentCsatCount={shiftStore.incremental.csatCount} data-magicpath-id="60" data-magicpath-path="ShiftView.tsx" />

      {/* Sticky Footer */}
      <div className="fixed bottom-20 left-4 right-4 z-40" data-magicpath-id="61" data-magicpath-path="ShiftView.tsx">
        <MatteCard className="p-4" variant="primary" data-magicpath-id="62" data-magicpath-path="ShiftView.tsx">
          <div className="space-y-3" data-magicpath-id="63" data-magicpath-path="ShiftView.tsx">
            {/* Progress Bar */}
            <div data-magicpath-id="64" data-magicpath-path="ShiftView.tsx">
              <div className="flex items-center justify-between mb-2" data-magicpath-id="65" data-magicpath-path="ShiftView.tsx">
                <span className="text-white text-sm font-medium" data-magicpath-id="66" data-magicpath-path="ShiftView.tsx">Daily Progress</span>
                <span className="text-white text-sm font-bold" data-magicpath-id="67" data-magicpath-path="ShiftView.tsx">{overallProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden" data-magicpath-id="68" data-magicpath-path="ShiftView.tsx">
                <motion.div className="h-full bg-gradient-to-r from-[#E20074] to-[#20074] rounded-full" initial={{
                width: 0
              }} animate={{
                width: `${overallProgress}%`
              }} transition={{
                duration: 0.5
              }} data-magicpath-id="69" data-magicpath-path="ShiftView.tsx" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3" data-magicpath-id="70" data-magicpath-path="ShiftView.tsx">
              <button onClick={() => shiftStore.saveToLocal()} className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition-colors" data-magicpath-id="71" data-magicpath-path="ShiftView.tsx">
                <Save className="w-4 h-4" data-magicpath-id="72" data-magicpath-path="ShiftView.tsx" />
                <span data-magicpath-id="73" data-magicpath-path="ShiftView.tsx">Quick Save</span>
              </button>
              <button onClick={handleEndShift} className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-[#E20074] to-[#20074] hover:from-[#C21E68] hover:to-[#1A0660] rounded-xl text-white font-medium transition-all shadow-lg" data-magicpath-id="74" data-magicpath-path="ShiftView.tsx">
                <Target className="w-4 h-4" data-magicpath-id="75" data-magicpath-path="ShiftView.tsx" />
                <span data-magicpath-id="76" data-magicpath-path="ShiftView.tsx">End Shift & Review</span>
              </button>
            </div>

            {/* Mini Motivation */}
            <div className="text-center" data-magicpath-id="77" data-magicpath-path="ShiftView.tsx">
              <p className="text-gray-400 text-xs" data-magicpath-id="78" data-magicpath-path="ShiftView.tsx">
                Keep pushing! You're doing great today! 💪
              </p>
            </div>
          </div>
        </MatteCard>
      </div>
    </div>;
}