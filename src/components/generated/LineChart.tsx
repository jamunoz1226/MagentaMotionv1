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
  }} className="absolute z-50" style={{
    left: Math.max(16, Math.min(position.x - 120, window.innerWidth - 256)),
    top: position.y - 140
  }} data-magicpath-id="0" data-magicpath-path="LineChart.tsx">
      <GlassCard className="p-4 w-60 border border-gray-600" data-magicpath-id="1" data-magicpath-path="LineChart.tsx">
        <div className="flex justify-between items-start mb-3" data-magicpath-id="2" data-magicpath-path="LineChart.tsx">
          <h4 className="text-white font-semibold text-sm leading-tight" data-magicpath-id="3" data-magicpath-path="LineChart.tsx">{metric.name}</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1" data-magicpath-id="4" data-magicpath-path="LineChart.tsx">
            <X className="w-4 h-4" data-magicpath-id="5" data-magicpath-path="LineChart.tsx" />
          </button>
        </div>
        
        <div className="space-y-2" data-magicpath-id="6" data-magicpath-path="LineChart.tsx">
          <div className="flex justify-between items-center" data-magicpath-id="7" data-magicpath-path="LineChart.tsx">
            <span className="text-gray-400 text-xs" data-magicpath-id="8" data-magicpath-path="LineChart.tsx">Progress</span>
            <span className={`text-sm font-bold ${statusColors[status]}`} data-magicpath-id="9" data-magicpath-path="LineChart.tsx">
              {percentage}%
            </span>
          </div>
          
          <div className="bg-gray-800 rounded-full h-2 overflow-hidden" data-magicpath-id="10" data-magicpath-path="LineChart.tsx">
            <motion.div initial={{
            width: 0
          }} animate={{
            width: `${Math.min(percentage, 100)}%`
          }} transition={{
            duration: 0.8,
            ease: "easeOut"
          }} className={`h-full rounded-full ${status === 'excellent' ? 'bg-[#22C55E]' : status === 'good' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`} data-magicpath-id="11" data-magicpath-path="LineChart.tsx" />
          </div>
          
          <div className="flex justify-between text-xs" data-magicpath-id="12" data-magicpath-path="LineChart.tsx">
            <span className="text-gray-500" data-magicpath-id="13" data-magicpath-path="LineChart.tsx">Actual: {metric.actual}</span>
            <span className="text-gray-500" data-magicpath-id="14" data-magicpath-path="LineChart.tsx">Target: {metric.target}</span>
          </div>
          
          <p className="text-xs text-gray-400 mt-2 italic" data-magicpath-id="15" data-magicpath-path="LineChart.tsx">
            {statusMessages[status]}
          </p>
          
          <div className="mt-3 pt-2 border-t border-gray-700" data-magicpath-id="16" data-magicpath-path="LineChart.tsx">
            <span className="text-xs text-gray-500 uppercase tracking-wide" data-magicpath-id="17" data-magicpath-path="LineChart.tsx">
              {metric.category}
            </span>
          </div>
        </div>
      </GlassCard>
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
  return <div className="relative" data-magicpath-id="18" data-magicpath-path="LineChart.tsx">
      <svg ref={svgRef} width={chartWidth} height={chartHeight} className="overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`} data-magicpath-id="19" data-magicpath-path="LineChart.tsx">
        <defs data-magicpath-id="20" data-magicpath-path="LineChart.tsx">
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%" data-magicpath-id="21" data-magicpath-path="LineChart.tsx">
            <stop offset="0%" stopColor="#E20074" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
          </linearGradient>
          
          <filter id={glowId} data-magicpath-id="22" data-magicpath-path="LineChart.tsx">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" data-magicpath-id="23" data-magicpath-path="LineChart.tsx" />
            <feMerge data-magicpath-id="24" data-magicpath-path="LineChart.tsx"> 
              <feMergeNode in="coloredBlur" data-magicpath-id="25" data-magicpath-path="LineChart.tsx" />
              <feMergeNode in="SourceGraphic" data-magicpath-id="26" data-magicpath-path="LineChart.tsx" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(value => {
        const y = chartHeight - padding.bottom - value / 100 * plotHeight;
        return <g key={value} data-magicpath-id="27" data-magicpath-path="LineChart.tsx">
              <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="rgba(75, 85, 99, 0.3)" strokeWidth="1" strokeDasharray="2,2" />
              <text x={padding.left - 8} y={y + 3} fill="rgba(156, 163, 175, 0.7)" fontSize="10" textAnchor="end" data-magicpath-id="28" data-magicpath-path="LineChart.tsx">
                {value}%
              </text>
            </g>;
      })}

        {/* X-axis labels */}
        {dataPoints.map((point, index) => <text key={index} x={point.x} y={chartHeight - 8} fill="rgba(156, 163, 175, 0.7)" fontSize="9" textAnchor="middle" className="font-medium" data-magicpath-uuid={(point as any)["mpid"] ?? "unsafe"} data-magicpath-id="29" data-magicpath-path="LineChart.tsx">
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
      }} data-magicpath-id="30" data-magicpath-path="LineChart.tsx" />

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
        }} data-magicpath-uuid={(point as any)["mpid"] ?? "unsafe"} data-magicpath-id="31" data-magicpath-path="LineChart.tsx">
              {/* Outer glow ring */}
              <circle cx={point.x} cy={point.y} r="8" fill="none" stroke={dotColor} strokeWidth="1" opacity="0.3" data-magicpath-uuid={(point as any)["mpid"] ?? "unsafe"} data-magicpath-id="32" data-magicpath-path="LineChart.tsx" />
              
              {/* Main dot */}
              <circle cx={point.x} cy={point.y} r="5" fill={dotColor} className="cursor-pointer hover:scale-110 transition-transform" onClick={e => handleDotClick(point, e)} style={{
            filter: `drop-shadow(0 0 6px ${dotColor}40)`
          }} data-magicpath-uuid={(point as any)["mpid"] ?? "unsafe"} data-magicpath-id="33" data-magicpath-path="LineChart.tsx" />
              
              {/* Inner highlight */}
              <circle cx={point.x} cy={point.y} r="2" fill="white" opacity="0.8" className="pointer-events-none" data-magicpath-uuid={(point as any)["mpid"] ?? "unsafe"} data-magicpath-id="34" data-magicpath-path="LineChart.tsx" />
            </motion.g>;
      })}
      </svg>

      {/* Y-axis label */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-center" data-magicpath-id="35" data-magicpath-path="LineChart.tsx">
        <span className="text-xs text-gray-500 font-medium" data-magicpath-id="36" data-magicpath-path="LineChart.tsx">% to Target</span>
      </div>

      {/* X-axis label */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4" data-magicpath-id="37" data-magicpath-path="LineChart.tsx">
        <span className="text-xs text-gray-500 font-medium" data-magicpath-id="38" data-magicpath-path="LineChart.tsx">Metrics</span>
      </div>

      {/* Detail card overlay */}
      <AnimatePresence data-magicpath-id="39" data-magicpath-path="LineChart.tsx">
        {selectedMetric && <DetailCard metric={selectedMetric} position={mousePosition} onClose={() => setSelectedMetric(null)} data-magicpath-id="40" data-magicpath-path="LineChart.tsx" />}
      </AnimatePresence>
    </div>;
};
export default LineChart;