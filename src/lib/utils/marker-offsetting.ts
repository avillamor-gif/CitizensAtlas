/**
 * Utility for offsetting overlapping map markers
 * When multiple markers are at the same or very close locations,
 * they are fanned out in a circle so they're all clickable
 */

export interface MarkerWithCoords {
    id: string | number;
    latitude: number;
    longitude: number;
    [key: string]: any;
}

export interface OffsetMarker extends MarkerWithCoords {
    offsetLat?: number;
    offsetLng?: number;
    isOffset?: boolean;
    originalLatitude?: number;
    originalLongitude?: number;
}

/**
 * Convert degrees to radians
 */
function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
function radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
}

/**
 * Calculate distance between two lat/lng points in kilometers
 */
export function getDistanceInKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = degreesToRadians(lat2 - lat1);
    const dLng = degreesToRadians(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Calculate new coordinates by moving a certain distance in a given direction
 * @param lat Starting latitude
 * @param lng Starting longitude
 * @param distanceKm Distance to move in kilometers
 * @param bearingDegrees Direction to move (0-360, where 0 is north)
 */
export function moveCoordinates(
    lat: number,
    lng: number,
    distanceKm: number,
    bearingDegrees: number
): { lat: number; lng: number } {
    const R = 6371; // Earth's radius in km
    const bearing = degreesToRadians(bearingDegrees);
    const distance = distanceKm / R;
    const lat1 = degreesToRadians(lat);
    const lng1 = degreesToRadians(lng);

    const lat2 = Math.asin(
        Math.sin(lat1) * Math.cos(distance) +
        Math.cos(lat1) * Math.sin(distance) * Math.cos(bearing)
    );

    const lng2 = lng1 + Math.atan2(
        Math.sin(bearing) * Math.sin(distance) * Math.cos(lat1),
        Math.cos(distance) - Math.sin(lat1) * Math.sin(lat2)
    );

    return {
        lat: radiansToDegrees(lat2),
        lng: radiansToDegrees(lng2),
    };
}

/**
 * Group markers that are at the same location or very close together
 * @param markers Array of markers with latitude/longitude
 * @param proximityKm Distance in kilometers to consider markers as "overlapping"
 */
export function groupOverlappingMarkers(
    markers: MarkerWithCoords[],
    proximityKm: number = 0.1
): MarkerWithCoords[][] {
    if (markers.length === 0) return [];

    const groups: MarkerWithCoords[][] = [];
    const visited = new Set<string>();

    markers.forEach(marker => {
        const markerId = String(marker.id);
        if (visited.has(markerId)) return;

        const group = [marker];
        visited.add(markerId);

        // Find all markers close to this one
        markers.forEach(otherMarker => {
            const otherMarkerId = String(otherMarker.id);
            if (visited.has(otherMarkerId)) return;

            const distance = getDistanceInKm(
                marker.latitude,
                marker.longitude,
                otherMarker.latitude,
                otherMarker.longitude
            );

            if (distance <= proximityKm) {
                group.push(otherMarker);
                visited.add(otherMarkerId);
            }
        });

        groups.push(group);
    });

    return groups;
}

/**
 * Apply offset to overlapping markers
 * @param markers Array of markers with latitude/longitude
 * @param offsetDistance Distance in kilometers to offset markers from their group center
 * @param proximityKm Distance in kilometers to consider markers as "overlapping"
 */
export function offsetOverlappingMarkers(
    markers: MarkerWithCoords[],
    offsetDistance: number = 0.05,
    proximityKm: number = 0.1
): OffsetMarker[] {
    if (markers.length === 0) return [];

    const groups = groupOverlappingMarkers(markers, proximityKm);
    const offsetMarkers: OffsetMarker[] = [];

    groups.forEach(group => {
        if (group.length === 1) {
            // No offset needed for single markers
            offsetMarkers.push({
                ...group[0],
                isOffset: false,
            });
        } else {
            // Calculate center of group
            const centerLat = group.reduce((sum, m) => sum + m.latitude, 0) / group.length;
            const centerLng = group.reduce((sum, m) => sum + m.longitude, 0) / group.length;

            // Offset each marker in a circle around the center
            const angleStep = 360 / group.length;
            group.forEach((marker, index) => {
                const angle = angleStep * index;
                const { lat: offsetLat, lng: offsetLng } = moveCoordinates(
                    centerLat,
                    centerLng,
                    offsetDistance,
                    angle
                );

                offsetMarkers.push({
                    ...marker,
                    originalLatitude: marker.latitude,
                    originalLongitude: marker.longitude,
                    offsetLat,
                    offsetLng,
                    isOffset: true,
                    latitude: offsetLat,
                    longitude: offsetLng,
                });
            });
        }
    });

    return offsetMarkers;
}
