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
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, filterOptions, isCompact = false, onClearFilters }) => {
    const hasActiveFilters = filters.country !== 'all' || filters.solutionType !== 'all' || filters.ifi !== 'all' || filters.projectStatus !== 'all';

    return (
        <>
            <div className="flex items-center justify-between mb-2">
                <h3 className={`${isCompact ? 'text-sm font-bold' : 'text-xl font-bold'} text-brand-dark-blue`}>Filters</h3>
                {hasActiveFilters && onClearFilters && (
                    <button
                        onClick={onClearFilters}
                        className={`${isCompact ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'} text-brand-dark-blue hover:text-brand-medium-blue font-semibold underline`}
                    >
                        Clear All
                    </button>
                )}
            </div>
            <div className={`${isCompact ? 'space-y-2' : 'space-y-4'}`}>
                <Select
                    value={filters.country}
                    onValueChange={(value) => onFilterChange('country', value)}
                >
                    <SelectTrigger className={`w-full ${isCompact ? 'h-8 text-xs' : 'h-11'}`}>
                        <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                        {filterOptions.countries.filter(c => c !== '').map(country => (
                            <SelectItem key={country} value={country} className={isCompact ? 'text-xs' : ''}>
                                {country === 'all' ? 'All Countries' : country}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.solutionType}
                    onValueChange={(value) => onFilterChange('solutionType', value)}
                >
                    <SelectTrigger className={`w-full ${isCompact ? 'h-8 text-xs' : 'h-11'}`}>
                        <SelectValue placeholder="All False Solution Types" />
                    </SelectTrigger>
                    <SelectContent>
                        {filterOptions.solutionTypes.filter(t => t !== '').map(type => (
                            <SelectItem key={type} value={type} className={isCompact ? 'text-xs' : ''}>
                                {type === 'all' ? 'All False Solution Types' : type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.ifi}
                    onValueChange={(value) => onFilterChange('ifi', value)}
                >
                    <SelectTrigger className={`w-full ${isCompact ? 'h-8 text-xs' : 'h-11'}`}>
                        <SelectValue placeholder="All IFI Types" />
                    </SelectTrigger>
                    <SelectContent>
                        {filterOptions.ifis.filter(i => i !== '').map(ifi => (
                            <SelectItem key={ifi} value={ifi} className={isCompact ? 'text-xs' : ''}>
                                {ifi === 'all' ? 'All IFI Types' : ifi === 'N/A' ? 'No IFI' : ifi}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.projectStatus}
                    onValueChange={(value) => onFilterChange('projectStatus', value)}
                >
                    <SelectTrigger className={`w-full ${isCompact ? 'h-8 text-xs' : 'h-11'}`}>
                        <SelectValue placeholder="All Project Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        {filterOptions.projectStatuses.filter(s => s !== '').map(status => (
                            <SelectItem key={status} value={status} className={isCompact ? 'text-xs' : ''}>
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