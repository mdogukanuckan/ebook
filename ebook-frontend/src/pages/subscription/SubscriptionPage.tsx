import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PlanCard } from '../../features/subscription/components/PlanCard';
import { SubscriptionStatus } from '../../features/subscription/components/SubscriptionStatus';
import { getPlans, getCurrentSubscription, subscribeToPlan } from '../../features/subscription/services/subscriptionService';
import { formatPrice } from '../../features/subscription/utils';
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
            setPlans(plansData.filter(plan => plan.active));
            setCurrentSubscription(subData);
        } catch (err) {
            console.error('Failed to load subscription data', err);
            setMessage({ type: 'error', text: 'Abonelik planları yüklenemedi.' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubscribe = async (plan: Plan) => {
        if (!confirm(`${plan.name} planına ${formatPrice(plan.price, plan.currency)} karşılığında abone olmak istiyor musunuz?`)) return;

        try {
            setIsSubscribing(true);
            setMessage(null);
            const newSub = await subscribeToPlan(plan.id);
            setCurrentSubscription(newSub);
            setMessage({ type: 'success', text: `${plan.name} planına başarıyla abone oldunuz.` });
        } catch (err) {
            console.error(err);
            const disabled = axios.isAxiosError(err) && err.response?.status === 403;
            setMessage({
                type: 'error',
                text: disabled
                    ? 'Kendi kendine abonelik şu anda kapalı. Lütfen yönetici ile iletişime geçin.'
                    : 'Abonelik başlatılamadı. Lütfen tekrar deneyin.'
            });
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto mb-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Abonelik</h1>
            <p className="text-gray-500 mb-8">Premium kitaplara erişmek için bir plan seçin.</p>

            <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Aboneliğim</h2>
                <SubscriptionStatus subscription={currentSubscription} isLoading={isLoading} />
            </div>

            {message && (
                <div className={`p-4 rounded-lg mb-8 text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Planlar</h2>
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : plans.length === 0 ? (
                <p className="text-gray-500">Şu anda satın alınabilecek bir plan bulunmuyor.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map(plan => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            isCurrentPlan={currentSubscription?.active === true && currentSubscription.plan === plan.subscriptionPlan}
                            onSubscribe={handleSubscribe}
                            isLoading={isSubscribing}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubscriptionPage;
