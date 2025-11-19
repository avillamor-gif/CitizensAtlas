'use client'

import React, { useMemo, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Project } from '@/types/types';
import { solutionTypeColors, getSolutionTypeColor } from '@/lib/constants';

const legendData = Object.entries(solutionTypeColors)
    .filter(([key]) => key !== 'default')
    .map(([name, { tailwind }]) => ({ name, colorClass: tailwind }));

// Helper functions to parse project details
const parseDetail = (details: string, key: string): string => {
    const match = details.match(new RegExp(`\\*\\*${key}:\\*\\*(.*)`));
    return match ? match[1].trim() : '';
};

const parseProjectAmount = (details: string): number => {
    const amountStr = parseDetail(details, 'Total Project Amount');
    if (!amountStr) return 0;
    const numberString = amountStr.replace(/[$,€]/g, '').replace(/,/g, '');
    return parseFloat(numberString) || 0;
};

// Calculate bubble size based on project amount using a logarithmic scale
function calculateBubbleSize(amount: number, minAmount: number, maxAmount: number): number {
    const minSize = 20; // min pixel size
    const maxSize = 80; // max pixel size

    if (amount <= 0 || minAmount === maxAmount) {
        return minSize;
    }

    // Use logarithmic scale for better visual distribution of sizes
    const logMin = Math.log10(minAmount > 0 ? minAmount : 1);
    const logMax = Math.log10(maxAmount > 0 ? maxAmount : 1);
    const logAmount = Math.log10(amount > 0 ? amount : 1);

    if (logMax === logMin) {
        return minSize;
    }

    const scale = (logAmount - logMin) / (logMax - logMin);
    const size = minSize + scale * (maxSize - minSize);
    
    return Math.max(minSize, Math.min(size, maxSize)); // Clamp the size to be within min/max bounds
}

const formatAmount = (num: number) => {
    if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(0)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
    return `$${num}`;
};

interface InteractiveMapProps {
    projects: Project[];
    onMarkerClick: (project: Project) => void;
    onMapClick?: (location: { latitude: number; longitude: number }) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ projects, onMarkerClick, onMapClick }) => {
    const [popupInfo, setPopupInfo] = useState<Project | null>(null);

    const { minAmount, maxAmount } = useMemo(() => {
        const amounts = projects.map(p => parseProjectAmount(p.details)).filter(a => a > 0);
        if (amounts.length === 0) return { minAmount: 0, maxAmount: 0 };
        return {
            minAmount: Math.min(...amounts),
            maxAmount: Math.max(...amounts)
        };
    }, [projects]);

    const markers = useMemo(() => projects.map(project => {
        const amount = parseProjectAmount(project.details);
        const size = calculateBubbleSize(amount, minAmount, maxAmount);
        const colorClass = getSolutionTypeColor(project.corruptionType, 'tailwind');
        
        // Convert Tailwind color class to actual color
        const colorMap: Record<string, string> = {
            'bg-red-500': '#ef4444',
            'bg-blue-500': '#3b82f6',
            'bg-green-500': '#22c55e',
            'bg-yellow-500': '#eab308',
            'bg-purple-500': '#a855f7',
            'bg-orange-500': '#f97316',
            'bg-pink-500': '#ec4899',
            'bg-indigo-500': '#6366f1',
            'bg-teal-500': '#14b8a6',
        };
        const bgColor = colorMap[colorClass] || '#3b82f6';

        return {
            ...project,
            size,
            amount,
            bgColor
        };
    }), [projects, minAmount, maxAmount]);

    return (
        <div className="relative w-full h-full">
            <Map
                initialViewState={{
                    longitude: 20,
                    latitude: 30,
                    zoom: 1.5
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                onClick={(e) => {
                    setPopupInfo(null);
                    // If onMapClick is provided and user clicks on empty map area (not a marker)
                    if (onMapClick && e.lngLat) {
                        onMapClick({
                            latitude: e.lngLat.lat,
                            longitude: e.lngLat.lng
                        });
                    }
                }}
            >
                {markers.map((project) => (
                    <Marker
                        key={`marker-${project.id}`}
                        longitude={project.longitude}
                        latitude={project.latitude}
                        anchor="center"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            setPopupInfo(project);
                        }}
                    >
                        <div
                            style={{
                                width: `${project.size}px`,
                                height: `${project.size}px`,
                                backgroundColor: project.bgColor,
                                opacity: 0.7,
                            }}
                            className="rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-all hover:scale-110"
                        >
                            {project.size > 35 && (
                                <span
                                    className="text-white font-bold text-xs"
                                    style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.5)' }}
                                >
                                    {formatAmount(project.amount)}
                                </span>
                            )}
                        </div>
                    </Marker>
                ))}

                {popupInfo && (
                    <Popup
                        longitude={popupInfo.longitude}
                        latitude={popupInfo.latitude}
                        anchor="bottom"
                        onClose={() => setPopupInfo(null)}
                        closeOnClick={false}
                        maxWidth="320px"
                        closeButton={true}
                    >
                        <div className="font-sans p-3 pt-2">
                            <p className="font-bold text-base text-brand-dark-blue mb-2">{popupInfo.country}</p>
                            <p className="text-xs text-gray-800 whitespace-normal mb-2" title={popupInfo.title}>
                                {popupInfo.title}
                            </p>
                            <div className="space-y-1 mb-3">
                                <p className="text-xs text-gray-600">
                                    <span className="font-semibold">Amount:</span> {parseDetail(popupInfo.details, 'Total Project Amount') || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-600">
                                    <span className="font-semibold">False Solution:</span> {popupInfo.corruptionType || 'N/A'}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    onMarkerClick(popupInfo);
                                    setPopupInfo(null);
                                }}
                                className="w-full text-white text-xs font-semibold py-2 px-3 rounded hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: '#0d234f' }}
                            >
                                View Full Details
                            </button>
                        </div>
                    </Popup>
                )}
            </Map>

            {projects.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 pointer-events-none z-20">
                    <div className="text-center p-8 bg-white rounded-lg shadow-xl">
                        <h3 className="text-2xl font-semibold text-brand-dark-blue">No Projects Found</h3>
                        <p className="text-gray-600 mt-2">Try adjusting your filter criteria.</p>
                    </div>
                </div>
            )}

            <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg z-10 max-w-[200px] md:max-w-xs">
                <div>
                    <h4 className="font-bold text-sm mb-2 text-brand-dark-blue">False Solution Types</h4>
                    <ul className="space-y-1">
                        {legendData.map(({ name, colorClass }) => (
                            <li key={name} className="flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-2 flex-shrink-0 ${colorClass}`}></span>
                                <span className="text-xs text-gray-700">{name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default InteractiveMap;