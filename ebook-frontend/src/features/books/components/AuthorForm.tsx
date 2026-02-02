import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createAuthor } from '../services/authorService';
import { Loader2 } from 'lucide-react';
import styles from './AuthorForm.module.css';

interface CreateAuthorForm {
    name: string;
    biography: string;
}

export const AuthorForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<CreateAuthorForm>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: CreateAuthorForm) => {
        try {
            setIsLoading(true);
            setError(null);
            await createAuthor(data.name, data.biography);
            navigate('/books/new'); 
        } catch (err) {
            console.error(err);
            setError('Failed to create author. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <h2 className={styles.title}>Add New Author</h2>

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
                    placeholder="e.g. J.K. Rowling"
                />
                {errors.name && <p className={styles.errorMessage}>{errors.name.message}</p>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Biography</label>
                <textarea
                    {...register('biography', { required: 'Biography is required' })}
                    rows={4}
                    className={styles.textarea}
                    placeholder="Short biography about the author..."
                />
                {errors.biography && <p className={styles.errorMessage}>{errors.biography.message}</p>}
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
                    'Create Author'
                )}
            </button>
        </form>
    );
};
