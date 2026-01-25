import React from 'react';
import { BookForm } from '../../features/books/components/BookForm';
import styles from './CreateBookPage.module.css';

const CreateBookPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <BookForm />
        </div>
    );
};

export default CreateBookPage;
