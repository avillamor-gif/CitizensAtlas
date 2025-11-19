import React from 'react';
import { Filters, FilterOptions } from '@/types/types';
import { ChevronDownIcon } from '@/components/ui/icons';

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
                <div className="relative">
                    <select
                        className={`w-full border rounded-md appearance-none bg-white text-gray-700 focus:ring-brand-medium-blue focus:border-brand-medium-blue ${isCompact ? 'p-2 text-sm' : 'p-3'}`}
                        value={filters.country}
                        onChange={(e) => onFilterChange('country', e.target.value)}
                        aria-label="Filter by country"
                    >
                        {filterOptions.countries.map(country => (
                            <option key={country} value={country}>
                                {country === 'all' ? 'All Countries' : country}
                            </option>
                        ))}
                    </select>
                    <ChevronDownIcon className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative">
                    <select
                        className={`w-full border rounded-md appearance-none bg-white text-gray-700 focus:ring-brand-medium-blue focus:border-brand-medium-blue ${isCompact ? 'p-2 text-sm' : 'p-3'}`}
                        value={filters.solutionType}
                        onChange={(e) => onFilterChange('solutionType', e.target.value)}
                        aria-label="Filter by false solution type"
                    >
                        {filterOptions.solutionTypes.map(type => (
                            <option key={type} value={type}>
                                {type === 'all' ? 'All False Solution Types' : type}
                            </option>
                        ))}
                    </select>
                    <ChevronDownIcon className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative">
                    <select
                        className={`w-full border rounded-md appearance-none bg-white text-gray-700 focus:ring-brand-medium-blue focus:border-brand-medium-blue ${isCompact ? 'p-2 text-sm' : 'p-3'}`}
                        value={filters.ifi}
                        onChange={(e) => onFilterChange('ifi', e.target.value)}
                        aria-label="Filter by IFI type"
                    >
                        {filterOptions.ifis.map(ifi => (
                            <option key={ifi} value={ifi}>
                                {ifi === 'all' ? 'All IFI Types' : ifi === 'N/A' ? 'No IFI' : ifi}
                            </option>
                        ))}
                    </select>
                    <ChevronDownIcon className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative">
                    <select
                        className={`w-full border rounded-md appearance-none bg-white text-gray-700 focus:ring-brand-medium-blue focus:border-brand-medium-blue ${isCompact ? 'p-2 text-sm' : 'p-3'}`}
                        value={filters.projectStatus}
                        onChange={(e) => onFilterChange('projectStatus', e.target.value)}
                        aria-label="Filter by project status"
                    >
                        {filterOptions.projectStatuses.map(status => (
                            <option key={status} value={status}>
                                {status === 'all' ? 'All Project Statuses' : status}
                            </option>
                        ))}
                    </select>
                    <ChevronDownIcon className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            </div>
        </>
    );
};

export default FilterPanel;