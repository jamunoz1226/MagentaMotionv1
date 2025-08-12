import React from 'react';
import { cn } from '../../lib/utils';

interface KpiPairGridProps {
  className?: string;
  children: React.ReactNode;
}

export default function KpiPairGrid({ className, children }: KpiPairGridProps) {
  return <div className={cn('dash-kpi-grid', className)}>{children}</div>;
}
