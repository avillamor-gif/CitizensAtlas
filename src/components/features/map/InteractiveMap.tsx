'use client'

import React, { useMemo, useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl/maplibre';
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
    onMapLoad?: () => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ projects, onMarkerClick, onMapClick, onMapLoad }) => {
    const [countryPopup, setCountryPopup] = useState<{ country: string; count: number; lng: number; lat: number } | null>(null);
    const mapRef = useRef<any>(null);

    // Calculate projects per country for choropleth
    const countryProjectCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        projects.forEach(project => {
            const country = project.country?.trim().toUpperCase();
            if (country) {
                counts[country] = (counts[country] || 0) + 1;
            }
        });
        return counts;
    }, [projects]);

    const maxProjectCount = useMemo(() => {
        return Math.max(...Object.values(countryProjectCounts), 1);
    }, [countryProjectCounts]);

    const { minAmount, maxAmount } = useMemo(() => {
        const amounts = projects.map(p => parseProjectAmount(p.details)).filter(a => a > 0);
        if (amounts.length === 0) return { minAmount: 0, maxAmount: 0 };
        return {
            minAmount: Math.min(...amounts),
            maxAmount: Math.max(...amounts)
        };
    }, [projects]);

    const markers = useMemo(() => {
        return projects.map(project => {
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
        });
    }, [projects, minAmount, maxAmount]);

    // Calculate center point based on all projects
    const mapCenter = useMemo(() => {
        if (projects.length === 0) {
            return { longitude: 0, latitude: 20, zoom: 1.5 };
        }

        const validProjects = projects.filter(p => 
            p.latitude && p.longitude && 
            !isNaN(p.latitude) && !isNaN(p.longitude)
        );

        if (validProjects.length === 0) {
            return { longitude: 0, latitude: 20, zoom: 1.5 };
        }

        // Calculate bounds of all projects
        const latitudes = validProjects.map(p => p.latitude);
        const longitudes = validProjects.map(p => p.longitude);
        
        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLng = Math.min(...longitudes);
        const maxLng = Math.max(...longitudes);

        // Calculate center
        const avgLat = (minLat + maxLat) / 2;
        const avgLng = (minLng + maxLng) / 2;

        // Calculate zoom to fit all points with padding
        const latRange = maxLat - minLat;
        const lngRange = maxLng - minLng;
        
        // Add 20% padding to ensure all bubbles are visible
        const paddedLatRange = latRange * 1.4;
        const paddedLngRange = lngRange * 1.4;
        const maxRange = Math.max(paddedLatRange, paddedLngRange);

        // Calculate zoom level based on range
        let zoom = 1.5;
        if (validProjects.length === 1) {
            zoom = 6; // Single project
        } else if (maxRange < 0.5) {
            zoom = 9;
        } else if (maxRange < 1) {
            zoom = 8;
        } else if (maxRange < 2) {
            zoom = 7;
        } else if (maxRange < 5) {
            zoom = 6;
        } else if (maxRange < 10) {
            zoom = 5;
        } else if (maxRange < 20) {
            zoom = 4;
        } else if (maxRange < 40) {
            zoom = 3;
        } else if (maxRange < 80) {
            zoom = 2;
        } else {
            zoom = 1.5;
        }

        return { longitude: avgLng, latitude: avgLat, zoom };
    }, [projects]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            <Map
                ref={mapRef}
                initialViewState={mapCenter}
                style={{ width: '100%', height: '100%' }}
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                onLoad={(e) => {
                    const map = e.target;
                    
                    if (onMapLoad) {
                        onMapLoad();
                    }
                }}
                onClick={(e) => {
                    setCountryPopup(null);
                    // If onMapClick is provided and user clicks on empty map area (not a marker)
                    if (onMapClick && e.lngLat) {
                        onMapClick({
                            latitude: e.lngLat.lat,
                            longitude: e.lngLat.lng
                        });
                    }
                }}
            >
                {/* Bubble markers for projects */}
                {markers.map((project) => (
                    <Marker
                        key={`marker-${project.id}`}
                        longitude={project.longitude}
                        latitude={project.latitude}
                        anchor="center"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            onMarkerClick(project);
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

                {countryPopup && (
                    <Popup
                        longitude={countryPopup.lng}
                        latitude={countryPopup.lat}
                        anchor="bottom"
                        onClose={() => setCountryPopup(null)}
                        closeOnClick={false}
                        maxWidth="280px"
                        closeButton={true}
                    >
                        <div className="font-sans p-4">
                            <p className="font-bold text-lg text-brand-dark-blue mb-2">{countryPopup.country}</p>
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold text-2xl text-brand-dark-blue">{countryPopup.count}</span>
                                {' '}project{countryPopup.count !== 1 ? 's' : ''} submitted
                            </p>
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