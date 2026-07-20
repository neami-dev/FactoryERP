import React from 'react';
import { cn } from '@/lib/utils';

interface WeightItem {
  type: string;
  totalWeight: number;
  percentage: number;
}

interface WeightCategoryListProps {
  items: WeightItem[];
  className?: string;
}

const WeightCategoryList: React.FC<WeightCategoryListProps> = ({ items, className }) => {
  const getPercentageColor = (percentage: number) => {
    if (percentage > 50) return 'text-green-600';
    if (percentage < 20) return 'text-red-400';
    return 'text-gray-500';
  };

  const getPercentageBgColor = (percentage: number) => {
    if (percentage > 50) return 'bg-green-50';
    if (percentage < 20) return 'bg-red-50';
    return 'bg-gray-50';
  };
  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-center gap-4 flex-wrap pb-4">
        {items.map((item, index) => (
          <div 
            key={index}
            className="glass-effect rounded-lg p-4 border border-gray-200/50 hover:shadow-glass-hover transition-all duration-200 flex-shrink-0 min-w-[240px]"
          >
            <div className="flex flex-col gap-3">
              {/* Type Label */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide truncate">
                  {item.type}
                </h3>
              </div>

              {/* Weight and Percentage Row */}
              <div className="flex items-center justify-between gap-2">
                {/* Weight Display */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">{item.totalWeight.toFixed(1)}</span>
                  <span className="text-gray-400">kg</span>
                </div>

                {/* Percentage Badge */}
                <div className={cn(
                  'flex items-center justify-center min-w-[60px] h-8 rounded-full text-sm font-semibold',
                  getPercentageBgColor(item.percentage),
                  getPercentageColor(item.percentage)
                )}>
                  {item.percentage.toFixed(1)}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    item.percentage > 50 ? 'bg-green-500' : 
                    item.percentage < 20 ? 'bg-red-400' : 'bg-gray-400'
                  )}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
       
      </div>
    </div>
  );
};

export default WeightCategoryList;