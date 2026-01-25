import React from 'react';
import type { Plan } from '../types';

interface PlanCardProps {
    plan: Plan;
    isCurrentPlan?: boolean;
    onSubscribe: (plan: Plan) => void;
    isLoading?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, isCurrentPlan, onSubscribe, isLoading }) => {
    return (
        <div className={`
            relative p-6 rounded-2xl border transition-all duration-300
            ${isCurrentPlan
                ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:shadow-xl hover:-translate-y-1'
            }
        `}>
            {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    CURRENT PLAN
                </div>
            )}

            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500 ml-1">/ {plan.durationInDays} days</span>
                </div>
                <p className="mt-4 text-gray-600 text-sm">{plan.description}</p>
            </div>

            <button
                onClick={() => onSubscribe(plan)}
                disabled={isCurrentPlan || isLoading}
                className={`
                    w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200
                    ${isCurrentPlan
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                    }
                    ${isLoading ? 'opacity-70 cursor-wait' : ''}
                `}
            >
                {isLoading ? 'Processing...' : isCurrentPlan ? 'Active' : 'Subscribe Now'}
            </button>
        </div>
    );
};
