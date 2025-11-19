import React, { useState, useMemo, useEffect } from 'react';

type SortDirection = 'ascending' | 'descending';

export interface SortConfig<T> {
    key: keyof T;
    direction: SortDirection;
}

interface useTableProps<T> {
    items: T[];
    initialSortConfig?: SortConfig<T>;
    itemsPerPage?: number;
    searchableFields: (keyof T)[];
}

export const useTable = <T extends { id: number; [key: string]: any }>({
    items,
    initialSortConfig,
    itemsPerPage = 20,
    searchableFields,
}: useTableProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(initialSortConfig || null);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const filteredAndSortedItems = useMemo(() => {
        let processedItems = [...items];

        // Search
        if (searchTerm) {
            processedItems = processedItems.filter(item => {
                return searchableFields.some(field => {
                    const value = item[field];
                    return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
                });
            });
        }
        
        // Sort
        if (sortConfig) {
            processedItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                
                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;
                
                // Special handling for date fields
                const dateFields = ['publishDate', 'submittedAt', 'date', 'createdAt', 'updatedAt'];
                if (dateFields.includes(sortConfig.key as string)) {
                    // Convert to Date objects for proper date comparison
                    const aDate = new Date(aValue);
                    const bDate = new Date(bValue);
                    
                    // Handle invalid dates
                    if (isNaN(aDate.getTime())) return 1;
                    if (isNaN(bDate.getTime())) return -1;
                    
                    aValue = aDate as any;
                    bValue = bDate as any;
                }
                
                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return processedItems;
    }, [items, searchTerm, searchableFields, sortConfig]);
    
    // Reset page to 1 and clear selections when search term or sort changes
    useEffect(() => {
        setCurrentPage(1);
        setSelectedItems([]);
    }, [searchTerm, sortConfig]);

    const totalItems = filteredAndSortedItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedItems.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAndSortedItems, currentPage, itemsPerPage]);

    const requestSort = (key: keyof T) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Selection handlers
    const handleSelectItem = (id: number) => {
        setSelectedItems(prev => 
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    const isAllSelected = (itemsOnPage: T[]) => {
        if (itemsOnPage.length === 0) return false;
        return itemsOnPage.every(item => selectedItems.includes(item.id));
    };

    const handleSelectAll = (itemsOnPage: T[]) => {
        const allSelected = isAllSelected(itemsOnPage);
        const pageItemIds = itemsOnPage.map(item => item.id);
        
        if (allSelected) {
            setSelectedItems(prev => prev.filter(id => !pageItemIds.includes(id)));
        } else {
            setSelectedItems(prev => Array.from(new Set([...prev, ...pageItemIds])));
        }
    };


    return {
        paginatedItems,
        requestSort,
        setSearchTerm,
        sortConfig,
        currentPage,
        totalPages,
        handlePageChange,
        selectedItems,
        setSelectedItems,
        handleSelectItem,
        handleSelectAll,
        isAllSelected,
    };
};