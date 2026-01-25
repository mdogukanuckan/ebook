import React from 'react';
import { CategoryForm } from '../../features/books/components/CategoryForm';
import styles from './CreateCategoryPage.module.css';

const CreateCategoryPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <CategoryForm />
        </div>
    );
};

export default CreateCategoryPage;
