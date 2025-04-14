import React from "react";

interface ProgressProps {
  value: number; // 0 - 100
  className?: string;
  colorClass?: string;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  className = "",
  colorClass = "bg-blue-500",
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className={`relative w-full h-4 bg-gray-200 rounded-full overflow-hidden ${className}`}
    >
      <div
        className={`h-full transition-all duration-300 ${colorClass}`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};

export default Progress;
