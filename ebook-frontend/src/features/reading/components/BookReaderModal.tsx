import React, { useEffect, useState } from 'react';
import { Modal } from '../../../components/common/Modal/Modal';
import { config } from '../../../config/environment';

interface BookReaderModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookId: number;
    bookTitle: string;
}

export const BookReaderModal: React.FC<BookReaderModalProps> = ({
    isOpen,
    onClose,
    bookId,
    bookTitle
}) => {
    const [pdfUrl, setPdfUrl] = useState<string>('');

    useEffect(() => {
        if (isOpen && bookId) {
            const token = localStorage.getItem('accessToken');
            if (token) {
                setPdfUrl(`${config.apiBaseUrl}/books/view/${bookId}?token=${token}`);
            }
        }
    }, [isOpen, bookId]);

    // Custom styles for the modal content to maximize reading area
    // overriding some defaults if necessary, or just using a full-height container
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={bookTitle}
            size="full"
        >
            <div style={{ width: '100%', height: 'calc(90vh - 120px)', position: 'relative' }}>
                {pdfUrl ? (
                    <iframe
                        src={pdfUrl}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '0.5rem',
                            border: '1px solid #e5e7eb'
                        }}
                        title={`Reading: ${bookTitle}`}
                    />
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#1f2937'
                    }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Kitap yükleniyor...</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Lütfen bekleyin (PDF URL oluşturuluyor)</div>
                    </div>
                )}
            </div>
        </Modal>
    );
};
