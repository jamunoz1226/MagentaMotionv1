"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import GlassCard from './GlassCard';
import { calcPopoverPlacement } from '../../utils/calcPopoverPlacement';
import { zIndex } from '../../settings/z';
interface MetricData {
  name: string;
  actual: number;
  target: number;
  category: 'Sales' | 'Attach' | 'Customer' | 'Quality';
}
interface LineChartProps {
  metrics: MetricData[];
}
interface DetailCardProps {
  metric: MetricData;
  position: {
    x: number;
    y: number;
  };
  onClose: () => void;
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

  // Get full metric name for tooltip display
  const metricLabelMap: {
    [key: string]: string;
  } = {
    'Total Revenue': 'Consumer Voice',
    'New Lines': 'Back to School',
    'Accessories': 'Total Family Bundle',
    'Insurance': 'Protection 360 Attachment',
    'NPS Score': 'Application Performance',
    'Call Quality': 'Customer Satisfaction',
    'Sales Quality': 'Sales Quality Score'
  };
  const fullMetricName = metricLabelMap[metric.name] || metric.name;
  return <GlassCard className="p-6 border border-gray-600 shadow-2xl mx-4">
      {/* Close Button */}
      <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-200 text-gray-300 hover:text-white" aria-label="Close detail view">
        <X size={18} />
      </button>

      <div className="space-y-4">
        <div>
          <h4 className="text-white font-semibold text-lg leading-tight pr-8">
            {fullMetricName}
          </h4>
          <span className="inline-block mt-1 px-2 py-1 text-xs text-gray-400 bg-gray-800/50 rounded-full uppercase tracking-wide">
            {metric.category}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Progress to Target</span>
            <span className={`text-lg font-bold ${statusColors[status]}`}>
              {percentage}%
            </span>
          </div>
          
          <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
            <motion.div initial={{
            width: 0
          }} animate={{
            width: `${Math.min(percentage, 100)}%`
          }} transition={{
            duration: 0.8,
            ease: "easeOut"
          }} className={`h-full rounded-full ${status === 'excellent' ? 'bg-gradient-to-r from-[#22C55E] to-[#16A34A]' : status === 'good' ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]' : 'bg-gradient-to-r from-[#EF4444] to-[#DC2626]'}`} />
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{metric.actual}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Actual</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-400">{metric.target}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Target</p>
            </div>
          </div>
          
