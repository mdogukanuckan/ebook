import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { createBook } from '../services/bookService';
import { getAuthors } from '../services/authorService';
import { getCategories } from '../services/categoryService';
import type { CreateBookRequest, Author, Category } from '../types';
import { Loader2 } from 'lucide-react';
import styles from './BookForm.module.css';

export const BookForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<CreateBookRequest>();
    const navigate = useNavigate();
    const [authors, setAuthors] = useState<Author[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingOptions, setIsFetchingOptions] = useState(true);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [authorsData, categoriesData] = await Promise.all([
                    getAuthors(),
                    getCategories()
                ]);
                setAuthors(authorsData);
                setCategories(categoriesData);
            } catch (err) {
                console.error('Failed to fetch options', err);
                setSubmitError('Failed to load authors or categories.');
            } finally {
                setIsFetchingOptions(false);
            }
        };
        fetchOptions();
    }, []);

    const onSubmit = async (data: CreateBookRequest) => {
        try {
            setIsLoading(true);
            setSubmitError(null);
            const formattedData = {
                ...data,
                price: Number(data.price),
                authorId: Number(data.authorId),
                categoryIds: Array.isArray(data.categoryIds)
                    ? data.categoryIds.map(Number)
                    : [Number(data.categoryIds)]
            };

            await createBook(formattedData);
            navigate('/books');
        } catch (err) {
            console.error(err);
            setSubmitError('Failed to create book. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetchingOptions) {
        return <div className="flex justify-center p-8"><Loader2 className={styles.loader} /></div>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <h2 className={styles.title}>Add New Book</h2>

            {submitError && (
                <div className={styles.errorAlert}>
                    {submitError}
                </div>
            )}

            <div className={styles.formGroup}>
                <label className={styles.label}>Title</label>
                <input
                    {...register('title', { required: 'Title is required' })}
                    className={styles.input}
                    placeholder="Enter book title"
                />
                {errors.title && <p className={styles.errorMessage}>{errors.title.message}</p>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows={4}
                    className={styles.textarea}
                    placeholder="Enter book description"
                />
                {errors.description && <p className={styles.errorMessage}>{errors.description.message}</p>}
            </div>

            <div className={styles.grid}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Price ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register('price', { required: 'Price is required', min: 0 })}
                        className={styles.input}
                    />
                    {errors.price && <p className={styles.errorMessage}>{errors.price.message}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Cover Image URL</label>
                    <input
                        {...register('coverImage')}
                        className={styles.input}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.formGroup}>
                    <div className={styles.headerRow}>
                        <label className={styles.label}>Author</label>
                        <Link to="/authors/new" className={styles.createLink}>+ New Author</Link>
                    </div>
                    <select
                        {...register('authorId', { required: 'Author is required' })}
                        className={styles.select}
                    >
                        <option value="">Select Author</option>
                        {authors.map(author => (
                            <option key={author.id} value={author.id}>{author.name}</option>
                        ))}
                    </select>
                    {errors.authorId && <p className={styles.errorMessage}>{errors.authorId.message}</p>}
                </div>

                <div className={styles.formGroup}>
                    <div className={styles.headerRow}>
                        <label className={styles.label}>Categories</label>
                        <Link to="/categories/new" className={styles.createLink}>+ New Category</Link>
                    </div>
                    <select
                        multiple
                        {...register('categoryIds', { required: 'At least one category is required' })}
                        className={styles.multiSelect}
                    >
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    <p className={styles.helperText}>Hold Ctrl (Cmd) to select multiple</p>
                    {errors.categoryIds && <p className={styles.errorMessage}>{errors.categoryIds.message}</p>}
                </div>
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
                    'Create Book'
                )}
            </button>
        </form>
    );
};
