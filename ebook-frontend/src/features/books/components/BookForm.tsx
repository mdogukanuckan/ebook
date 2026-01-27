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
    // Extend the form type to include file inputs
    interface BookFormData extends Omit<CreateBookRequest, 'coverImage'> {
        coverImage: FileList;
        file: FileList;
    }

    const { register, handleSubmit, formState: { errors } } = useForm<BookFormData>();
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

    const onSubmit = async (data: BookFormData) => {
        try {
            setIsLoading(true);
            setSubmitError(null);

            const formData = new FormData();

            // Prepare the JSON part (BookCreateDTO)
            const bookData = {
                title: data.title,
                description: data.description,
                price: Number(data.price),
                authorId: Number(data.authorId),
                categoryIds: Array.isArray(data.categoryIds)
                    ? data.categoryIds.map(Number)
                    : [Number(data.categoryIds)],
                isbn: data.isbn,
                // publishedDate could be added if form supports it
            };

            // Append JSON part with Content-Type application/json
            formData.append('book', new Blob([JSON.stringify(bookData)], { type: 'application/json' }));

            // Append Main Book File (PDF/EPUB)
            if (data.file && data.file[0]) {
                formData.append('file', data.file[0]);
            } else {
                throw new Error("Book file is required");
            }

            // Append Cover Image (Optional)
            if (data.coverImage && data.coverImage[0]) {
                formData.append('coverImage', data.coverImage[0]);
            }

            // Call service which now accepts FormData
            // We need to cast formData to any because legacy type definition might conflict, 
            // but we updated the service signature to accept FormData.
            await createBook(formData);
            navigate('/books');
        } catch (err: any) {
            console.error(err);
            setSubmitError(err.message || 'Failed to create book. Please try again.');
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
            </div>

            <div className={styles.grid}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Author</label>
                    <div className="flex gap-2"> {/* Improved layout for author select */}
                        <select
                            {...register('authorId', { required: 'Author is required' })}
                            className={styles.select}
                        >
                            <option value="">Select Author</option>
                            {authors.map(author => (
                                <option key={author.id} value={author.id}>{author.name}</option>
                            ))}
                        </select>
                        <Link to="/authors/new" className={styles.createLink} style={{ whiteSpace: 'nowrap', alignSelf: 'center' }}>+ New</Link>
                    </div>
                    {errors.authorId && <p className={styles.errorMessage}>{errors.authorId.message}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>ISBN</label>
                    <input
                        {...register('isbn', { required: 'ISBN is required' })}
                        className={styles.input}
                        placeholder="978-3-16-148410-0"
                    />
                    {errors.isbn && <p className={styles.errorMessage}>{errors.isbn.message}</p>}
                </div>
            </div>

            {/* File Uploads Section */}
            <div className={styles.grid}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Book File (PDF/EPUB)</label>
                    <input
                        type="file"
                        accept=".pdf,.epub"
                        {...register('file', { required: 'Book file is required' })}
                        className={styles.fileInput} // Use or Create this class
                    />
                    {errors.file && <p className={styles.errorMessage}>{errors.file.message}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Cover Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register('coverImage')}
                        className={styles.fileInput}
                    />
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Categories</label>
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
