import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className = 'h-4 w-full' }) => {
  return (
    <div className={`bg-slate-800/60 animate-pulse rounded ${className}`} />
  );
};
