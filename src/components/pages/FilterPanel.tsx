import React from 'react';
import { Filters, FilterOptions } from '@/types/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterPanelProps {
    filters: Filters;
    onFilterChange: (filterName: keyof Filters, value: string) => void;
    filterOptions: FilterOptions;
    isCompact?: boolean;
    onClearFilters?: () => void;
    isDarkMode?: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, filterOptions, isCompact = false, onClearFilters, isDarkMode = true }) => {
    const hasActiveFilters = filters.country !== 'all' || filters.solutionType !== 'all' || filters.ifi !== 'all' || filters.projectStatus !== 'all';
    
    const bgColor = isDarkMode ? '#0d1b2a' : 'transparent';
    const textColor = isDarkMode ? '#9eafc0' : '#0a1628';
    const borderColor = '#384860';

    return (
        <>
            <div className="flex items-center justify-between mb-2">
                <h3 style={{ color: textColor }}>Filters</h3>
                {hasActiveFilters && onClearFilters && (
                    <button
                        onClick={onClearFilters}
                        className={`${isCompact ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'} font-semibold underline`}
                        style={{ color: isDarkMode ? '#ffa51d' : '#0a1628' }}
                    >
                        Clear All
                    </button>
                )}
            </div>
            <div className={`${isCompact ? 'space-y-2' : 'space-y-4'}`}>
                <Select
                    value={filters.country || 'all'}
                    onValueChange={(value) => onFilterChange('country', value)}
                >
                    <SelectTrigger className={`w-full ${isCompact ? 'h-8 text-xs' : 'h-11'}`} style={{ borderColor: '#384860', backgroundColor: bgColor, color: isDarkMode ? '#a0b0c8' : '#0a1628' }}>
                        <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: bgColor, borderColor: '#384860' }}>
                        {filterOptions.countries.filter(c => c !== '').map(country => (
                            <SelectItem key={country} value={country} className={isCompact ? 'text-xs' : ''} style={{ color: isDarkMode ? '#a0b0c8' : '#0a1628' }}>
                                {country === 'all' ? 'All Countries' : country}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.solutionType || 'all'}
                    onValueChange={(value) => onFilterChange('solutionType', value)}
                >
                    <SelectTrigger className={`w-full ${isCompact ? 'h-8 text-xs' : 'h-11'}`} style={{ borderColor: '#384860', backgroundColor: bgColor, color: isDarkMode ? '#a0b0c8' : '#0a1628' }}>
                        <SelectValue placeholder="All False Solution Types" />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: bgColor, borderColor: '#384860' }}>
                        {filterOptions.solutionTypes.filter(t => t !== '').map(type => (
                            <SelectItem key={type} value={type} className={isCompact ? 'text-xs' : ''} style={{ color: isDarkMode ? '#a0b0c8' : '#0a1628' }}>
                                {type === 'all' ? 'All False Solution Types' : type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.ifi || 'all'}
                    onValueChange={(value) => onFilterChange('ifi', value)}
                >
                    <SelectTrigger className={`w-full ${isCompact ? 'h-8 text-xs' : 'h-11'}`} style={{ borderColor: '#384860', backgroundColor: bgColor, color: isDarkMode ? '#a0b0c8' : '#0a1628' }}>
                        <SelectValue placeholder="All IFI Types" />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: bgColor, borderColor: '#384860' }}>
                        {filterOptions.ifis.filter(i => i !== '').map(ifi => (
                            <SelectItem key={ifi} value={ifi} className={isCompact ? 'text-xs' : ''} style={{ color: isDarkMode ? '#a0b0c8' : '#0a1628' }}>
                                {ifi === 'all' ? 'All IFI Types' : ifi === 'N/A' ? 'No IFI' : ifi}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.projectStatus || 'all'}
                    onValueChange={(value) => onFilterChange('projectStatus', value)}
                >
                    <SelectTrigger className={`w-full ${isCompact ? 'h-8 text-xs' : 'h-11'}`} style={{ borderColor: '#384860', backgroundColor: bgColor, color: isDarkMode ? '#a0b0c8' : '#0a1628' }}>
                        <SelectValue placeholder="All Project Statuses" />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: bgColor, borderColor: '#384860' }}>
                        {filterOptions.projectStatuses.filter(s => s !== '').map(status => (
                            <SelectItem key={status} value={status} className={isCompact ? 'text-xs' : ''} style={{ color: isDarkMode ? '#a0b0c8' : '#0a1628' }}>
                                {status === 'all' ? 'All Project Statuses' : status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </>
    );
};

export default FilterPanel;