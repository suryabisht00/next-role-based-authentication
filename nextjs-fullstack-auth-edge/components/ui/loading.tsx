import React from 'react';
import './loading.css';

interface LoadingProps {
  className?: string;
}

export function Loading({ className = '' }: LoadingProps) {
  return (
    <div className={`loader ${className}`}></div>
  );
}

// Also export a more specific named component for the full-screen loading state
export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loading />
    </div>
  );
} 