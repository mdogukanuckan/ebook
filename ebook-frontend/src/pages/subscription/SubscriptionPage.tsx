import React, { useEffect, useState } from 'react';
import { PlanCard } from '../../features/subscription/components/PlanCard';
import { SubscriptionStatus } from '../../features/subscription/components/SubscriptionStatus';
import { getPlans, getCurrentSubscription, subscribeToPlan } from '../../features/subscription/services/subscriptionService';
import type { Plan, Subscription } from '../../features/subscription/types';

const SubscriptionPage: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchData = async () => {
        try {
            const [plansData, subData] = await Promise.all([
                getPlans(),
                getCurrentSubscription().catch(() => null)
            ]);
            setPlans(plansData);
            setCurrentSubscription(subData);
        } catch (err) {
            console.error('Failed to load subscription data', err);
            setMessage({ type: 'error', text: 'Failed to load subscription plans.' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubscribe = async (plan: Plan) => {
        if (!confirm(`Are you sure you want to subscribe to ${plan.name} for $${plan.price}?`)) return;

        try {
            setIsSubscribing(true);
            const newSub = await subscribeToPlan(plan.id);
            setCurrentSubscription(newSub);
            setMessage({ type: 'success', text: `Successfully subscribed to ${plan.name}!` });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Subscription failed. Please try again.' });
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Premium Access</h1>

            <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Subscription</h2>
                <SubscriptionStatus subscription={currentSubscription} isLoading={isLoading} />
            </div>

            {message && (
                <div className={`p-4 rounded-lg mb-8 text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="h-96 bg-gray-100 rounded-2xl animate-pulse"></div>
                    ))
                ) : (
                    plans.map(plan => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            isCurrentPlan={currentSubscription?.plan.id === plan.id}
                            onSubscribe={handleSubscribe}
                            isLoading={isSubscribing}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default SubscriptionPage;
