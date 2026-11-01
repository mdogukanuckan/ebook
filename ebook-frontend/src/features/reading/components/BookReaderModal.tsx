import React from 'react';
import { Modal } from '../../../components/common/Modal/Modal';
import { useBookPdf } from '../hooks/useBookPdf';
import { BookPdfNotice } from './BookPdfNotice';

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
    const { url: pdfUrl, status } = useBookPdf(bookId, isOpen);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={bookTitle}
            size="full"
        >
            <div style={{ width: '100%', height: 'calc(90vh - 120px)', position: 'relative' }}>
                {status === 'ready' ? (
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
                    <BookPdfNotice status={status} />
                )}
            </div>
        </Modal>
    );
};
