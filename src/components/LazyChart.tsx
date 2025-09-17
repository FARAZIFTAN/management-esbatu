import { Suspense, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LazyChartProps {
  children: ReactNode;
}

const LazyChart = ({ children }: LazyChartProps) => {
  return (
    <div className="min-h-[300px] w-full">
      <Suspense fallback={
        <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
          <LoadingSpinner size="md" text="Memuat grafik..." />
        </div>
      }>
        {children}
      </Suspense>
    </div>
  );
};

export default LazyChart;
