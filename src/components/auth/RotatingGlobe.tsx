'use client'

import React, { useState, useEffect } from 'react'
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export default function RotatingGlobe() {
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0])

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => [prev[0] + 0.2, prev[1], prev[2]])
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <ComposableMap
        projection="orthographic"
        projectionConfig={{
          scale: 200,
          rotate: rotation,
        }}
        width={400}
        height={400}
      >
        <Sphere id="sphere" stroke="#ffffff" strokeWidth={0.5} fill="none" />
        <Graticule stroke="#ffffff" strokeWidth={0.3} strokeOpacity={0.2} />
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#98c1d9"
                stroke="#ffffff"
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  )
}
