"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import GlassCard from './GlassCard';
interface MetricData {
  name: string;
  actual: number;
  target: number;
  category: 'Sales' | 'Attach' | 'Customer' | 'Quality';
  mpid?: string;
}
interface LineChartProps {
  metrics: MetricData[];
  mpid?: string;
}
interface DetailCardProps {
  metric: MetricData;
  position: {
    x: number;
    y: number;
  };
  onClose: () => void;
  mpid?: string;
}
const DetailCard: React.FC<DetailCardProps> = ({
  metric,
  position,
  onClose
}) => {
  const percentage = Math.round(metric.actual / metric.target * 100);
  const status = percentage >= 90 ? 'excellent' : percentage >= 70 ? 'good' : 'needs-improvement';
  const statusColors = {
    excellent: 'text-[#22C55E]',
    good: 'text-[#F59E0B]',
    'needs-improvement': 'text-[#EF4444]'
  };
  const statusMessages = {
    excellent: 'Outstanding performance!',
    good: 'Good progress, keep it up!',
    'needs-improvement': 'Focus area - you can do this!'
  };
  return <motion.div initial={{
    opacity: 0,
    scale: 0.8,
    y: 10
  }} animate={{
    opacity: 1,
    scale: 1,
    y: 0
  }} exit={{
    opacity: 0,
    scale: 0.8,
    y: 10
  }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }} data-magicpath-id="0" data-magicpath-path="LineChart.tsx">
      {/* Backdrop */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} data-magicpath-id="1" data-magicpath-path="LineChart.tsx" />
      
      {/* Detail Card */}
      <motion.div initial={{
      opacity: 0,
      scale: 0.9,
      y: 20
    }} animate={{
      opacity: 1,
      scale: 1,
      y: 0
    }} exit={{
      opacity: 0,
      scale: 0.9,
      y: 20
    }} transition={{
      duration: 0.3,
      ease: "easeOut"
    }} className="relative z-10 w-full max-w-sm" onClick={e => e.stopPropagation()} data-magicpath-id="2" data-magicpath-path="LineChart.tsx">
        <GlassCard className="p-6 border border-gray-600 shadow-2xl" data-magicpath-id="3" data-magicpath-path="LineChart.tsx">
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-200 text-gray-300 hover:text-white" aria-label="Close detail view" data-magicpath-id="4" data-magicpath-path="LineChart.tsx">
            <X size={18} data-magicpath-id="5" data-magicpath-path="LineChart.tsx" />
          </button>

          <div className="space-y-4" data-magicpath-id="6" data-magicpath-path="LineChart.tsx">
            <div data-magicpath-id="7" data-magicpath-path="LineChart.tsx">
              <h4 className="text-white font-semibold text-lg leading-tight pr-8" data-magicpath-id="8" data-magicpath-path="LineChart.tsx">
                {metric.name}
              </h4>
              <span className="inline-block mt-1 px-2 py-1 text-xs text-gray-400 bg-gray-800/50 rounded-full uppercase tracking-wide" data-magicpath-id="9" data-magicpath-path="LineChart.tsx">
                {metric.category}
              </span>
            </div>
            
            <div className="space-y-3" data-magicpath-id="10" data-magicpath-path="LineChart.tsx">
              <div className="flex justify-between items-center" data-magicpath-id="11" data-magicpath-path="LineChart.tsx">
                <span className="text-gray-400 text-sm" data-magicpath-id="12" data-magicpath-path="LineChart.tsx">Progress to Target</span>
                <span className={`text-lg font-bold ${statusColors[status]}`} data-magicpath-id="13" data-magicpath-path="LineChart.tsx">
                  {percentage}%
                </span>
              </div>
              
              <div className="bg-gray-800 rounded-full h-3 overflow-hidden" data-magicpath-id="14" data-magicpath-path="LineChart.tsx">
                <motion.div initial={{
                width: 0
              }} animate={{
                width: `${Math.min(percentage, 100)}%`
              }} transition={{
                duration: 0.8,
                ease: "easeOut"
              }} className={`h-full rounded-full ${status === 'excellent' ? 'bg-gradient-to-r from-[#22C55E] to-[#16A34A]' : status === 'good' ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]' : 'bg-gradient-to-r from-[#EF4444] to-[#DC2626]'}`} data-magicpath-id="15" data-magicpath-path="LineChart.tsx" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2" data-magicpath-id="16" data-magicpath-path="LineChart.tsx">
                <div className="text-center" data-magicpath-id="17" data-magicpath-path="LineChart.tsx">
                  <p className="text-2xl font-bold text-white" data-magicpath-id="18" data-magicpath-path="LineChart.tsx">{metric.actual}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide" data-magicpath-id="19" data-magicpath-path="LineChart.tsx">Actual</p>
                </div>
                <div className="text-center" data-magicpath-id="20" data-magicpath-path="LineChart.tsx">
                  <p className="text-2xl font-bold text-gray-400" data-magicpath-id="21" data-magicpath-path="LineChart.tsx">{metric.target}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide" data-magicpath-id="22" data-magicpath-path="LineChart.tsx">Target</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-700" data-magicpath-id="23" data-magicpath-path="LineChart.tsx">
                <p className="text-sm text-gray-300 italic text-center" data-magicpath-id="24" data-magicpath-path="LineChart.tsx">
                  {statusMessages[status]}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>;
};
const LineChart: React.FC<LineChartProps> = ({
  metrics
}) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricData | null>(null);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const svgRef = useRef<SVGSVGElement>(null);
  const chartWidth = 280;
  const chartHeight = 120;
  const padding = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 20
  };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Calculate percentages for each metric
  const dataPoints = metrics.map((metric, index) => ({
    ...metric,
    percentage: metric.actual / metric.target * 100,
    x: index / (metrics.length - 1) * plotWidth + padding.left,
    y: chartHeight - padding.bottom - metric.actual / metric.target * plotHeight
  }));

  // Create smooth curve path
  const createSmoothPath = (points: typeof dataPoints) => {
    if (points.length < 2) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      if (i === 1) {
        // First curve
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        // Smooth curves for middle points
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y + (curr.y - prev.y) * 0.3;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y - (curr.y - prev.y) * 0.3;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }
    return path;
  };
  const handleDotClick = (metric: MetricData, event: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
      setSelectedMetric(metric);
    }
  };
  const gradientId = "lineGradient";
  const glowId = "lineGlow";
  return <div className="relative" data-magicpath-id="25" data-magicpath-path="LineChart.tsx">
      <svg ref={svgRef} width={chartWidth} height={chartHeight} className="overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`} data-magicpath-id="26" data-magicpath-path="LineChart.tsx">
        <defs data-magicpath-id="27" data-magicpath-path="LineChart.tsx">
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%" data-magicpath-id="28" data-magicpath-path="LineChart.tsx">
            <stop offset="0%" stopColor="#E20074" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#20074" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
          </linearGradient>
          
          <filter id={glowId} data-magicpath-id="29" data-magicpath-path="LineChart.tsx">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" data-magicpath-id="30" data-magicpath-path="LineChart.tsx" />
            <feMerge data-magicpath-id="31" data-magicpath-path="LineChart.tsx"> 
              <feMergeNode in="coloredBlur" data-magicpath-id="32" data-magicpath-path="LineChart.tsx" />
              <feMergeNode in="SourceGraphic" data-magicpath-id="33" data-magicpath-path="LineChart.tsx" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(value => {
        const y = chartHeight - padding.bottom - value / 100 * plotHeight;
        return <g key={value} data-magicpath-id="34" data-magicpath-path="LineChart.tsx">
              <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="rgba(75, 85, 99, 0.3)" strokeWidth="1" strokeDasharray="2,2" />
              <text x={padding.left - 8} y={y + 3} fill="rgba(156, 163, 175, 0.7)" fontSize="10" textAnchor="end" data-magicpath-id="35" data-magicpath-path="LineChart.tsx">
                {value}%
              </text>
            </g>;
      })}

        {/* X-axis labels */}
        {dataPoints.map((point, index) => <text key={index} x={point.x} y={chartHeight - 8} fill="rgba(156, 163, 175, 0.7)" fontSize="9" textAnchor="middle" className="font-medium" data-magicpath-uuid={(point as any)["mpid"] ?? "unsafe"} data-magicpath-id="36" data-magicpath-path="LineChart.tsx">
            {point.name.split(' ')[0]}
          </text>)}

        {/* Animated line path */}
        <motion.path d={createSmoothPath(dataPoints)} fill="none" stroke={`url(#${gradientId})`} strokeWidth="3" filter={`url(#${glowId})`} initial={{
        pathLength: 0
      }} animate={{
        pathLength: 1
      }} transition={{
        duration: 2,
        ease: "easeInOut"
      }} data-magicpath-id="37" data-magicpath-path="LineChart.tsx" />

        {/* Animated dots */}
        {dataPoints.map((point, index) => {
        const percentage = point.percentage;
        const status = percentage >= 90 ? 'excellent' : percentage >= 70 ? 'good' : 'needs-improvement';
        const dotColor = status === 'excellent' ? '#22C55E' : status === 'good' ? '#F59E0B' : '#EF4444';
        return <motion.g key={index} initial={{
          scale: 0,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          delay: index * 0.2 + 0.5,
          duration: 0.4
        }} data-magicpath-uuid={(point as any)["mpid"] ?? "unsafe"} data-magicpath-id="38" data-magicpath-path="LineChart.tsx">
              {/* Outer glow ring */}
              <circle cx={point.x} cy={point.y} r="8" fill="none" stroke={dotColor} strokeWidth="1" opacity="0.3" data-magicpath-uuid={(point as any)["mpid"] ?? "unsafe"} data-magicpath-id="39" data-magicpath-path="LineChart.tsx" />
              
              {/* Main dot */}
              <circle cx={point.x} cy={point.y} r="5" fill={dotColor} className="cursor-pointer hover:scale-110 transition-transform" onClick={e => handleDotClick(point, e)} style={{
            filter: `drop-shadow(0 0 6px ${dotColor}40)`
          }} data-magicpath-uuid={(point as any)["mpid"] ?? "unsafe"} data-magicpath-id="40" data-magicpath-path="LineChart.tsx" />
              
              {/* Inner highlight */}
              <circle cx={point.x} cy={point.y} r="2" fill="white" opacity="0.8" className="pointer-events-none" data-magicpath-uuid={(point as any)["mpid"] ?? "unsafe"} data-magicpath-id="41" data-magicpath-path="LineChart.tsx" />
            </motion.g>;
      })}
      </svg>

      {/* Y-axis label */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-center" data-magicpath-id="42" data-magicpath-path="LineChart.tsx">
        <span className="text-xs text-gray-500 font-medium" data-magicpath-id="43" data-magicpath-path="LineChart.tsx">% to Target</span>
      </div>

      {/* X-axis label */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4" data-magicpath-id="44" data-magicpath-path="LineChart.tsx">
        <span className="text-xs text-gray-500 font-medium" data-magicpath-id="45" data-magicpath-path="LineChart.tsx">Metrics</span>
      </div>

      {/* Detail card overlay */}
      <AnimatePresence data-magicpath-id="46" data-magicpath-path="LineChart.tsx">
        {selectedMetric && <DetailCard metric={selectedMetric} position={mousePosition} onClose={() => setSelectedMetric(null)} data-magicpath-id="47" data-magicpath-path="LineChart.tsx" />}
      </AnimatePresence>
    </div>;
};
export default LineChart;