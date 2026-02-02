import React, { useEffect, useState } from 'react';
import { getAuthors, createAuthor, updateAuthor, deleteAuthor } from '../../features/books/services/authorService';
import type { Author } from '../../features/books/types';
import styles from './ManagementPage.module.css';
import { Plus, Edit, Trash2, Search, Loader2, User } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { addToast } from '../../store/slices/uiSlice';
import { Modal } from '../../components/common/Modal/Modal';

const AuthorManagementPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
    const [formData, setFormData] = useState({ name: '', biography: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadAuthors();
    }, []);

    const loadAuthors = async () => {
        try {
            setLoading(true);
            const data = await getAuthors();
            setAuthors(data);
        } catch (error) {
            dispatch(addToast({ message: 'Yazar listesi yüklenemedi.', type: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bu yazarı silmek istediğinizden emin misiniz?')) return;
        try {
            await deleteAuthor(id);
            setAuthors(authors.filter(a => a.id !== id));
            dispatch(addToast({ message: 'Yazar silindi.', type: 'success' }));
        } catch (error: any) {
            dispatch(addToast({ message: error.response?.data?.message || 'Yazar silinemedi.', type: 'error' }));
        }
    };

    const handleOpenModal = (author?: Author) => {
        if (author) {
            setEditingAuthor(author);
            setFormData({ name: author.name, biography: author.biography || '' });
        } else {
            setEditingAuthor(null);
            setFormData({ name: '', biography: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingAuthor) {
                const updated = await updateAuthor(editingAuthor.id, formData);
                setAuthors(authors.map(a => a.id === updated.id ? updated : a));
                dispatch(addToast({ message: 'Yazar güncellendi.', type: 'success' }));
            } else {
                const created = await createAuthor(formData);
                setAuthors([...authors, created]);
                dispatch(addToast({ message: 'Yazar oluşturuldu.', type: 'success' }));
            }
            setIsModalOpen(false);
        } catch (error) {
            dispatch(addToast({ message: 'İşlem başarısız oldu.', type: 'error' }));
        } finally {
            setSubmitting(false);
        }
    };

    const filteredAuthors = authors.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Yazar Yönetimi</h1>
                    <p className={styles.description}>Sistemdeki tüm yazarları yönetin.</p>
                </div>
                <button className={styles.addButton} onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    <span>Yeni Yazar</span>
                </button>
            </div>

            <div className={styles.searchBar}>
                <div className={styles.searchInner}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Yazar ara..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.list}>
                {filteredAuthors.map(author => (
                    <div key={author.id} className={styles.itemCard}>
                        <div className={styles.itemInfo}>
                            <div className={styles.avatar}>
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className={styles.itemName}>{author.name}</h3>
                                <p className={styles.itemSubtext}>{author.biography?.substring(0, 100)}...</p>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.actionButton} onClick={() => handleOpenModal(author)}><Edit size={18} /></button>
                            <button className={`${styles.actionButton} ${styles.danger}`} onClick={() => handleDelete(author.id)}><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingAuthor ? 'Yazarı Düzenle' : 'Yeni Yazar Ekle'}
            >
                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    <div className={styles.formGroup}>
                        <label>Ad Soyad</label>
                        <input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Biyografi</label>
                        <textarea
                            rows={5}
                            value={formData.biography}
                            onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                            className={styles.textarea}
                        />
                    </div>
                    <button type="submit" disabled={submitting} className={styles.submitButton}>
                        {submitting ? <Loader2 className="animate-spin" size={20} /> : (editingAuthor ? 'Güncelle' : 'Oluştur')}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default AuthorManagementPage;
