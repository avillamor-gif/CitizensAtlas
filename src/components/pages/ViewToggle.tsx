import React from 'react';
import { Squares2X2Icon, ListBulletIcon } from '@/components/ui/icons';

interface ViewToggleProps {
    activeView: 'grid' | 'list';
    setActiveView: (view: 'grid' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ activeView, setActiveView }) => {
    const baseClasses = "p-2 rounded-md transition-colors duration-200";
    const activeClasses = "bg-brand-dark-blue text-white";
    const inactiveClasses = "bg-gray-200 text-gray-600 hover:bg-gray-300";

    return (
        <div className="flex items-center space-x-2 p-1 bg-gray-100 rounded-lg">
            <button
                onClick={() => setActiveView('grid')}
                className={`${baseClasses} ${activeView === 'grid' ? activeClasses : inactiveClasses}`}
                aria-label="Grid View"
                aria-pressed={activeView === 'grid'}
            >
                <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button
                onClick={() => setActiveView('list')}
                className={`${baseClasses} ${activeView === 'list' ? activeClasses : inactiveClasses}`}
                aria-label="List View"
                aria-pressed={activeView === 'list'}
            >
                <ListBulletIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default ViewToggle;
