import React, { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../features/books/services/categoryService';
import type { Category } from '../../features/books/types';
import styles from './ManagementPage.module.css';
import { Plus, Edit, Trash2, Search, Loader2, Tag } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { addToast } from '../../store/slices/uiSlice';
import { Modal } from '../../components/common/Modal/Modal';

const CategoryManagementPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            dispatch(addToast({ message: 'Kategori listesi yüklenemedi.', type: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;
        try {
            await deleteCategory(id);
            setCategories(categories.filter(c => c.id !== id));
            dispatch(addToast({ message: 'Kategori silindi.', type: 'success' }));
        } catch (error: any) {
            dispatch(addToast({ message: error.response?.data?.message || 'Kategori silinemedi.', type: 'error' }));
        }
    };

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, description: category.description || '' });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingCategory) {
                const updated = await updateCategory(editingCategory.id, formData);
                setCategories(categories.map(c => c.id === updated.id ? updated : c));
                dispatch(addToast({ message: 'Kategori güncellendi.', type: 'success' }));
            } else {
                const created = await createCategory(formData);
                setCategories([...categories, created]);
                dispatch(addToast({ message: 'Kategori oluşturuldu.', type: 'success' }));
            }
            setIsModalOpen(false);
        } catch (error) {
            dispatch(addToast({ message: 'İşlem başarısız oldu.', type: 'error' }));
        } finally {
            setSubmitting(false);
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Kategori Yönetimi</h1>
                    <p className={styles.description}>Sistemdeki kitap kategorilerini yönetin.</p>
                </div>
                <button className={styles.addButton} onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    <span>Yeni Kategori</span>
                </button>
            </div>

            <div className={styles.searchBar}>
                <div className={styles.searchInner}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Kategori ara..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.list}>
                {filteredCategories.map(category => (
                    <div key={category.id} className={styles.itemCard}>
                        <div className={styles.itemInfo}>
                            <div className={styles.avatar} style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                                <Tag size={24} />
                            </div>
                            <div>
                                <h3 className={styles.itemName}>{category.name}</h3>
                                <p className={styles.itemSubtext}>{category.description || 'Açıklama yok'}</p>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.actionButton} onClick={() => handleOpenModal(category)}><Edit size={18} /></button>
                            <button className={`${styles.actionButton} ${styles.danger}`} onClick={() => handleDelete(category.id)}><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
            >
                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    <div className={styles.formGroup}>
                        <label>Kategori Adı</label>
                        <input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Açıklama</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={styles.textarea}
                        />
                    </div>
                    <button type="submit" disabled={submitting} className={styles.submitButton}>
                        {submitting ? <Loader2 className="animate-spin" size={20} /> : (editingCategory ? 'Güncelle' : 'Oluştur')}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default CategoryManagementPage;
