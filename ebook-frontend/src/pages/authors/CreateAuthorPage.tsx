import React from 'react';
import { AuthorForm } from '../../features/books/components/AuthorForm';
import styles from './CreateAuthorPage.module.css';

const CreateAuthorPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <AuthorForm />
        </div>
    );
};

export default CreateAuthorPage;
