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
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, filterOptions, isCompact = false }) => {
    return (
        <>
            <h3 className={`${isCompact ? 'text-base font-bold mb-4' : 'text-xl font-bold mb-6'} text-brand-dark-blue`}>Filters</h3>
            <div className={`${isCompact ? 'space-y-3' : 'space-y-4'}`}>
                <Select
                    value={filters.country}
                    onValueChange={(value) => onFilterChange('country', value)}
                >
                    <SelectTrigger className={`w-full ${isCompact ? 'h-9 text-sm' : 'h-11'}`}>
                        <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                        {filterOptions.countries.filter(c => c !== '').map(country => (
                            <SelectItem key={country} value={country}>
                                {country === 'all' ? 'All Countries' : country}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.solutionType}
                    onValueChange={(value) => onFilterChange('solutionType', value)}
                >
                    <SelectTrigger className={`w-full ${isCompact ? 'h-9 text-sm' : 'h-11'}`}>
                        <SelectValue placeholder="All False Solution Types" />
                    </SelectTrigger>
                    <SelectContent>
                        {filterOptions.solutionTypes.filter(t => t !== '').map(type => (
                            <SelectItem key={type} value={type}>
                                {type === 'all' ? 'All False Solution Types' : type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.ifi}
                    onValueChange={(value) => onFilterChange('ifi', value)}
                >
                    <SelectTrigger className={`w-full ${isCompact ? 'h-9 text-sm' : 'h-11'}`}>
                        <SelectValue placeholder="All IFI Types" />
                    </SelectTrigger>
                    <SelectContent>
                        {filterOptions.ifis.filter(i => i !== '').map(ifi => (
                            <SelectItem key={ifi} value={ifi}>
                                {ifi === 'all' ? 'All IFI Types' : ifi === 'N/A' ? 'No IFI' : ifi}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.projectStatus}
                    onValueChange={(value) => onFilterChange('projectStatus', value)}
                >
                    <SelectTrigger className={`w-full ${isCompact ? 'h-9 text-sm' : 'h-11'}`}>
                        <SelectValue placeholder="All Project Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        {filterOptions.projectStatuses.filter(s => s !== '').map(status => (
                            <SelectItem key={status} value={status}>
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