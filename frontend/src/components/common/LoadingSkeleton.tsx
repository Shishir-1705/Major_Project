import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className = 'h-4 w-full' }) => {
  return (
    <div className={`bg-[#162238] animate-pulse rounded ${className}`} />
  );
};
