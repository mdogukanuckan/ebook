import React from 'react';

interface ProgressBarProps {
    currentPage: number;
    totalPages: number;
    showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentPage, totalPages, showLabel = true }) => {
    // Calculate percentage, max 100
    const percentage = Math.min(100, Math.max(0, Math.round((currentPage / totalPages) * 100)));

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{percentage}%</span>
                </div>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            {showLabel && (
                <div className="text-right text-xs text-gray-500 mt-1">
                    {currentPage} / {totalPages} pages
                </div>
            )}
        </div>
    );
};
