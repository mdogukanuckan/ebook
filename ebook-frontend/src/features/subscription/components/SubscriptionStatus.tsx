import React from 'react';
import type { Subscription } from '../types';
import { Calendar, Crown } from 'lucide-react';

interface SubscriptionStatusProps {
    subscription: Subscription | null;
    isLoading?: boolean;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ subscription, isLoading }) => {
    if (isLoading) {
        return <div className="animate-pulse h-24 bg-gray-100 rounded-lg"></div>;
    }

    if (!subscription || !subscription.isActive) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600">You don't have an active subscription.</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Crown className="w-6 h-6 text-yellow-300" />
                    <h3 className="text-xl font-bold">{subscription.plan.name} Plan</h3>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    Active
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 opacity-75" />
                    <span>Started: {new Date(subscription.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 opacity-75" />
                    <span>Ends: {new Date(subscription.endDate).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};
