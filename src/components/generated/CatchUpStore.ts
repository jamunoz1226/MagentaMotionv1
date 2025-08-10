import { useState, useEffect } from 'react';
import { MetricInput, MetricCalculation, calculateMetric, sortMetrics, calculateOverallProgress } from './CatchUpUtils';

export interface CatchUpState {
  dataThroughDay: number;
  shiftsLeft: number;
  catchUpDay: number;
  sortBy: 'gap' | 'priority';
  metrics: MetricInput[];
  calculations: MetricCalculation[];
  overallProgress: number;
  projectedEom: number;
}

// Default metric inputs
const DEFAULT_METRICS: MetricInput[] = [
  {
    code: 'CV',
    actual: 85,
    mtdOppty: 100,
    dataThroughDay: 15,
    shiftsLeft: 10,
    catchUpDay: 30,
  },
  {
    code: 'BTS',
    actual: 12,
    mtdOppty: 20,
    dataThroughDay: 15,
    shiftsLeft: 10,
    catchUpDay: 30,
  },
  {
    code: 'TFB',
    actual: 8,
    mtdOppty: 15,
    dataThroughDay: 15,
    shiftsLeft: 10,
    catchUpDay: 30,
  },
  {
    code: 'P360',
    actual: 25,
    mtdOppty: 35,
    dataThroughDay: 15,
    shiftsLeft: 10,
    catchUpDay: 30,
  },
  {
    code: 'APP',
    actual: 18,
    mtdOppty: 25,
    dataThroughDay: 15,
    shiftsLeft: 10,
    catchUpDay: 30,
  },
  {
    code: 'CSAT',
    actual: 4.2,
    mtdOppty: 4.5,
    dataThroughDay: 15,
    shiftsLeft: 10,
    catchUpDay: 30,
    csatCount: 45,
    csatTotalScore: 189,
  },
  {
    code: 'SALES_QUALITY',
    actual: 88,
    mtdOppty: 95,
    dataThroughDay: 15,
    shiftsLeft: 10,
    catchUpDay: 30,
    salesQualityPct: 95,
  },
];

/**
 * Custom hook for managing catch-up state
 */
export function useCatchUpStore() {
  const [state, setState] = useState<CatchUpState>(() => {
    // Try to load from localStorage
    const today = new Date().toISOString().split('T')[0];
    const savedData = localStorage.getItem(`catchup-${today}`);
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return {
          ...parsed,
          calculations: parsed.metrics.map((metric: MetricInput) => calculateMetric(metric)),
          overallProgress: 0, // Will be recalculated
          projectedEom: 0, // Will be recalculated
        };
      } catch (error) {
        console.error('Failed to parse saved catch-up data:', error);
      }
    }
    
    // Default state
    const calculations = DEFAULT_METRICS.map(calculateMetric);
    return {
      dataThroughDay: 15,
      shiftsLeft: 10,
      catchUpDay: 30,
      sortBy: 'priority' as const,
      metrics: DEFAULT_METRICS,
      calculations,
      overallProgress: calculateOverallProgress(calculations),
      projectedEom: 0,
    };
  });

  // Recalculate when state changes
  useEffect(() => {
    const updatedMetrics = state.metrics.map(metric => ({
      ...metric,
      dataThroughDay: state.dataThroughDay,
      shiftsLeft: state.shiftsLeft,
      catchUpDay: state.catchUpDay,
    }));
    
    const calculations = updatedMetrics.map(calculateMetric);
    const sortedCalculations = sortMetrics(calculations, state.sortBy);
    const overallProgress = calculateOverallProgress(calculations);
    
    // Calculate projected EOM
    const totalActual = calculations.reduce((sum, calc) => sum + calc.actual, 0);
    const totalEomExpected = calculations.reduce((sum, calc) => sum + calc.eomExpected, 0);
    const projectedEom = totalEomExpected > 0 ? Math.round((totalActual / totalEomExpected) * 100) : 0;
    
    setState(prev => ({
      ...prev,
      metrics: updatedMetrics,
      calculations: sortedCalculations,
      overallProgress,
      projectedEom,
    }));
    
    // Save to localStorage
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`catchup-${today}`, JSON.stringify({
      dataThroughDay: state.dataThroughDay,
      shiftsLeft: state.shiftsLeft,
      catchUpDay: state.catchUpDay,
      sortBy: state.sortBy,
      metrics: updatedMetrics,
    }));
  }, [state.dataThroughDay, state.shiftsLeft, state.catchUpDay, state.sortBy]);

  const updateControl = (field: 'dataThroughDay' | 'shiftsLeft' | 'catchUpDay', value: number) => {
    setState(prev => ({
      ...prev,
      [field]: Math.max(0, value),
    }));
  };

  const updateSortBy = (sortBy: 'gap' | 'priority') => {
    setState(prev => ({
      ...prev,
      sortBy,
    }));
  };

  const updateMetric = (code: string, updates: Partial<MetricInput>) => {
    setState(prev => ({
      ...prev,
      metrics: prev.metrics.map(metric =>
        metric.code === code ? { ...metric, ...updates } : metric
      ),
    }));
  };

  return {
    state,
    updateControl,
    updateSortBy,
    updateMetric,
  };
}