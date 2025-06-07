"use client";

import React, { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

export const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
}) => {
  const [width, setWidth] = useState(null);

  useEffect(() => {
    // This will only run on the client after hydration
    const randomWidth = Math.random() * 40 + 60; // Between 60% and 100%
    setWidth(randomWidth);
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-black rounded-lg">
          <Icon className="text-white" size={24} />
        </div>
        <span className="text-black text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
          {change}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <p className="text-black text-2xl font-bold">{value}</p>
      </div>

      <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
        {width !== null && (
          <div
            className="h-full bg-black rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${width}%` }}
          />
        )}
      </div>
    </div>
  );
};
