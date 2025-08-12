"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Target, ArrowRight, Phone, Smartphone, Wifi, Package, Headphones, Monitor, Save, CheckCircle } from 'lucide-react';
import MatteCard from './GlassCard';
import CounterRow from './CounterRow';
import KeypadModal from './KeypadModal';
import MotivationCard from './MotivationCard';
import ShiftSummaryModal from './ShiftSummaryModal';
import { useShiftStore } from './stores-useShiftStore';
import { useCatchUpStore } from './CatchUpStore';
interface ShiftViewProps {
  onNavigateToCatchUp?: (metric?: string) => void;
}
const METRIC_LABELS = {
  voice: 'Voice Activations',
  bts: 'BTS Activations',
  tfb: 'TFB Activations',
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

// Add motivational messages mapping
const MOTIVATIONAL_MESSAGES = {
  voice: "Strong conversations = strong wins.",
  bts: "Trade-ins unlock upgrades.",
  tfb: "Business lines build big days.",
  p360: "Protect every device.",
  acc: "Accessories complete the package.",
  devices: "One more device makes a difference.",
  csat: "Great service shows—aim for high scores."
};
export default function ShiftView({
  onNavigateToCatchUp
}: ShiftViewProps) {
  const shiftStore = useShiftStore();
  const catchUpStore = useCatchUpStore();
  const [showKeypad, setShowKeypad] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  // Local input state for shift hours with stricter typing during init
  const [localShiftHours, setLocalShiftHours] = useState<number | undefined>(
    typeof shiftStore.shiftHours === 'number' ? shiftStore.shiftHours : undefined
  );
  const [shiftHoursError, setShiftHoursError] = useState<string | null>(null);
  const [motivationData, setMotivationData] = useState({
    metric: '',
    remaining: 0,
    progress: 0
  });

  // Add toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const handleStartShift = () => {
    shiftStore.startShift();
  };
  const handleEndShift = () => {
    shiftStore.endShift();
    setShowSummaryModal(true);
  };
  const handleFinishShift = () => {
    setShowSummaryModal(true);
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
      setLocalShiftHours(undefined);
      setShiftHoursError('Enter a number (e.g., 8.5)');
      return;
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      setShiftHoursError('Invalid number');
      return;
    }
    if (parsed < 0) {
      setShiftHoursError('Must be ≥ 0');
    } else {
      setShiftHoursError(null);
    }
    setLocalShiftHours(parsed);
  };

  const roundToNearestHalf = (value: number): number => {
    return Math.round(value * 2) / 2;
  };

  const handleShiftHoursBlur = () => {
    if (localShiftHours === undefined) return;
    const clamped = Math.max(0, localShiftHours);
    const normalized = roundToNearestHalf(clamped);
    setLocalShiftHours(normalized);
    shiftStore.setShiftHours(normalized);
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

    // Show toast with motivational message
    showToastMessage(metric, remaining);
  };
  const showToastMessage = (metric: string, remaining: number) => {
    const baseMessage = MOTIVATIONAL_MESSAGES[metric as keyof typeof MOTIVATIONAL_MESSAGES] || "Keep pushing forward!";
    const remainingText = remaining > 0 ? ` ${remaining} to goal.` : "";
    setToastMessage(baseMessage + remainingText);
    setShowToast(true);

    // Auto-hide toast after 1.5 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 1500);
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

  // Provide a default shift hours value when none is persisted
  useEffect(() => {
    if (shiftStore.shiftHours == null) {
      shiftStore.setShiftHours(8.0);
      setLocalShiftHours(8.0);
      setShiftHoursError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep local state in sync if store value is updated externally (e.g., persisted load)
  useEffect(() => {
    if (typeof shiftStore.shiftHours === 'number') {
      setLocalShiftHours(shiftStore.shiftHours);
      setShiftHoursError(null);
    }
  }, [shiftStore.shiftHours]);

  // Hydrate default targets from Catch-Up if available; otherwise use local sane defaults.
  useEffect(() => {
    const targetsEmpty = Object.keys(shiftStore.targets || {}).length === 0;
    if (!targetsEmpty) return;

    const FALLBACK_SHIFT_TARGETS = {
      voice: 3,
      bts: 1,
      tfb: 1,
      p360: 2,
      acc: 3,
      devices: 2
    } as const;

    const calculations = catchUpStore?.state?.calculations || [];
    const getPerShift = (code: string): number => {
      const metric = calculations.find((m) => m.code === code);
      if (!metric || isNaN(metric.perShiftToCatchUp)) return 0;
      // Round up to whole actions for daily targets
      return Math.max(0, Math.ceil(metric.perShiftToCatchUp));
    };

    const derivedTargets = {
      voice: getPerShift('CV') || FALLBACK_SHIFT_TARGETS.voice,
      bts: getPerShift('BTS') || FALLBACK_SHIFT_TARGETS.bts,
      tfb: getPerShift('TFB') || FALLBACK_SHIFT_TARGETS.tfb,
      p360: getPerShift('P360') || FALLBACK_SHIFT_TARGETS.p360,
      acc: getPerShift('APP') || FALLBACK_SHIFT_TARGETS.acc,
      devices: FALLBACK_SHIFT_TARGETS.devices
    };

    shiftStore.syncTargetsFromCatchUp(derivedTargets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catchUpStore?.state?.calculations]);

  // Find metric with largest remaining/deficit for focus banner (memoized)
  const focusInfo = useMemo(() => {
    const metricsToCheck = ['voice', 'bts', 'tfb', 'p360', 'acc', 'devices'];
    let maxRemaining = 0;
    let focusMetric = 'voice';
    for (const metric of metricsToCheck) {
      const valueRemaining = shiftStore.remaining(metric);
      if (valueRemaining > maxRemaining) {
        maxRemaining = valueRemaining;
        focusMetric = metric;
      }
    }
    return { metric: focusMetric, remaining: maxRemaining };
  }, [
    shiftStore.activations,
    shiftStore.incremental,
    shiftStore.targets,
    shiftStore.shiftHours
  ]);

  // Overall progress percentage (memoized)
  const overallProgress = useMemo(() => {
    const metricsWithTargets = ['voice', 'bts', 'tfb', 'p360', 'acc', 'devices'].filter(
      (metric) => shiftStore.targets[metric as keyof typeof shiftStore.targets]
    );
    if (metricsWithTargets.length === 0) return 0;
    const totalProgress = metricsWithTargets.reduce((sum, metric) => sum + shiftStore.progressPct(metric), 0);
    return Math.round(totalProgress / metricsWithTargets.length);
  }, [
    shiftStore.activations,
    shiftStore.incremental,
    shiftStore.targets,
    shiftStore.shiftHours
  ]);

  // Summary data for modal (memoized)
  const summaryData = useMemo(() => {
    const totalActivations =
      shiftStore.activations.voice + shiftStore.activations.bts + shiftStore.activations.tfb;
    const totalIncremental =
      shiftStore.incremental.p360 + shiftStore.incremental.acc + shiftStore.incremental.devices;
    const averageSurveyScore = shiftStore.csatAvg();
    return { totalActivations, totalIncremental, averageSurveyScore };
  }, [
    shiftStore.activations,
    shiftStore.incremental,
    shiftStore.shiftHours
  ]);
  const CSATRow = () => {
    const csatAvgFromStore = shiftStore.csatAvg();
    const csatCountFromStore = shiftStore.incremental.csatCount;
    // Fallback from Catch-Up metrics if store has no CSAT data
    const csatMetric = catchUpStore?.state?.metrics?.find((m: any) => m.code === 'CSAT');
    const fallbackCount = csatMetric?.csatCount ?? 0;
    const fallbackAvg = csatMetric && fallbackCount > 0 && csatMetric.csatTotalScore
      ? csatMetric.csatTotalScore / fallbackCount
      : 0;
    const csatCount = csatCountFromStore > 0 ? csatCountFromStore : fallbackCount;
    const csatAvg = csatCountFromStore > 0 ? csatAvgFromStore : fallbackAvg;
    return <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <span className="text-white font-medium text-sm">Survey Score</span>
              <div className="text-xs text-gray-400">
                {csatAvg.toFixed(1)} avg ({csatCount} responses)
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-xl font-bold text-white">
              {csatAvg.toFixed(1)}
            </div>
            <button onClick={() => setShowKeypad(true)} className="px-4 py-2 bg-[#E20074] hover:bg-[#C21E68] rounded-lg text-white text-sm font-medium transition-colors">
              Add Score
            </button>
          </div>
        </div>
      </div>;
  };
  return <div className="min-h-screen bg-gradient-to-br from-gray-950 via-[#20074] to-gray-900 p-4 pb-80">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pt-4 mb-6">
          <div>
            <h1 className="text-2xl font-display text-white">Shift</h1>
            <p className="text-sm text-gray-400 mt-1">Let's make this shift count. Every sale moves you closer.</p>
          </div>
          <div className="px-3 py-1 bg-gray-800/50 rounded-full text-sm text-gray-300">
            {shiftStore.date}
          </div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && <motion.div initial={{
          opacity: 0,
          y: -50,
          scale: 0.9
        }} animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }} exit={{
          opacity: 0,
          y: -50,
          scale: 0.9
        }} transition={{
          duration: 0.3,
          ease: "easeOut"
        }} className="fixed top-20 left-4 right-4 z-50 mx-auto max-w-md">
              <div className="bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                  <p className="text-white text-sm font-medium">{toastMessage}</p>
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>

        {/* Shift Hours Input */}
        <MatteCard className="p-4" variant="primary">
          <div className="space-y-2">
            <label htmlFor="shift-hours" className="block text-sm font-medium text-white">
              Shift Hours
            </label>
            <input
              id="shift-hours"
              type="number"
              step="0.5"
              min="0"
              placeholder="e.g., 8.5"
              value={localShiftHours ?? ''}
              onChange={handleShiftHoursChange}
              onBlur={handleShiftHoursBlur}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E20074] focus:border-transparent transition-colors"
            />
            <p className={"text-xs mt-1 " + (shiftHoursError ? 'text-red-400' : 'text-gray-400')}>
              {shiftHoursError || 'e.g., 8.5'}
            </p>
          </div>
        </MatteCard>

        {/* Session Controls */}
        <MatteCard className="p-4" variant="primary">
          <div className="flex items-center justify-center space-x-3">
            {!shiftStore.startedAt ? <button onClick={handleStartShift} className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-medium transition-colors">
                <Play className="w-4 h-4" />
                <span>Start Shift</span>
              </button> : <button onClick={handleEndShift} className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-colors">
                <Square className="w-4 h-4" />
                <span>End Shift</span>
              </button>}
          </div>
        </MatteCard>

        {/* Focus Banner */}
        {focusInfo.remaining > 0 && <MatteCard className="p-4" variant="accent">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Today's Focus</h3>
                <p className="text-gray-300 text-sm">
                  {METRIC_LABELS[focusInfo.metric as keyof typeof METRIC_LABELS]} - {focusInfo.remaining} remaining
                </p>
              </div>
              <button onClick={() => onNavigateToCatchUp?.(focusInfo.metric)} className="flex items-center space-x-1 px-3 py-1 bg-[#E20074] hover:bg-[#C21E68] rounded-lg text-white text-xs font-medium transition-colors">
                <span>See actions</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </MatteCard>}

        {/* Activations Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-heading text-white">Activations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CounterRow icon={<Phone className="w-5 h-5" />} label="Voice Activations" value={shiftStore.activations.voice} onInc={() => handleIncrement('activations.voice')} onDec={() => handleDecrement('activations.voice')} target={shiftStore.targets.voice} remaining={shiftStore.remaining('voice')} accent="green" />
            <CounterRow icon={<Smartphone className="w-5 h-5" />} label="BTS Activations" value={shiftStore.activations.bts} onInc={() => handleIncrement('activations.bts')} onDec={() => handleDecrement('activations.bts')} target={shiftStore.targets.bts} remaining={shiftStore.remaining('bts')} accent="blue" />
            <CounterRow icon={<Wifi className="w-5 h-5" />} label="TFB Activations" value={shiftStore.activations.tfb} onInc={() => handleIncrement('activations.tfb')} onDec={() => handleDecrement('activations.tfb')} target={shiftStore.targets.tfb} remaining={shiftStore.remaining('tfb')} accent="orange" />
          </div>
        </div>

        {/* Incremental Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-heading text-white">Incremental</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CounterRow icon={<Package className="w-5 h-5" />} label="P360 Sold" value={shiftStore.incremental.p360} onInc={() => handleIncrement('incremental.p360')} onDec={() => handleDecrement('incremental.p360')} target={shiftStore.targets.p360} remaining={shiftStore.remaining('p360')} accent="green" />
            <CounterRow icon={<Headphones className="w-5 h-5" />} label="Accessories Sold" value={shiftStore.incremental.acc} onInc={() => handleIncrement('incremental.acc')} onDec={() => handleDecrement('incremental.acc')} target={shiftStore.targets.acc} remaining={shiftStore.remaining('acc')} accent="blue" />
            <CounterRow icon={<Monitor className="w-5 h-5" />} label="Devices Sold" value={shiftStore.incremental.devices} onInc={() => handleIncrement('incremental.devices')} onDec={() => handleDecrement('incremental.devices')} target={shiftStore.targets.devices} remaining={shiftStore.remaining('devices')} accent="orange" />
            <div className="sm:col-span-2">
              <CSATRow />
            </div>
          </div>
        </div>
      </div>

      {/* Motivation Card - uses internal auto-dismiss; duration ignored */}
      <MotivationCard
        metric={motivationData.metric}
        remaining={motivationData.remaining}
        progress={motivationData.progress}
        isVisible={showMotivation}
        onHide={() => setShowMotivation(false)}
      />

      {/* CSAT Keypad Modal */}
      <KeypadModal isOpen={showKeypad} onClose={() => setShowKeypad(false)} onSubmit={handleCsatSubmit} currentCsatAvg={shiftStore.csatAvg()} currentCsatCount={shiftStore.incremental.csatCount} />

      {/* Sticky Footer */}
      <div className="fixed bottom-20 left-4 right-4 z-40">
        <MatteCard className="p-4" variant="primary">
          <div className="space-y-3">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">Daily Progress</span>
                <span className="text-white text-sm font-bold">{overallProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-[#E20074] to-[#20074] rounded-full" initial={{
                width: 0
              }} animate={{
                width: `${overallProgress}%`
              }} transition={{
                duration: 0.5
              }} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button onClick={() => shiftStore.saveToLocal()} className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition-colors">
                <Save className="w-4 h-4" />
                <span>Quick Save</span>
              </button>
              <button onClick={handleFinishShift} className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-[#E20074] to-[#20074] hover:from-[#C21E68] hover:to-[#1A0660] rounded-xl text-white font-medium transition-all shadow-lg">
                <Target className="w-4 h-4" />
                <span>Finish Shift</span>
              </button>
            </div>

            {/* Mini Motivation */}
            <div className="text-center">
              <p className="text-gray-400 text-xs">
                Keep pushing! You're doing great today! 💪
              </p>
            </div>
          </div>
        </MatteCard>
      </div>

      {/* Shift Summary Modal */}
      <ShiftSummaryModal isOpen={showSummaryModal} onClose={() => setShowSummaryModal(false)} totalActivations={summaryData.totalActivations} totalIncremental={summaryData.totalIncremental} averageSurveyScore={summaryData.averageSurveyScore} shiftHours={shiftStore.shiftHours} />
    </div>;
}