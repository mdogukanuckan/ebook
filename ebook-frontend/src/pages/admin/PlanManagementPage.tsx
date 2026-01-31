import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import { getAllPlans, createPlan, updatePlan, deletePlan } from '../../features/subscription/services/planService';
import type { Plan, CreatePlanRequest } from '../../features/subscription/types/plan';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { useAppDispatch } from '../../store/hooks';
import { addToast } from '../../store/slices/uiSlice';
import styles from './PlanManagementPage.module.css';

const PlanManagementPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CreatePlanRequest>();

    const fetchPlans = async () => {
        try {
            const data = await getAllPlans();
            setPlans(data);
        } catch (error) {
            dispatch(addToast({ message: 'Planlar yüklenirken hata oluştu.', type: 'error' }));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const openModal = (plan?: Plan) => {
        if (plan) {
            setEditingPlan(plan);
            setValue('name', plan.name);
            setValue('description', plan.description);
            setValue('price', plan.price);
            setValue('durationDays', plan.durationDays);
            setValue('subscriptionPlan', plan.subscriptionPlan);
        } else {
            setEditingPlan(null);
            reset({
                name: '',
                description: '',
                price: 0,
                durationDays: 30,
                subscriptionPlan: 'PREMIUM'
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPlan(null);
        reset();
    };

    const onSubmit = async (data: CreatePlanRequest) => {
        try {
            if (editingPlan) {
                await updatePlan(editingPlan.id, data);
                dispatch(addToast({ message: 'Plan başarıyla güncellendi.', type: 'success' }));
            } else {
                await createPlan(data);
                dispatch(addToast({ message: 'Yeni plan oluşturuldu.', type: 'success' }));
            }
            closeModal();
            fetchPlans();
        } catch (error) {
            dispatch(addToast({ message: 'İşlem başarısız oldu.', type: 'error' }));
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Bu planı silmek istediğinize emin misiniz?')) {
            try {
                await deletePlan(id);
                dispatch(addToast({ message: 'Plan silindi.', type: 'success' }));
                fetchPlans();
            } catch (error) {
                dispatch(addToast({ message: 'Plan silinemedi.', type: 'error' }));
            }
        }
    };

    if (isLoading) return <LoadingScreen message="Planlar yükleniyor..." />;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Abonelik Planları</h1>
                <button className={styles.addButton} onClick={() => openModal()}>
                    <Plus size={20} />
                    Yeni Plan Ekle
                </button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Plan Adı</th>
                            <th>Fiyat</th>
                            <th>Süre (Gün)</th>
                            <th>Erişim Seviyesi</th>
                            <th>Durum</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map((plan) => (
                            <tr key={plan.id}>
                                <td>
                                    <div className="font-semibold">{plan.name}</div>
                                    <div className="text-sm text-gray-500">{plan.description}</div>
                                </td>
                                <td>{plan.price} {plan.currency}</td>
                                <td>{plan.durationDays}</td>
                                <td>
                                    <span className={`${styles.badge} ${styles[plan.subscriptionPlan]}`}>
                                        {plan.subscriptionPlan}
                                    </span>
                                </td>
                                <td>
                                    <span className={plan.active ? 'text-green-600 font-medium' : 'text-red-500'}>
                                        {plan.active ? 'Aktif' : 'Pasif'}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button
                                            className={`${styles.actionButton} ${styles.edit}`}
                                            onClick={() => openModal(plan)}
                                            title="Düzenle"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            className={`${styles.actionButton} ${styles.delete}`}
                                            onClick={() => handleDelete(plan.id)}
                                            title="Sil"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {plans.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">
                                    Henüz plan bulunmuyor.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                {editingPlan ? 'Planı Düzenle' : 'Yeni Plan Ekle'}
                            </h2>
                            <button onClick={closeModal} className={styles.closeButton}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Plan Adı</label>
                                <input
                                    {...register('name', { required: true })}
                                    className={styles.input}
                                    placeholder="Örn: Yıllık Premium"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Açıklama</label>
                                <textarea
                                    {...register('description')}
                                    className={styles.textarea}
                                    placeholder="Plan detayları..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Fiyat</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('price', { required: true, min: 0 })}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Süre (Gün)</label>
                                    <input
                                        type="number"
                                        {...register('durationDays', { required: true, min: 1 })}
                                        className={styles.input}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Erişim Seviyesi</label>
                                <select
                                    {...register('subscriptionPlan', { required: true })}
                                    className={styles.select}
                                >
                                    <option value="FREE">FREE</option>
                                    <option value="PREMIUM">PREMIUM</option>
                                    <option value="VIP">VIP</option>
                                </select>
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" onClick={closeModal} className={styles.cancelButton}>
                                    İptal
                                </button>
                                <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanManagementPage;
