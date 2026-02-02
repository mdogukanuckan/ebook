import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createCategory } from '../services/categoryService';
import { Loader2 } from 'lucide-react';
import styles from './CategoryForm.module.css';

interface CreateCategoryForm {
    name: string;
    description: string;
}

export const CategoryForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<CreateCategoryForm>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: CreateCategoryForm) => {
        try {
            setIsLoading(true);
            setError(null);
            await createCategory(data.name, data.description);
            navigate('/books/new'); 
        } catch (err) {
            console.error(err);
            setError('Failed to create category. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <h2 className={styles.title}>Add New Category</h2>

            {error && (
                <div className={styles.errorAlert}>
                    {error}
                </div>
            )}

            <div className={styles.formGroup}>
                <label className={styles.label}>Name</label>
                <input
                    {...register('name', { required: 'Name is required' })}
                    className={styles.input}
                    placeholder="e.g. Science Fiction"
                />
                {errors.name && <p className={styles.errorMessage}>{errors.name.message}</p>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows={4}
                    className={styles.textarea}
                    placeholder="Description about the category..."
                />
                {errors.description && <p className={styles.errorMessage}>{errors.description.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={styles.submitButton}
            >
                {isLoading ? (
                    <>
                        <Loader2 className={styles.loader} size={20} />
                        Creating...
                    </>
                ) : (
                    'Create Category'
                )}
            </button>
        </form>
    );
};