          <div className="pt-3 border-t border-gray-700">
            <p className="text-sm text-gray-300 italic text-center">
              {statusMessages[status]}
            </p>
          </div>
        </div>
      </div>
    </GlassCard>;
};
const LineChart: React.FC<LineChartProps> = ({
  metrics
}) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricData | null>(null);
  const [anchorRect, setAnchorRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [detailPos, setDetailPos] = useState<{ left: number; top: number } | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const prevFocusRef = useRef<Element | null>(null);
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

  // Metric label mapping for display and tooltips
  const metricLabelMap: {
    [key: string]: {
      short: string;
      full: string;
    };
  } = {
    'Total Revenue': {
      short: 'CV',
      full: 'Consumer Voice'
    },
    'New Lines': {
      short: 'BTS',
      full: 'Back to School'
    },
    'Accessories': {
      short: 'TFB',
      full: 'Total Family Bundle'
    },
    'Insurance': {
      short: 'P360 Attach',
      full: 'Protection 360 Attachment'
    },
    'NPS Score': {
      short: 'APP',
      full: 'Application Performance'
    },
    'Call Quality': {
      short: 'CSAT',
      full: 'Customer Satisfaction'
    }
  };

  // If we have exactly 6 metrics, add Sales Quality as the 7th
  const displayMetrics = metrics.length === 6 ? [...metrics, {
    name: 'Sales Quality',
    actual: 88,
    target: 95,
    category: 'Quality' as const
  }] : metrics;

  // Update the metric label map to include Sales Quality
  metricLabelMap['Sales Quality'] = {
    short: 'Sales Quality',
    full: 'Sales Quality Score'
  };

  // Calculate percentages for each metric
  const dataPoints = displayMetrics.map((metric, index) => {
    // Calculate evenly distributed positions across full chart width
    const x = padding.left + index * plotWidth / (displayMetrics.length - 1);
    return {
      ...metric,
      percentage: metric.actual / metric.target * 100,
      x: x,
      y: chartHeight - padding.bottom - metric.actual / metric.target * plotHeight,
      displayLabel: metricLabelMap[metric.name]?.short || metric.name.split(' ')[0],
      fullName: metricLabelMap[metric.name]?.full || metric.name
    };
  });

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
  const handleDotClick = (metric: MetricData & {
    fullName: string;
  }, event: React.MouseEvent) => {
    const svgBounds = svgRef.current?.getBoundingClientRect();
    if (svgBounds) {
      // Anchor rect around the clicked point (approx 12x12 box)
      const ax = event.clientX;
      const ay = event.clientY;
      setAnchorRect({ x: ax - 6, y: ay - 6, width: 12, height: 12 });
      setSelectedMetric(metric);
      // Notify global listeners that chart interaction occurred
      window.dispatchEvent(new CustomEvent('chart-interaction', { detail: { type: 'click' } }));
    }
  };
  const gradientId = "lineGradient";
  const glowId = "lineGlow";
  // Outside click and ESC handling for detail popover
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSelectedMetric(null);
      }
    }
    function onPointerDown(e: MouseEvent) {
      if (!selectedMetric) return;
      const detailEl = detailRef.current;
      const svgEl = svgRef.current;
      if (!detailEl || !svgEl) return;
      const withinDetail = detailEl.contains(e.target as Node);
      const withinChart = svgEl.contains(e.target as Node);
      const activeInsideDetail = withinDetail && detailEl.contains(document.activeElement);
      if (!withinDetail && !activeInsideDetail && !withinChart) {
        setSelectedMetric(null);
      }
    }
    if (selectedMetric) {
      // focus management
      prevFocusRef.current = document.activeElement;
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('mousedown', onPointerDown);
      return () => {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('mousedown', onPointerDown);
      };
    }
  }, [selectedMetric]);

  // Position calculation when anchorRect or size changes
  useEffect(() => {
    if (!anchorRect || !selectedMetric) return;
    const svgBounds = svgRef.current?.getBoundingClientRect();
    const popEl = detailRef.current;
    if (!svgBounds || !popEl) return;
    const popRect = { width: popEl.offsetWidth || 320, height: popEl.offsetHeight || 220 };
    const placement = calcPopoverPlacement(
      anchorRect,
      { x: svgBounds.left, y: svgBounds.top, width: svgBounds.width, height: svgBounds.height },
      popRect,
      { preferred: 'top', offset: 8, containerPadding: 8, avoidAnchorCover: true }
    );
    setDetailPos({ left: placement.left, top: placement.top });
  }, [anchorRect, selectedMetric]);

  // Recalculate on viewport resize/orientation change
  useEffect(() => {
    function recalc() {
      if (!selectedMetric || !anchorRect) return;
      const svgBounds = svgRef.current?.getBoundingClientRect();
      const popEl = detailRef.current;
      if (!svgBounds || !popEl) return;
      const popRect = { width: popEl.offsetWidth || 320, height: popEl.offsetHeight || 220 };
      const placement = calcPopoverPlacement(
        anchorRect,
        { x: svgBounds.left, y: svgBounds.top, width: svgBounds.width, height: svgBounds.height },
        popRect,
        { preferred: 'top', offset: 8, containerPadding: 8, avoidAnchorCover: true }
      );
      setDetailPos({ left: placement.left, top: placement.top });
    }
    if (selectedMetric) {
      window.addEventListener('resize', recalc);
      window.addEventListener('orientationchange', recalc as any);
      return () => {
        window.removeEventListener('resize', recalc);
        window.removeEventListener('orientationchange', recalc as any);
      };
    }
  }, [selectedMetric, anchorRect]);

  // Notify other UI about detail open/close
  useEffect(() => {
    if (selectedMetric) {
      window.dispatchEvent(new CustomEvent('line-detail-open'));
      return () => window.dispatchEvent(new CustomEvent('line-detail-close'));
    }
  }, [selectedMetric]);

  // Emit interaction events for hover/pan
  const onChartPointerActivity = () => {
    window.dispatchEvent(new CustomEvent('chart-interaction', { detail: { type: 'hover' } }));
  };

  return <div className="relative">
      <svg
        ref={svgRef}
        width={chartWidth}
        height={chartHeight}
        className="overflow-visible"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        onMouseMove={onChartPointerActivity}
        onPointerDown={onChartPointerActivity}
        onTouchStart={onChartPointerActivity}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E20074" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#20074" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
          </linearGradient>
          
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge> 
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(value => {
        const y = chartHeight - padding.bottom - value / 100 * plotHeight;
        return <g key={value}>
              <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="rgba(75, 85, 99, 0.3)" strokeWidth="1" strokeDasharray="2,2" />
              <text x={padding.left - 8} y={y + 3} fill="rgba(156, 163, 175, 0.7)" fontSize="10" textAnchor="end">
                {value}%
              </text>
            </g>;
      })}

        {/* X-axis labels */}
        {dataPoints.map((point, index) => {
        const words = point.displayLabel.split(' ');
        // Calculate evenly distributed positions across full chart width
        const labelX = padding.left + index * plotWidth / (displayMetrics.length - 1);
        if (words.length > 1) {
          // Multi-word labels: split into two lines
          return <g key={index}>
                <text x={labelX} y={chartHeight - 16} fill="rgba(156, 163, 175, 0.7)" fontSize="9" textAnchor="middle" className="font-medium">
                  {words[0]}
                </text>
                <text x={labelX} y={chartHeight - 6} fill="rgba(156, 163, 175, 0.7)" fontSize="9" textAnchor="middle" className="font-medium">
                  {words.slice(1).join(' ')}
                </text>
              </g>;
        } else {
          // Single word labels: keep on one line
          return <text key={index} x={labelX} y={chartHeight - 8} fill="rgba(156, 163, 175, 0.7)" fontSize="9" textAnchor="middle" className="font-medium">
                {point.displayLabel}
              </text>;
        }
      })}

        {/* Animated line path */}
        <motion.path d={createSmoothPath(dataPoints)} fill="none" stroke={`url(#${gradientId})`} strokeWidth="3" filter={`url(#${glowId})`} initial={{
        pathLength: 0
      }} animate={{
        pathLength: 1
      }} transition={{
        duration: 2,
        ease: "easeInOut"
      }} />

        {/* Animated dots */}
        {dataPoints.map((point, index) => {
        const percentage = point.percentage;
        const status = percentage >= 90 ? 'excellent' : percentage >= 70 ? 'good' : 'needs-improvement';
        const dotColor = status === 'excellent' ? '#22C55E' : status === 'good' ? '#F59E0B' : '#EF4444';
        // Calculate evenly distributed positions across full chart width
        const dotX = padding.left + index * plotWidth / (displayMetrics.length - 1);
        return <motion.g key={index} initial={{
          scale: 0,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          delay: index * 0.2 + 0.5,
          duration: 0.4
        }}>
              {/* Outer glow ring */}
              <circle cx={dotX} cy={point.y} r="8" fill="none" stroke={dotColor} strokeWidth="1" opacity="0.3" />
              
              {/* Main dot */}
              <circle cx={dotX} cy={point.y} r="5" fill={dotColor} className="cursor-pointer hover:scale-110 transition-transform" onClick={e => handleDotClick(point, e)} style={{
            filter: `drop-shadow(0 0 6px ${dotColor}40)`
          }} />
              
              {/* Inner highlight */}
              <circle cx={dotX} cy={point.y} r="2" fill="white" opacity="0.8" className="pointer-events-none" />
            </motion.g>;
      })}
      </svg>

      {/* Y-axis label */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
        <span className="text-xs text-gray-500 font-medium">% to Target</span>
      </div>

      {/* X-axis label */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4">
        <span className="text-xs text-gray-500 font-medium">Metrics</span>
      </div>

        {/* Detail card popover via portal */}
      {selectedMetric && detailPos && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          <motion.div
            key="line-detail"
            ref={detailRef}
            role="tooltip"
            aria-hidden={false}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute"
            style={{ position: 'fixed', left: detailPos.left, top: detailPos.top, zIndex: zIndex.tooltip }}
            tabIndex={-1}
            onAnimationComplete={() => {
              // Try focus the card container when it appears
              try { detailRef.current?.focus(); } catch {}
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.stopPropagation();
                setSelectedMetric(null);
                const el = prevFocusRef.current as HTMLElement | null;
                if (el && typeof el.focus === 'function') {
                  try { el.focus(); } catch {}
                }
              }
            }}
          >
            <DetailCard metric={selectedMetric} position={{ x: 0, y: 0 }} onClose={() => setSelectedMetric(null)} />
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>;
};
export default LineChart;