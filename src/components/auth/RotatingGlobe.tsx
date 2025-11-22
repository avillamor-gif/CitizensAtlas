'use client'

import React, { useState, useEffect } from 'react'

export default function RotatingGlobe() {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 0.5)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-80 h-80">
        {/* SVG Globe with rotation */}
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          style={{ transform: `rotate(${rotation}deg)` }}
          className="transition-transform"
        >
          {/* Outer circle */}
          <circle
            cx="160"
            cy="160"
            r="150"
            fill="none"
            stroke="white"
            strokeWidth="1"
            opacity="0.3"
          />
          
          {/* Vertical lines (meridians) */}
          {[0, 30, 60, 90, 120, 150].map((angle) => (
            <ellipse
              key={`v-${angle}`}
              cx="160"
              cy="160"
              rx={Math.cos((angle * Math.PI) / 180) * 150}
              ry="150"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              opacity="0.2"
            />
          ))}
          
          {/* Horizontal lines (parallels) */}
          {[30, 60, 90, 120, 150].map((y) => (
            <ellipse
              key={`h-${y}`}
              cx="160"
              cy="160"
              rx="150"
              ry={Math.abs(160 - y) * 0.3}
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              opacity="0.2"
              transform={`translate(0, ${y - 160})`}
            />
          ))}
          
          {/* Simplified continents */}
          {/* North America */}
          <path
            d="M 80 100 Q 70 80 90 70 Q 110 60 120 80 Q 130 100 110 120 Q 90 130 80 100 Z"
            fill="#98c1d9"
            opacity="0.6"
          />
          
          {/* South America */}
          <path
            d="M 95 140 Q 90 130 100 130 Q 110 135 105 150 Q 100 165 95 160 Q 90 155 95 140 Z"
            fill="#98c1d9"
            opacity="0.6"
          />
          
          {/* Europe */}
          <path
            d="M 150 90 Q 145 85 155 82 Q 165 80 170 90 Q 165 100 155 95 Q 150 92 150 90 Z"
            fill="#98c1d9"
            opacity="0.6"
          />
          
          {/* Africa */}
          <path
            d="M 165 110 Q 160 105 170 100 Q 180 105 185 120 Q 180 140 170 145 Q 160 140 165 110 Z"
            fill="#98c1d9"
            opacity="0.6"
          />
          
          {/* Asia */}
          <path
            d="M 190 80 Q 200 70 220 75 Q 235 85 230 105 Q 220 115 205 110 Q 190 100 190 80 Z"
            fill="#98c1d9"
            opacity="0.6"
          />
          
          {/* Australia */}
          <path
            d="M 215 160 Q 210 155 220 155 Q 230 160 225 170 Q 220 175 215 170 Q 210 165 215 160 Z"
            fill="#98c1d9"
            opacity="0.6"
          />
        </svg>
        
        {/* Animated dots */}
        <div className="absolute inset-0 animate-pulse">
          <div className="absolute top-[25%] left-[35%] w-2 h-2 bg-[#98c1d9] rounded-full shadow-lg"></div>
          <div className="absolute top-[45%] right-[30%] w-2 h-2 bg-[#ee6c4d] rounded-full shadow-lg"></div>
          <div className="absolute bottom-[35%] left-[45%] w-2 h-2 bg-[#98c1d9] rounded-full shadow-lg"></div>
        </div>
      </div>
    </div>
  )
}
